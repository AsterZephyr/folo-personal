import { FeedViewType } from "@follow/constants"
import { getEntry, getEntryIdsByFeedIds, getEntryIdsByView } from "@follow/store/entry/getter"
import { entrySyncServices } from "@follow/store/entry/store"
import { getFeedById } from "@follow/store/feed/getter"
import { getCategoryFeedIds, getSubscriptionByEntryId } from "@follow/store/subscription/getter"
import { useSubscriptionStore } from "@follow/store/subscription/store"

import { getGeneralSettings } from "~/atoms/settings/general"
import {
  FEED_COLLECTION_LIST,
  ROUTE_FEED_IN_FOLDER,
  ROUTE_FEED_IN_INBOX,
  ROUTE_FEED_IN_LIST,
  ROUTE_FEED_PENDING,
} from "~/constants"
import { getRouteParams } from "~/hooks/biz/useRouteParams"
import { isLocalAIEnabled } from "~/lib/local-ai"

import type {
  AIChatContextBlock,
  BizUIMessagePart,
  LocalContextSnapshot,
  LocalEvidenceEntry,
  LocalReadingScope,
} from "./types"

export const LOCAL_CONTEXT_LIMIT = 80_000
export const LOCAL_REQUEST_LIMIT = 120_000
export const LOCAL_HISTORY_LIMIT = 40_000
export const LOCAL_ENTRY_LIMIT = 50
export const LOCAL_IMPORTANCE_SHORTCUT_ID = "personal-rank-timeline"

export function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Request cancelled", "AbortError")
}

/** Stop waiting even if the data SDK cannot cancel its underlying request. */
export function awaitWithAbort<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  throwIfAborted(signal)
  if (!signal) return promise
  return new Promise<T>((resolve, reject) => {
    const abort = () => reject(new DOMException("Request cancelled", "AbortError"))
    signal.addEventListener("abort", abort, { once: true })
    promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", abort))
  })
}

export function plainSourceText(html: string): string {
  const document = new DOMParser().parseFromString(html, "text/html")
  document.querySelectorAll("script,style,noscript").forEach((element) => element.remove())
  return (document.body.textContent || "").replace(/\s+/g, " ").trim()
}

export function scopeFromBlocks(
  blocks: AIChatContextBlock[],
  defaults: Pick<LocalReadingScope, "view" | "unreadOnly" | "excludePrivate">,
): LocalReadingScope {
  const enabled = blocks.filter((block) => !block.disabled)
  const scope: LocalReadingScope = {
    ...defaults,
    kind: "none",
    capturedAt: new Date().toISOString(),
  }
  const entries = enabled.flatMap((block) => (block.type === "mainEntry" ? [block.value] : []))
  if (entries.length)
    return { ...scope, kind: "article", entryIds: entries.slice(0, LOCAL_ENTRY_LIMIT) }
  const view = enabled.find((block) => block.type === "mainView")
  if (view?.type === "mainView") {
    const parsed = Number(view.value)
    if (!Object.values(FeedViewType).includes(parsed)) throw new Error("Invalid reading view")
    scope.view = parsed
    scope.kind = "view"
  }
  scope.unreadOnly = enabled.some((block) => block.type === "unreadOnly" && block.value === "true")
  const feed = enabled.find((block) => block.type === "mainFeed")
  if (feed?.type !== "mainFeed") return scope
  const value = feed.value
  if (value === ROUTE_FEED_PENDING) return { ...scope, kind: "view" }
  if (value === FEED_COLLECTION_LIST) return { ...scope, kind: "collection" }
  if (value.startsWith(ROUTE_FEED_IN_LIST))
    return { ...scope, kind: "list", listId: value.slice(ROUTE_FEED_IN_LIST.length) }
  if (value.startsWith(ROUTE_FEED_IN_INBOX))
    return { ...scope, kind: "inbox", inboxId: value.slice(ROUTE_FEED_IN_INBOX.length) }
  const feedIds = value.startsWith(ROUTE_FEED_IN_FOLDER)
    ? getCategoryFeedIds(value.slice(ROUTE_FEED_IN_FOLDER.length), scope.view)
    : value.split(",").filter(Boolean)
  if (feedIds.some((id) => !/^\d+$/.test(id)))
    throw new Error("Invalid feed scope; select the feed again")
  return { ...scope, kind: "feed", feedIds: [...new Set(feedIds)] }
}

