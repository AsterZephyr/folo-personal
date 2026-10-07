import { FollowAPIError } from "@follow-app/client-sdk"
import { beforeEach, describe, expect, test, vi } from "vitest"

import { apiContext } from "../../context"
import { registerLocalAI } from "../../local-ai"
import type { FollowAPI } from "../../types"
import { useEntryStore } from "../entry/store"
import type { EntryModel } from "../entry/types"
import { SummaryGeneratingStatus } from "./enum"
import { summarySyncService, useSummaryStore } from "./store"
import { getGenerateSummaryStatusId } from "./utils"

const { insertSummaryMock } = vi.hoisted(() => ({
  insertSummaryMock: vi.fn(),
}))

vi.mock("@follow/database/services/summary", () => ({
  summaryService: {
    getAllSummaries: vi.fn(),
    insertSummary: insertSummaryMock,
    reset: vi.fn(),
  },
}))

const createEntry = (id: string): EntryModel => ({
  id,
  guid: `${id}-guid`,
  insertedAt: new Date("2026-01-01T00:00:00.000Z"),
  publishedAt: new Date("2026-01-01T00:00:00.000Z"),
})

describe("summarySyncService", () => {
  const entryId = "entry-1"
  const actionLanguage = "en"
  const target = "content"
  const summaryApiMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    registerLocalAI({ isEnabled: () => false, summarize: vi.fn(), translate: vi.fn() })

    useEntryStore.setState({
      data: {
        [entryId]: createEntry(entryId),
      },
    })
    useSummaryStore.setState({
      data: {},
      generatingStatus: {},
    })
    apiContext.provide({
      ai: {
        summary: summaryApiMock,
      },
    } as unknown as FollowAPI)
  })

  test.each([
    { apiData: null, expected: null },
    { apiData: "", expected: null },
  ])(
    "treats empty API summary data as unavailable instead of payment failure",
    async ({ apiData, expected }) => {
      summaryApiMock.mockResolvedValue({ data: apiData })

      await expect(
        summarySyncService.generateSummary({
          entryId,
          target,
          actionLanguage,
        }),
      ).resolves.toBe(expected)

      expect(insertSummaryMock).not.toHaveBeenCalled()
      expect(
        useSummaryStore.getState().generatingStatus[
          getGenerateSummaryStatusId(entryId, actionLanguage, target)
        ],
      ).toBe(SummaryGeneratingStatus.Success)
    },
  )

  test("keeps real API payment errors for the upgrade prompt", async () => {
    const paymentError = new FollowAPIError("Payment required", 402)
    summaryApiMock.mockRejectedValue(paymentError)

    await expect(
      summarySyncService.generateSummary({
        entryId,
        target,
        actionLanguage,
      }),
    ).rejects.toBe(paymentError)

    expect(
      useSummaryStore.getState().generatingStatus[
        getGenerateSummaryStatusId(entryId, actionLanguage, target)
      ],
    ).toBe(SummaryGeneratingStatus.Error)
  })
})

describe("local summary adapter", () => {
  test("uses local content and never falls back to the official service on failure", async () => {
    const summarize = vi.fn().mockRejectedValue(new Error("Custom provider unavailable"))
    const official = vi.fn()
    registerLocalAI({ isEnabled: () => true, summarize, translate: vi.fn() })
    apiContext.provide({ ai: { summary: official } } as unknown as FollowAPI)
    useEntryStore.setState({
      data: { "local-entry": { ...createEntry("local-entry"), content: "Article text" } },
    })
    useSummaryStore.setState({ data: {}, generatingStatus: {} })
    await expect(
      summarySyncService.generateSummary({
        entryId: "local-entry",
        target: "content",
        actionLanguage: "en",
      }),
    ).rejects.toThrow("Custom provider unavailable")
    expect(summarize).toHaveBeenCalledWith("Article text", "en")
    expect(official).not.toHaveBeenCalled()
    registerLocalAI({ isEnabled: () => false, summarize: vi.fn(), translate: vi.fn() })
  })
})
