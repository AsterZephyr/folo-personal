import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeAll, describe, expect, it, vi } from "vitest"

import { LocalAIErrorNotice, RateLimitNotice } from "./RateLimitNotice"

vi.mock("~/atoms/server-configs", () => ({ useIsInMASReview: () => false }))
vi.mock("~/hooks/common/useI18n", () => ({ useI18n: () => ({ ai: (key: string) => key }) }))
vi.mock("~/modules/settings/modal/useSettingModal", () => ({ useSettingModal: () => vi.fn() }))
beforeAll(() => { Object.assign(globalThis, { React }) })
describe("local AI errors", () => {
  it.each(["AI gateway returned HTTP 401", "AI gateway returned HTTP 429", "AI request timed out"])("shows %s without an upgrade action", (message) => {
    const html = renderToStaticMarkup(<LocalAIErrorNotice message={message} />)
    expect(html).toContain(message)
    expect(html).toContain('role="alert"')
    expect(html).not.toContain("button")
    expect(html).not.toContain("upgrade")
  })
  it("retains official plan actions for official rate limits", () => {
    expect(renderToStaticMarkup(<RateLimitNotice message="Official quota" />)).toContain("rate_limit.upgrade_plan_button")
  })
})