export function captureLocalScopePart(blocks: AIChatContextBlock[]): BizUIMessagePart[] {
  if (!isLocalAIEnabled()) return []
  const route = getRouteParams()
  const settings = getGeneralSettings()
  return [
    {
      type: "data-local-scope",
      data: scopeFromBlocks(blocks, {
        view: route.view,
        unreadOnly: settings.unreadOnly,
        excludePrivate: settings.hidePrivateSubscriptionsInTimeline,
      }),
    },
  ]
}

export function getLocalPreferenceSources(scope: LocalReadingScope): string {
  const subscriptions = Object.values(useSubscriptionStore.getState().data)
    .filter((sub) => sub.feedId && !sub.isPrivate && !sub.hideFromTimeline)
    .filter((sub) => !scope.feedIds?.length || scope.feedIds.includes(sub.feedId!))
    .slice(0, 60)
  return JSON.stringify(
    subscriptions.map((sub) => {
      const feed = getFeedById(sub.feedId)
      return {
        title: sub.title || feed?.title || "",
        category: sub.category || "",
        description: plainSourceText(feed?.description || "").slice(0, 300),
      }
    }),
  ).slice(0, 20_000)
}

export function emptyLocalSnapshot(
  messageId: string,
  scope: LocalReadingScope,
): LocalContextSnapshot {
  return {
    version: 1,
    messageId,
    scope,
    capturedAt: new Date().toISOString(),
    entries: [],
    candidates: [],
    queries: [],
    truncated: false,
    warnings: [],
  }
}

export async function resolveLocalEntries(
  messageId: string,
  scope: LocalReadingScope,
  signal?: AbortSignal,
): Promise<LocalContextSnapshot> {
  const snapshot = emptyLocalSnapshot(messageId, scope)
  throwIfAborted(signal)
  if (scope.kind === "none") return snapshot
  let ids: string[] = []
  if (scope.kind === "article") ids = scope.entryIds || []
  else if (scope.kind === "feed" && !scope.feedIds?.length) return snapshot
  else {
    try {
      const result = await awaitWithAbort(
        entrySyncServices.fetchEntries({
          view: scope.view,
          feedIdList: scope.kind === "feed" ? scope.feedIds : undefined,
          listId: scope.listId,
          inboxId: scope.inboxId,
          isCollection: scope.kind === "collection",
          read: scope.unreadOnly ? false : undefined,
          excludePrivate: scope.excludePrivate,
          aiSort: false,
          sortOrder: "desc",
          limit: LOCAL_ENTRY_LIMIT,
        }),
        signal,
      )
      throwIfAborted(signal)
      ids = result.data.map((row) => row.entries.id)
      snapshot.truncated = ids.length >= LOCAL_ENTRY_LIMIT
    } catch (error) {
      throwIfAborted(signal)
      ids =
        scope.kind === "feed"
          ? getEntryIdsByFeedIds(scope.feedIds) || []
          : scope.kind === "view"
            ? getEntryIdsByView(scope.view, scope.excludePrivate) || []
            : []
      if (!ids.length) throw error
      snapshot.warnings.push(
        "Live retrieval failed; this answer uses locally cached articles, not a fresh timeline.",
      )
    }
  }
  const entries = [...new Set(ids)]
    .map(getEntry)
    .filter((entry) => !!entry)
    .filter((entry) => {
      if (scope.kind === "article") return true
      const sub = getSubscriptionByEntryId(entry.id)
      if (scope.excludePrivate && sub?.isPrivate) return false
      if (scope.kind === "view" && sub?.hideFromTimeline) return false
      return !scope.unreadOnly || !entry.read
    })
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  if (scope.kind === "article" && entries.length !== ids.length)
    throw new Error("Open the selected article first so its content is available locally")
  for (const entry of entries.slice(0, LOCAL_ENTRY_LIMIT)) {
    const text = plainSourceText(
      entry.readabilityContent || entry.content || entry.description || "",
    )
    const maxText = scope.kind === "article" && entries.length === 1 ? 70_000 : 1_200
    const item: LocalEvidenceEntry = {
      id: entry.id,
      title: (entry.title || "").slice(0, 500),
      url: (entry.url || "").slice(0, 2_000),
      publishedAt: entry.publishedAt?.toISOString() || null,
      feedTitle: (getFeedById(entry.feedId)?.title || "").slice(0, 300),
      text: text.slice(0, maxText),
    }
    if (text.length > maxText) snapshot.truncated = true
    if (
      JSON.stringify(snapshot).length + JSON.stringify(item).length >
      LOCAL_CONTEXT_LIMIT - 2_000
    ) {
      snapshot.truncated = true
      break
    }
    snapshot.entries.push(item)
  }
  if (entries.length > snapshot.entries.length) snapshot.truncated = true
  throwIfAborted(signal)
  return snapshot
}
