import { Label } from "@follow/components/ui/label/index.js"
import { useTranslation } from "react-i18next"

import { setAISetting, useAISettingValue } from "~/atoms/settings/ai"
import { useLocalAIConfig } from "~/lib/local-ai"

import { createDefineSettingItem } from "../helper/builder"
import { createSettingBuilder } from "../helper/setting-builder"
import { ByokSection } from "./ai/byok"
import { LocalAISection } from "./ai/LocalAISection"
import { MCPServicesSection } from "./ai/mcp/MCPServicesSection"
import { PanelStyleSection } from "./ai/PanelStyleSection"
import { PersonalizePromptSection } from "./ai/PersonalizePromptSection"
import { AIShortcutsSection } from "./ai/shortcuts/AIShortcutsSection"
import { TaskSchedulingSection } from "./ai/tasks"
import { UsageAnalysisSection } from "./ai/usage"

const SettingBuilder = createSettingBuilder(useAISettingValue)
const defineSettingItem = createDefineSettingItem("ai", useAISettingValue, setAISetting)

export const AI_SETTING_SECTION_IDS = {
  shortcuts: "settings-ai-shortcuts",
  tasks: "settings-ai-tasks",
} as const

export const SettingAI = () => {
  const { t } = useTranslation("ai")
  const localAI = useLocalAIConfig()

  return (
    <div className="mt-4">
      {localAI.enabled && <p className="mb-4 text-sm text-text-secondary">{t("local_ai.capabilities")}</p>}
      <SettingBuilder
        settings={[
          LocalAISection,
          {
            type: "title" as const,
            value: t("features.title"),
          },

          PanelStyleSection,
          defineSettingItem("showSplineButton", {
            label: t("settings.showSplineButton.label"),
            description: t("settings.showSplineButton.description"),
          }),
          defineSettingItem("autoScrollWhenStreaming", {
            label: t("settings.autoScrollWhenStreaming.label"),
            description: t("settings.autoScrollWhenStreaming.description"),
          }),

          {
            type: "title" as const,
            value: t("personalize.title"),
          },

          PersonalizePromptSection,

          {
            type: "title" as const,
            value: t("shortcuts.title"),
            id: AI_SETTING_SECTION_IDS.shortcuts,
          },
          AIShortcutsSection,

          ...(!localAI.enabled ? [
          {
            type: "title" as const,
            value: t("tasks.section.title"),
            id: AI_SETTING_SECTION_IDS.tasks,
          },
          TaskSchedulingSection,

          {
            type: "title" as const,
            value: t("integration.title"),
          },
          MCPServicesSection,

          {
            type: "title" as const,
            value: t("byok.title"),
          },
          ByokSection,

          {
            type: "title" as const,
            value: t("usage_analysis.title"),
          },
          UsageAnalysisSection,
          AISecurityDisclosureSection,
          ] : []),
        ]}
      />
    </div>
  )
}

const AISecurityDisclosureSection = () => {
  const { t } = useTranslation("ai")

  return (
    <div className="mt-6 border-t border-fill-secondary pt-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <i className="i-mgc-safety-certificate-cute-re size-4 text-green" />
          <Label className="text-sm font-medium text-text">{t("integration.security.title")}</Label>
        </div>
        <p className="text-xs leading-relaxed text-text-secondary">
          {t("integration.security.description")}
        </p>
      </div>
    </div>
  )
}
