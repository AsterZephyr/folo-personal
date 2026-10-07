import { UserRole } from "@follow/constants"
import { useUserStore } from "@follow/store/user/store"
import { EventBus } from "@follow/utils/event-bus"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, test, vi } from "vitest"

import { jotaiStore } from "~/lib/jotai"

import {
  __generalSettingAtom,
  generalLocalOnlyKeys,
  getGeneralSettings,
  setGeneralSetting,
  useGeneralSettingKey,
  useGeneralSettingValue,
} from "./general"

const state = vi.hoisted(() => ({ localEnabled: true }))
vi.mock("~/lib/local-ai", () => ({
  isLocalAIEnabled: () => state.localEnabled,
  useLocalAIConfig: () => ({ enabled: state.localEnabled }),
}))
vi.mock("~/lib/language", () => ({ getDefaultLanguage: () => "en" }))

const ReadingState = () => {
  const translation = useGeneralSettingKey("translation")
  const settings = useGeneralSettingValue()
  return (
    <div>
      {String(translation)}:{String(settings.translation)}:{settings.translationMode}
    </div>
  )
}

beforeEach(() => {
  ;(globalThis as typeof globalThis & { React: typeof React }).React = React
  state.localEnabled = true
  useUserStore.setState({ role: UserRole.Free })
  setGeneralSetting("translation", false)
  setGeneralSetting("translationMode", "bilingual")
})

describe("independent local AI reading preferences", () => {
  test("allows free accounts to enable translation, persists it locally, and does not emit a cloud settings event", () => {
    const changed = vi.fn()
    const unsubscribe = EventBus.subscribe("SETTING_CHANGE_EVENT", changed)
    setGeneralSetting("translation", true)
    setGeneralSetting("translationMode", "translation-only")
    expect(getGeneralSettings().translation).toBe(true)
    expect(renderToStaticMarkup(<ReadingState />)).toContain("true:true:translation-only")
    expect(changed).not.toHaveBeenCalled()
    const stored = Array.from({ length: localStorage.length }, (_, index) =>
      localStorage.key(index),
    )
      .filter((key): key is string => !!key && key.includes("personal-ai-reading"))
      .map((key) => localStorage.getItem(key))
    expect(stored.some((value) => value?.includes('"translation":true'))).toBe(true)
    unsubscribe()
  })
  test("cloud refresh cannot overwrite local reading choices and official gates return when local AI is disabled", () => {
    setGeneralSetting("translation", true)
    jotaiStore.set(__generalSettingAtom, {
      ...jotaiStore.get(__generalSettingAtom),
      translation: false,
    })
    expect(getGeneralSettings().translation).toBe(true)
    state.localEnabled = false
    expect(getGeneralSettings().translation).toBe(false)
    state.localEnabled = true
    expect(getGeneralSettings().translation).toBe(true)
    expect(generalLocalOnlyKeys).toEqual(
      expect.arrayContaining(["translation", "translationMode", "summary"]),
    )
  })
})
