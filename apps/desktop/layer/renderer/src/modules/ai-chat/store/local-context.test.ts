import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  awaitWithAbort,
  LOCAL_CONTEXT_LIMIT,
  resolveLocalEntries,
  scopeFromBlocks,
} from "./local-context"
import type { LocalReadingScope } from "./types"

const mocks = vi.hoisted(() => ({
  entries: new Map<string, Record<string, unknown>>(),
  fetch: vi.fn(),
  category: vi.fn(),
  subscription: vi.fn(),
  cached: vi.fn(),
}))
vi.mock("@follow/store/entry/getter", () => ({
  getEntry: (id: string) => mocks.entries.get(id),
  getEntryIdsByView: mocks.cached,
  getEntryIdsByFeedIds: mocks.cached,
}))
vi.mock("@follow/store/entry/store", () => ({ entrySyncServices: { fetchEntries: mocks.fetch } }))
vi.mock("@follow/store/feed/getter", () => ({ getFeedById: () => ({ title: "Feed" }) }))
vi.mock("@follow/store/subscription/getter", () => ({
  getCategoryFeedIds: mocks.category,
  getSubscriptionByEntryId: mocks.subscription,
}))
vi.mock("@follow/store/subscription/store", () => ({
  useSubscriptionStore: { getState: () => ({ data: {} }) },
}))
vi.mock("~/atoms/settings/general", () => ({
  getGeneralSettings: () => ({ unreadOnly: false, hidePrivateSubscriptionsInTimeline: true }),
}))
vi.mock("~/hooks/biz/useRouteParams", () => ({ getRouteParams: () => ({ view: 0 }) }))
vi.mock("~/lib/local-ai", () => ({ isLocalAIEnabled: () => true }))

const scope: LocalReadingScope = {
  kind: "view",
  view: 0,
  unreadOnly: false,
  excludePrivate: true,
  capturedAt: "2026-10-07T00:00:00.000Z",
}
function put(id: string, options: Record<string, unknown> = {}) {
  mocks.entries.set(id, {
    id,
    title: id,
    url: `https://example.com/${id}`,
    content: "<p>Evidence</p>",
    publishedAt: new Date("2026-10-07"),
    read: false,
    ...options,
  })
}

describe("local reading context", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.entries.clear()
    mocks.cached.mockReturnValue([])
    mocks.subscription.mockReturnValue(undefined)
  })
  it("snapshots view, multiple feeds and unread filters", () => {
    const result = scopeFromBlocks(
      [
        { id: "v", type: "mainView", value: "0" },
        { id: "f", type: "mainFeed", value: "123,456,123" },
        { id: "u", type: "unreadOnly", value: "true" },
      ],
      scope,
    )
    expect(result).toMatchObject({
      kind: "feed",
      feedIds: ["123", "456"],
      view: 0,
      unreadOnly: true,
    })
  })
  it("does not broaden an empty feed scope", async () => {
    const result = await resolveLocalEntries("m", { ...scope, kind: "feed", feedIds: [] })
    expect(result.entries).toEqual([])
    expect(mocks.fetch).not.toHaveBeenCalled()
  })
  it("limits to 50 and removes read, hidden and private timeline rows", async () => {
    for (let i = 0; i < 60; i++) put(`${i}`, { read: i === 0 })
    mocks.subscription.mockImplementation((id: string) => ({
      isPrivate: id === "1",
      hideFromTimeline: id === "2",
    }))
    mocks.fetch.mockResolvedValue({
      data: [...mocks.entries.keys()].map((id) => ({ entries: { id } })),
    })
    const result = await resolveLocalEntries("m", { ...scope, unreadOnly: true })
    expect(mocks.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        read: false,
        aiSort: false,
        limit: 50,
        sortOrder: "desc",
        excludePrivate: true,
      }),
    )
    expect(result.entries).toHaveLength(50)
    expect(result.entries.some((entry) => ["0", "1", "2"].includes(entry.id))).toBe(false)
    expect(result.truncated).toBe(true)
  })
  it("limits HTML text, excludes scripts and records truncation", async () => {
    put("1", { content: `<script>secret instruction</script><p>${"x".repeat(100_000)}</p>` })
    const result = await resolveLocalEntries("m", { ...scope, kind: "article", entryIds: ["1"] })
    expect(result.entries[0]?.text).not.toContain("secret instruction")
    expect(result.truncated).toBe(true)
    expect(JSON.stringify(result).length).toBeLessThan(LOCAL_CONTEXT_LIMIT)
  })
  it("identifies cache fallback and never silently broadens list failures", async () => {
    put("1")
    mocks.fetch.mockRejectedValue(new Error("offline"))
    mocks.cached.mockReturnValue(["1"])
    const result = await resolveLocalEntries("m", scope)
    expect(result.warnings[0]).toContain("cached")
    await expect(
      resolveLocalEntries("m", { ...scope, kind: "list", listId: "123" }),
    ).rejects.toThrow("offline")
  })
  it("stops waiting immediately when aborted", async () => {
    const controller = new AbortController()
    const task = awaitWithAbort(new Promise(() => {}), controller.signal)
    controller.abort()
    await expect(task).rejects.toThrow("cancelled")
  })
})
