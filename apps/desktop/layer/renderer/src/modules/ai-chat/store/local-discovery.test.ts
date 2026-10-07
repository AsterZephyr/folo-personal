import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  discoverLocalSources,
  parseDiscoveryQueries,
  selectRankedCandidates,
} from "./local-discovery"
import type { LocalFeedCandidate, LocalReadingScope } from "./types"

const mocks = vi.hoisted(() => ({
  discover: vi.fn(),
  subscriptions: {} as Record<string, { feedId: string }>,
  complete: vi.fn(),
}))
vi.mock("~/lib/api-client", () => ({
  followClient: { api: { discover: { discover: mocks.discover } } },
}))
vi.mock("@follow/store/feed/getter", () => ({ getFeedById: () => undefined }))
vi.mock("@follow/store/subscription/store", () => ({
  useSubscriptionStore: { getState: () => ({ data: mocks.subscriptions }) },
}))
vi.mock("./local-context", () => ({
  awaitWithAbort: async <T>(promise: Promise<T>, signal?: AbortSignal) => {
    const value = await promise
    if (signal?.aborted) throw new DOMException("Request cancelled", "AbortError")
    return value
  },
  throwIfAborted: (signal?: AbortSignal) => {
    if (signal?.aborted) throw new DOMException("Request cancelled", "AbortError")
  },
  emptyLocalSnapshot: (messageId: string, scope: LocalReadingScope) => ({
    version: 1,
    messageId,
    scope,
    capturedAt: "2026-10-07",
    entries: [],
    candidates: [],
    queries: [],
    truncated: false,
    warnings: [],
  }),
  getLocalPreferenceSources: () => "[]",
  plainSourceText: (text: string) => text,
}))
const scope: LocalReadingScope = {
  kind: "none",
  view: 0,
  unreadOnly: false,
  excludePrivate: true,
  capturedAt: "2026-10-07",
}
const candidate = (id: string): LocalFeedCandidate => ({
  id,
  title: id,
  url: `https://example.com/${id}/rss`,
  siteUrl: `https://example.com/${id}`,
  description: "AI investment",
  latestPublishedAt: "2026-10-07T00:00:00Z",
})
const row = (id: string, errorMessage?: string) => ({
  feed: { ...candidate(id), errorMessage },
  entries: [{ publishedAt: "2026-10-07T00:00:00Z" }],
})

describe("local source directory", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.subscriptions = {}
  })
  it("accepts at most three real keywords, not URL instructions", () => {
    expect(parseDiscoveryQueries('["AI", "a16z", "AI"]')).toEqual(["AI", "a16z"])
    expect(() => parseDiscoveryQueries('["a","b","c","d"]')).toThrow()
    expect(() => parseDiscoveryQueries('["https://evil.example"]')).toThrow()
  })
  it("never accepts invented IDs, duplicate cards or more than eight results", () => {
    const candidates = Array.from({ length: 12 }, (_, i) => candidate(`${i}`))
    const result = selectRankedCandidates(
      JSON.stringify([
        { id: "invented", reason: "fake" },
        ...candidates.map((feed) => ({ id: feed.id, reason: "useful" })),
        { id: "0", reason: "duplicate" },
      ]),
      candidates,
    )
    expect(result).toHaveLength(8)
    expect(result.some((feed) => feed.id === "invented")).toBe(false)
    expect(result[0]?.url).toBe(candidates[0]?.url)
  })
  it("searches real candidates, excludes existing/error rows and gives only 20 to the ranker", async () => {
    mocks.subscriptions = { existing: { feedId: "existing" } }
    mocks.complete
      .mockResolvedValueOnce('["a16z","VC","AI"]')
      .mockResolvedValueOnce('[{"id":"0","reason":"AI investing"}]')
    mocks.discover.mockResolvedValue({
      data: [
        row("existing"),
        row("bad", "503"),
        ...Array.from({ length: 30 }, (_, i) => row(`${i}`)),
      ],
    })
    const result = await discoverLocalSources({
      messageId: "m",
      scope,
      question: "AI VC",
      complete: mocks.complete,
      onStage: vi.fn(),
    })
    expect(mocks.discover).toHaveBeenCalledTimes(3)
    expect(mocks.discover).toHaveBeenCalledWith({ keyword: "a16z", target: "feeds" })
    expect(result.candidates).toEqual([{ ...candidate("0"), reason: "AI investing" }])
    const rankingPrompt = mocks.complete.mock.calls[1]![0][1].content as string
    expect(rankingPrompt).not.toContain('"id":"existing"')
    expect(rankingPrompt).not.toContain('"id":"bad"')
    expect(rankingPrompt.match(/"id":/g) || []).toHaveLength(20)
  })
  it("surfaces total directory failure and never fabricates recommendations", async () => {
    mocks.complete.mockResolvedValue('["AI"]')
    mocks.discover.mockRejectedValue(new Error("offline"))
    await expect(
      discoverLocalSources({
        messageId: "m",
        scope,
        question: "AI",
        complete: mocks.complete,
        onStage: vi.fn(),
      }),
    ).rejects.toThrow("could not be reached")
    expect(mocks.complete).toHaveBeenCalledOnce()
  })
  it("preserves verified results with an explicit warning when ranking fails", async () => {
    mocks.complete
      .mockResolvedValueOnce('["AI"]')
      .mockRejectedValueOnce(new Error("provider offline"))
    mocks.discover.mockResolvedValue({ data: [row("1")] })
    const result = await discoverLocalSources({
      messageId: "m",
      scope,
      question: "AI",
      complete: mocks.complete,
      onStage: vi.fn(),
    })
    expect(result.candidates[0]?.id).toBe("1")
    expect(result.warnings[0]).toContain("without AI ranking")
  })
  it("stops between keyword generation and discovery", async () => {
    const controller = new AbortController()
    mocks.complete.mockImplementation(async () => {
      controller.abort()
      return '["AI"]'
    })
    await expect(
      discoverLocalSources({
        messageId: "m",
        scope,
        question: "AI",
        complete: mocks.complete,
        signal: controller.signal,
        onStage: vi.fn(),
      }),
    ).rejects.toThrow("cancelled")
    expect(mocks.discover).not.toHaveBeenCalled()
  })
})
