import type { SupportedActionLanguage } from "@follow/shared"

import type { TranslationMode } from "./modules/translation/types"

export interface LocalAIAdapter {
  isEnabled: () => boolean
  revision?: () => unknown
  translate: (
    text: string,
    language: SupportedActionLanguage,
    mode: TranslationMode,
    html: boolean,
  ) => Promise<string>
  summarize: (text: string, language: SupportedActionLanguage) => Promise<string>
}

let adapter: LocalAIAdapter | undefined

export const registerLocalAI = (value: LocalAIAdapter) => {
  adapter = value
}
export const getLocalAI = () => (adapter?.isEnabled() ? adapter : undefined)
