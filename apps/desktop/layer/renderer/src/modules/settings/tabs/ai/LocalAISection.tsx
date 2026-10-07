import { Button } from "@follow/components/ui/button/index.js"
import { Input } from "@follow/components/ui/input/index.js"
import { Label } from "@follow/components/ui/label/index.jsx"
import { Switch } from "@follow/components/ui/switch/index.js"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { ipcServices } from "~/lib/client"
import { saveLocalAIConfig, useLocalAIConfig } from "~/lib/local-ai"

export const LocalAISection = () => {
  const { t } = useTranslation("ai")
  const config = useLocalAIConfig()
  const [form, setForm] = useState(config)
  const [key, setKey] = useState("")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  useEffect(() => {
    setForm(config)
  }, [config])
  if (!window.electron) return null

  const save = async (test: boolean) => {
    setBusy(true)
    setMessage("")
    try {
      await saveLocalAIConfig({ ...form, ...(key ? { apiKey: key } : {}) })
      setKey("")
      if (test) {
        const result = await ipcServices!.localAI.testConnection({ requestId: crypto.randomUUID() })
        setMessage(`${t("local_ai.connected")}: ${result.model} — ${result.text}`)
      } else setMessage(t("local_ai.saved"))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="my-4 space-y-3 rounded-xl border border-fill-secondary p-4">
      <div className="flex items-center justify-between">
        <Label>{t("local_ai.title")}</Label>
        <Switch
          checked={form.enabled}
          disabled={busy}
          onCheckedChange={(enabled) => setForm({ ...form, enabled })}
        />
      </div>
      <p className="text-xs text-text-secondary">{t("local_ai.description")}</p>
      <label className="block space-y-1 text-sm">
        <span>{t("local_ai.protocol")}</span>
        <select
          className="w-full rounded-lg border border-fill-secondary bg-background p-2"
          value={form.provider}
          disabled={busy}
          onChange={(event) =>
            setForm({
              ...form,
              provider: event.target.value === "anthropic" ? "anthropic" : "openai",
            })
          }
        >
          <option value="openai">OpenAI compatible</option>
          <option value="anthropic">Anthropic compatible</option>
        </select>
      </label>
      <label className="block space-y-1 text-sm">
        <span>Base URL</span>
        <Input
          value={form.baseURL}
          disabled={busy}
          onChange={(event) => setForm({ ...form, baseURL: event.target.value })}
        />
      </label>
      {form.baseURL.startsWith("http://") &&
        !/^http:\/\/(?:localhost|127\.0\.0\.1)(?::|\/|$)/.test(form.baseURL) && (
          <p className="text-xs text-orange">{t("local_ai.http_notice")}</p>
        )}
      <label className="block space-y-1 text-sm">
        <span>{t("local_ai.model")}</span>
        <Input
          value={form.model}
          placeholder="DeepSeek-V4.1-Flash"
          disabled={busy}
          onChange={(event) => setForm({ ...form, model: event.target.value })}
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>API Key {config.hasKey ? `(${t("local_ai.key_saved")})` : ""}</span>
        <Input
          type="password"
          autoComplete="off"
          value={key}
          disabled={busy}
          onChange={(event) => setKey(event.target.value)}
        />
      </label>
      <p className="text-xs text-text-secondary">{t("local_ai.key_help")}</p>
      <div className="flex gap-2">
        <Button disabled={busy} onClick={() => void save(false)}>
          {t("local_ai.save")}
        </Button>
        <Button variant="outline" disabled={busy || !form.enabled} onClick={() => void save(true)}>
          {t("local_ai.test")}
        </Button>
      </div>
      {message && (
        <p role="status" className="break-words text-sm text-text-secondary">
          {message}
        </p>
      )}
    </section>
  )
}
