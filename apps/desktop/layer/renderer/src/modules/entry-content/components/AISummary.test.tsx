import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, test, vi } from "vitest"

import { AISummary } from "./AISummary"

const mocks = vi.hoisted(() => ({ enabled: false, prefetch: vi.fn() }))
vi.mock("@follow/store/entry/hooks", () => ({ useEntry: () => true }))
vi.mock("@follow/store/summary/hooks", () => ({ usePrefetchSummary: mocks.prefetch }))
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
vi.mock("~/atoms/ai-summary", () => ({ useShowAISummary: () => true }))
vi.mock("~/atoms/readability", () => ({ useEntryIsInReadabilitySuccess: () => false }))
vi.mock("~/atoms/settings/general", () => ({ useActionLanguage: () => "zh-CN" }))
vi.mock("~/atoms/settings/ai", () => ({
  AIChatPanelStyle: { Floating: "floating", Fixed: "fixed" },
  setAIPanelVisibility: vi.fn(),
  useAIChatPanelStyle: () => "floating",
  useAIPanelVisibility: () => false,
}))
vi.mock("~/lib/local-ai", () => ({ useLocalAIConfig: () => ({ enabled: mocks.enabled }) }))
vi.mock("~/components/ui/ai-summary-card", () => ({
  AISummaryCardBase: ({
    content,
    suppressUpgrade,
  }: {
    content?: string
    suppressUpgrade?: boolean
  }) => <div data-suppressed={String(suppressUpgrade)}>{content}</div>,
}))

beforeEach(() => {
  ;(globalThis as typeof globalThis & { React: typeof React }).React = React
  mocks.enabled = false
  mocks.prefetch
    .mockReset()
    .mockReturnValue({ data: "Local summary", isLoading: false, error: null })
})
describe("Personal article summaries", () => {
  test("makes no summary request and displays no card when local AI is disabled or unconfigured", () => {
    expect(renderToStaticMarkup(<AISummary entryId="article" />)).toBe("")
    expect(mocks.prefetch).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }))
  })
  test("preserves configured local summaries and suppresses plan promotion", () => {
    mocks.enabled = true
    const html = renderToStaticMarkup(<AISummary entryId="article" />)
    expect(html).toContain("Local summary")
    expect(html).toContain('data-suppressed="true"')
    expect(mocks.prefetch).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }))
  })
})
