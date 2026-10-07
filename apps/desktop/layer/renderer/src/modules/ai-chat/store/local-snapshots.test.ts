import type { ChatTransport, UIMessageChunk } from "ai"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { UserMessageParts } from "../components/message/UserMessageParts"
import { ZustandChat } from "./chat-core/chat-instance"
import {
  bindLocalSnapshotsToUsers,
  copyLocalSnapshotForRetry,
  findLocalSnapshot,
} from "./local-snapshots"
import type { BizUIMessage, LocalContextSnapshot } from "./types"

vi.mock("../components/message/AIMarkdownMessage", () => ({
  AIMarkdownStreamingMessage: ({ text }: { text: string }) => text,
}))
vi.mock("../components/message/UserRichTextMessage", () => ({ UserRichTextMessage: () => null }))
const mocks = vi.hoisted(() => ({ ensure: vi.fn(), persist: vi.fn() }))
vi.mock("../services", () => ({
  AIPersistService: { ensureSession: mocks.ensure, replaceAllMessages: mocks.persist },
}))
const snapshot: LocalContextSnapshot = {
  version: 1,
  messageId: "user-1",
  scope: {
    kind: "view",
    view: 0,
    unreadOnly: false,
    excludePrivate: true,
    capturedAt: "2026-10-07T00:00:00Z",
  },
  capturedAt: "2026-10-07T00:00:00Z",
  entries: [
    {
      id: "original",
      title: "Original article",
      url: "https://example.com/original",
      publishedAt: null,
      feedTitle: "Feed",
      text: "Frozen evidence",
    },
  ],
  candidates: [],
  queries: [],
  truncated: false,
  warnings: [],
}
const user: BizUIMessage = {
  id: "user-1",
  role: "user",
  createdAt: new Date(),
  parts: [{ type: "text", text: "Summarize" }],
}
const assistant: BizUIMessage = {
  id: "assistant-1",
  role: "assistant",
  createdAt: new Date(),
  parts: [
    { type: "data-local-context", data: snapshot },
    { type: "text", text: "Original summary" },
  ],
}
const chats: ZustandChat[] = []
function createChat(initial: BizUIMessage[]) {
  const requests: BizUIMessage[][] = []
  const transport: ChatTransport<BizUIMessage> = {
    sendMessages: async (options) => {
      requests.push(structuredClone(options.messages))
      return new ReadableStream<UIMessageChunk>({
        start(controller) {
          controller.enqueue({ type: "start", messageId: `answer-${requests.length}` })
          controller.enqueue({ type: "text-start", id: "text" })
          controller.enqueue({ type: "text-delta", id: "text", delta: "Answer" })
          controller.enqueue({ type: "text-end", id: "text" })
          controller.enqueue({ type: "finish", finishReason: "stop" })
          controller.close()
        },
      })
    },
    reconnectToStream: async () => null,
  }
  const chat = new ZustandChat(
    { id: "local-test", messages: structuredClone(initial), transport },
    vi.fn(),
  )
  chats.push(chat)
  return { chat, requests }
}

describe("local evidence across real AI SDK truncation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.ensure.mockResolvedValue(undefined)
    mocks.persist.mockResolvedValue(undefined)
  })
  afterEach(async () => {
    await Promise.all(chats.splice(0).map((chat) => chat.destroy()))
  })
  it("binds legacy assistant-only snapshots before actual SDK regenerate truncates history", async () => {
    const { chat, requests } = createChat([user, assistant])
    await chat.regenerate({ messageId: user.id })
    expect(requests[0]).toHaveLength(1)
    expect(requests[0]![0]?.role).toBe("user")
    expect(findLocalSnapshot(requests[0]!, user.id)?.entries[0]?.text).toBe("Frozen evidence")
    await vi.waitFor(() => expect(mocks.persist).toHaveBeenCalled())
    expect(findLocalSnapshot(mocks.persist.mock.calls.at(-1)![1], user.id)?.entries[0]?.id).toBe(
      "original",
    )
  })
  it("binds newly received evidence in state before a retry, without mutating source messages", () => {
    const { chat } = createChat([user])
    chat.chatState.messages = [user, assistant]
    const bound = chat.chatState.messages[0]!
    expect(bound.parts.filter((part) => part.type === "data-local-context")).toHaveLength(1)
    expect(user.parts).toHaveLength(1)
    const repeated = bindLocalSnapshotsToUsers(chat.chatState.messages)
    expect(repeated[0]!.parts.filter((part) => part.type === "data-local-context")).toHaveLength(1)
  })
  it("does not render bound source evidence or recommendation cards in the user bubble", () => {
    const bound = bindLocalSnapshotsToUsers([user, assistant])[0]!
    const html = renderToStaticMarkup(createElement(UserMessageParts, { message: bound }))
    expect(html).toContain("Summarize")
    expect(html).not.toContain("Frozen evidence")
    expect(html).not.toContain("Original article")
    expect(html).not.toContain("local-context-result")
  })
  it("remaps a bottom-panel retry to its new ID while a later new question gets fresh context", async () => {
    const { chat, requests } = createChat([user, assistant])
    const retry = copyLocalSnapshotForRetry(
      { ...structuredClone(user), id: "retry-1" },
      user.id,
      chat.chatState.messages,
    )
    chat.chatState.popMessage()
    await chat.sendMessage({ ...retry, createdAt: new Date() })
    expect(findLocalSnapshot(requests[0]!, "retry-1")?.entries[0]?.id).toBe("original")
    expect(requests[0]!.at(-1)?.id).toBe("retry-1")
    await chat.sendMessage({
      id: "new-question",
      createdAt: new Date(),
      role: "user",
      parts: [{ type: "text", text: "Summarize the latest articles now" }],
    })
    expect(findLocalSnapshot(requests[1]!, "new-question")).toBeUndefined()
    expect(requests[1]!.at(-1)?.parts.some((part) => part.type === "data-local-context")).toBe(
      false,
    )
  })
})
