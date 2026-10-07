import type { BizUIMetadata, BizUITools, ToolWithState } from "@folo-services/ai-tools"
import type { IdGenerator, UIMessage, UIMessagePart } from "ai"

export interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  dataUrl?: string
  previewUrl?: string
  uploadStatus?: "processing" | "uploading" | "completed" | "error"
  serverUrl?: string
  errorMessage?: string
  /** Upload progress percentage (0-100) */
  uploadProgress?: number
}

interface BaseContextBlock {
  id: string
  disabled?: boolean
}

export type ValueContextBlockType = "mainView" | "mainEntry" | "mainFeed" | "unreadOnly"
export interface AbstractValueContextBlock<T extends string> extends BaseContextBlock {
  type: T
  value: string
}

export type ValueContextBlock = AbstractValueContextBlock<ValueContextBlockType>

export interface FileAttachmentContextBlock extends BaseContextBlock {
  type: "fileAttachment"
  attachment: FileAttachment
}

export type AIChatContextBlock = ValueContextBlock | FileAttachmentContextBlock

// Helper type for creating new blocks without id
export type AIChatContextBlockInput =
  Omit<ValueContextBlock, "id"> | Omit<FileAttachmentContextBlock, "id">

export type AIChatContextBlockType = AIChatContextBlock["type"]

export interface AIChatStoreInitial {
  blocks: AIChatContextBlock[]
  chatId?: string
  generateId?: IdGenerator
  isLocal?: boolean
  syncStatus?: "local" | "synced"
}

export interface AIChatContextBlocks {
  blocks: AIChatContextBlock[]
}

export type AIDisplayFlowTool = ToolWithState<BizUITools["display_flow_chart"]>

export { type BizUIMetadata, type BizUITools } from "@folo-services/ai-tools"
export type BizUIDataTypes = {
  "rich-text": {
    state: string
    text: string
  }
  block: AIChatContextBlock[]
  "local-scope": LocalReadingScope
  "local-context": LocalContextSnapshot
  "local-status": { stage: "reading" | "planning" | "discovering" | "generating" | "complete" }
}

export interface LocalReadingScope {
  kind: "none" | "article" | "feed" | "view" | "list" | "inbox" | "collection"
  view: number
  feedIds?: string[]
  entryIds?: string[]
  listId?: string
  inboxId?: string
  unreadOnly: boolean
  excludePrivate: boolean
  capturedAt: string
}

export interface LocalEvidenceEntry {
  id: string
  title: string
  url: string
  publishedAt: string | null
  feedTitle: string
  text: string
}

export interface LocalFeedCandidate {
  id: string
  title: string
  url: string
  siteUrl: string
  description: string
  latestPublishedAt: string | null
  reason?: string
}

export interface LocalContextSnapshot {
  version: 1
  messageId: string
  scope: LocalReadingScope
  capturedAt: string
  entries: LocalEvidenceEntry[]
  candidates: LocalFeedCandidate[]
  queries: string[]
  truncated: boolean
  historyTrimmed?: boolean
  warnings: string[]
}
export type BizUIMessage = UIMessage<BizUIMetadata, BizUIDataTypes, BizUITools> & {
  createdAt: Date
}

export type BizUIMessagePart = UIMessagePart<BizUIDataTypes, BizUITools>

export type SendingUIMessage = Omit<BizUIMessage, "createdAt">
