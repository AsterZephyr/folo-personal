import { useTranslation } from "react-i18next"

import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"

import type { LocalContextSnapshot } from "../../store/types"

export function LocalContextResult({ snapshot }: { snapshot: LocalContextSnapshot }) {
  const { t } = useTranslation("ai")
  const navigateEntry = useNavigateEntry()
  const isDirectory = snapshot.queries.length > 0
  const count = isDirectory ? snapshot.candidates.length : snapshot.entries.length
  if (snapshot.scope.kind === "none" && !isDirectory && !snapshot.historyTrimmed) return null
  return (
    <div
      className="my-3 space-y-3 rounded-lg border border-border bg-fill-quaternary p-3 text-sm"
      data-testid="local-context-result"
    >
      {isDirectory && <div className="font-medium">{t("local_context.directory")}</div>}
      <div className="text-xs text-text-secondary">
        {t("local_context.snapshot", {
          count,
          time: new Date(snapshot.capturedAt).toLocaleString(),
        })}
      </div>
      {snapshot.truncated && (
        <div className="text-xs text-text-secondary">{t("local_context.truncated")}</div>
      )}
      {snapshot.historyTrimmed && (
        <div className="text-xs text-text-secondary">{t("local_context.history_trimmed")}</div>
      )}
      {snapshot.warnings.map((warning) => (
        <div key={warning} className="text-xs text-orange">
          {warning}
        </div>
      ))}
      {count === 0 && <div>{t("local_context.empty")}</div>}
      {snapshot.candidates.map((candidate) => (
        <div
          key={candidate.id}
          className="space-y-1 rounded-md border border-border bg-background p-3"
        >
          <button
            type="button"
            className="text-left font-medium text-accent hover:underline"
            onClick={() => navigateEntry({ feedId: candidate.id, entryId: null })}
          >
            {candidate.title}
          </button>
          {candidate.reason && <p className="text-text-secondary">{candidate.reason}</p>}
          <p className="break-all text-xs text-text-tertiary">{candidate.url}</p>
          {candidate.latestPublishedAt && (
            <p className="text-xs text-text-secondary">
              {t("local_context.latest", {
                time: new Date(candidate.latestPublishedAt).toLocaleString(),
              })}
            </p>
          )}
          <button
            type="button"
            className="text-xs text-accent hover:underline"
            onClick={() => navigateEntry({ feedId: candidate.id, entryId: null })}
          >
            {t("local_context.preview")}
          </button>
        </div>
      ))}
    </div>
  )
}
