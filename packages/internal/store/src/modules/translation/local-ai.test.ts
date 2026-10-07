import { UserRole } from "@follow/constants"
import { beforeEach, describe, expect, test, vi } from "vitest"

import { apiContext } from "../../context"
import { registerLocalAI } from "../../local-ai"
import type { FollowAPI } from "../../types"
import { useEntryStore } from "../entry/store"
import { useUserStore } from "../user/store"
import { translationSyncService, useTranslationStore } from "./store"

vi.mock("@follow/database/services/translation", () => ({
  TranslationService: { insertTranslation: vi.fn(), reset: vi.fn() },
}))

describe("local translation for free accounts", () => {
  const translate = vi.fn()
  const official = vi.fn()
  beforeEach(() => {
    vi.clearAllMocks()
    useUserStore.setState({ role: UserRole.Free })
    useEntryStore.setState({
      data: {
        article: {
          id: "article",
          guid: "article",
          insertedAt: new Date(),
          publishedAt: new Date(),
          title: "English title",
          content: "<p>English article</p>",
        },
      },
    })
    useTranslationStore.setState({ data: {} })
    apiContext.provide({ ai: { translationBatch: official } } as unknown as FollowAPI)
    registerLocalAI({ isEnabled: () => true, translate, summarize: vi.fn() })
  })
  test("translates titles and full text using the local adapter", async () => {
    translate.mockResolvedValue("译文")
    const result = await translationSyncService.generateTranslation({
      entryId: "article",
      language: "zh-CN",
      withContent: true,
      target: "content",
    })
    expect(result?.title).toBe("译文")
    expect(result?.content).toBe("译文")
    expect(translate).toHaveBeenCalledTimes(2)
    expect(official).not.toHaveBeenCalled()
    await translationSyncService.generateTranslation({
      entryId: "article",
      language: "zh-CN",
      withContent: true,
      target: "content",
    })
    expect(translate).toHaveBeenCalledTimes(2)
  })
  test("does not fall back when the custom provider fails", async () => {
    translate.mockRejectedValue(new Error("Provider unavailable"))
    await expect(
      translationSyncService.generateTranslation({
        entryId: "article",
        language: "zh-CN",
        withContent: true,
        target: "content",
      }),
    ).rejects.toThrow("Provider unavailable")
    expect(official).not.toHaveBeenCalled()
  })
  test("discards translations completed after a display-mode change", async () => {
    let finish: ((value: string) => void) | undefined
    translate.mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          finish = resolve
        }),
    )
    const pending = translationSyncService.generateTranslation({
      entryId: "article",
      language: "zh-CN",
      target: "content",
      mode: "bilingual",
    })
    await vi.waitFor(() => expect(translate).toHaveBeenCalledOnce())
    await translationSyncService.generateTranslation({
      entryId: "missing",
      language: "zh-CN",
      target: "content",
      mode: "translation-only",
    })
    finish?.("旧模式译文")
    await expect(pending).rejects.toThrow("settings changed")
    expect(useTranslationStore.getState().data.article).toBeUndefined()
  })
  test("discards translations completed after a provider configuration change", async () => {
    let revision = 1
    let finish: ((value: string) => void) | undefined
    registerLocalAI({
      isEnabled: () => true,
      revision: () => revision,
      translate,
      summarize: vi.fn(),
    })
    translate.mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          finish = resolve
        }),
    )
    const pending = translationSyncService.generateTranslation({
      entryId: "article",
      language: "zh-CN",
      target: "content",
    })
    await vi.waitFor(() => expect(translate).toHaveBeenCalledOnce())
    revision = 2
    finish?.("旧模型译文")
    await expect(pending).rejects.toThrow("settings changed")
    expect(useTranslationStore.getState().data.article).toBeUndefined()
  })
})
