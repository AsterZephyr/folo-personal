import { createSettingAtom } from "@follow/atoms/helper/setting.js"
import { defaultGeneralSettings } from "@follow/shared/settings/defaults"
import { hookEnhancedSettings as baseHookEnhancedSettings } from "@follow/shared/settings/hook"
import type { GeneralSettings } from "@follow/shared/settings/interface"
import { getStorageNS } from "@follow/utils/ns"
import type { SupportedLanguages } from "@follow-app/client-sdk"
import { useAtomValue } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { useMemo } from "react"

import { jotaiStore } from "~/lib/jotai"
import { getDefaultLanguage } from "~/lib/language"
import { isLocalAIEnabled, useLocalAIConfig } from "~/lib/local-ai"

export const DEFAULT_ACTION_LANGUAGE = "default"

export const createDefaultGeneralSettings = (): GeneralSettings => ({
  ...defaultGeneralSettings,
  language: getDefaultLanguage(),
})

const {
  useSettingKey: useGeneralSettingKeyInternal,
  useSettingSelector: useGeneralSettingSelectorInternal,
  useSettingKeys: useGeneralSettingKeysInternal,
  setSetting: setGeneralSettingOfficial,
  clearSettings: clearGeneralSettings,
  initializeDefaultSettings: initializeDefaultGeneralSettings,
  getSettings: getGeneralSettingsInternal,
  useSettingValue: useGeneralSettingValueInternal,

  settingAtom: __generalSettingAtom,
} = createSettingAtom("general", createDefaultGeneralSettings)
export const hookEnhancedSettings = <
  T1 extends (key: any) => any,
  T2 extends (selector: (s: any) => any) => any,
  T3 extends (keys: any) => any,
  T4 extends () => any,
  T5 extends () => any,
>(
  useSettingKey: T1,
  useSettingSelector: T2,
  useSettingKeys: T3,
  getSettings: T4,
  useSettingValue: T5,

  enhancedSettingKeys: Set<string>,
  defaultSettings: Record<string, any>,
): [T1, T2, T3, T4, T5] => {
  return baseHookEnhancedSettings(
    useSettingKey,
    useSettingSelector,
    useSettingKeys,
    getSettings,
    useSettingValue,

    enhancedSettingKeys,
    defaultSettings,
    {
      useEnhancedEnabled: () => useGeneralSettingKeyInternal("enhancedSettings"),
      getEnhancedEnabled: () => jotaiStore.get(__generalSettingAtom).enhancedSettings,
    },
  )
}

export function useActionLanguage() {
  const actionLanguage = useGeneralSettingSelectorInternal((s) => s.actionLanguage)
  const language = useGeneralSettingSelectorInternal((s) => s.language)
  return (
    actionLanguage === DEFAULT_ACTION_LANGUAGE ? language : actionLanguage
  ) as SupportedLanguages
}

export function getActionLanguage() {
  const { actionLanguage, language } = getGeneralSettingsInternal()
  return (
    actionLanguage === DEFAULT_ACTION_LANGUAGE ? language : actionLanguage
  ) as SupportedLanguages
}

export function useHideAllReadSubscriptions() {
  const hideAllReadSubscriptions = useGeneralSettingKey("hideAllReadSubscriptions")
  const unreadOnly = useGeneralSettingKey("unreadOnly")
  return hideAllReadSubscriptions && unreadOnly
}

/** Device-local general settings: every other general setting syncs to the account. */
export const generalLocalOnlyKeys: (keyof GeneralSettings)[] = [
  "translation",
  "translationMode",
  "summary",
  "appLaunchOnStartup",
  "sendAnonymousData",
  "language",
  "voice",
]

export const enhancedGeneralSettingKeys = new Set<keyof GeneralSettings>([
  "groupByDate",
  "autoExpandLongSocialMedia",
])

const [
  useGeneralSettingKeyOfficial,
  useGeneralSettingSelector,
  useGeneralSettingKeys,
  getGeneralSettingsOfficial,
  useGeneralSettingValueOfficial,
] = hookEnhancedSettings(
  useGeneralSettingKeyInternal,
  useGeneralSettingSelectorInternal,
  useGeneralSettingKeysInternal,
  getGeneralSettingsInternal,
  useGeneralSettingValueInternal,

  enhancedGeneralSettingKeys,
  defaultGeneralSettings,
)
// These preferences belong to the independent local AI service, never the cloud account.
type LocalReadingSettings = Pick<GeneralSettings, "translation" | "translationMode" | "summary">
const localReadingAtom = atomWithStorage<LocalReadingSettings>(
  getStorageNS("personal-ai-reading"),
  { translation: false, translationMode: "bilingual", summary: defaultGeneralSettings.summary },
  undefined,
  { getOnInit: true },
)
const isLocalReadingKey = (key: keyof GeneralSettings): key is keyof LocalReadingSettings =>
  key === "translation" || key === "translationMode" || key === "summary"

const setGeneralSetting = <K extends keyof GeneralSettings>(key: K, value: GeneralSettings[K]) => {
  if (isLocalAIEnabled() && isLocalReadingKey(key)) {
    jotaiStore.set(localReadingAtom, { ...jotaiStore.get(localReadingAtom), [key]: value })
    return
  }
  setGeneralSettingOfficial(key, value)
}

const getGeneralSettings = (): GeneralSettings => {
  const official = getGeneralSettingsOfficial()
  return isLocalAIEnabled() ? { ...official, ...jotaiStore.get(localReadingAtom) } : official
}

const useGeneralSettingKey = <K extends keyof GeneralSettings>(key: K): GeneralSettings[K] => {
  const official = useGeneralSettingKeyOfficial(key)
  const local = useAtomValue(localReadingAtom, { store: jotaiStore })
  const localAI = useLocalAIConfig()
  const effective: GeneralSettings = { ...getGeneralSettingsOfficial(), ...local }
  return localAI.enabled && isLocalReadingKey(key) ? effective[key] : official
}

const useGeneralSettingValue = Object.assign(
  function useLocalGeneralSettingValue(): GeneralSettings {
    const official = useGeneralSettingValueOfficial()
    const local = useAtomValue(localReadingAtom, { store: jotaiStore })
    const localAI = useLocalAIConfig()
    return useMemo(
      () => (localAI.enabled ? { ...official, ...local } : official),
      [official, local, localAI.enabled],
    )
  },
  { select: useGeneralSettingSelector },
)

export {
  __generalSettingAtom,
  clearGeneralSettings,
  getGeneralSettings,
  initializeDefaultGeneralSettings,
  setGeneralSetting,
  useGeneralSettingKey,
  useGeneralSettingKeys,
  useGeneralSettingSelector,
  useGeneralSettingValue,
}
