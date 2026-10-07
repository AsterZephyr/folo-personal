import type { ChatTransport, UIMessageChunk } from "ai"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { LocalAIMessage } from "~/lib/local-ai"

import {
  budgetLocalMessages,
  getLocalChatMessages,
  isLocalAIChat,
  LocalChatTransport,
} from "./local-transport"
import type { BizUIMessage, LocalContextSnapshot } from "./types"

const mocks = vi.hoisted(() => ({
  complete: vi.fn(),
  cancel: vi.fn(),
  ensure: vi.fn(),
  resolve: vi.fn(),
  discovery: vi.fn(),
  config: { enabled: true },
  scope: {
    kind: "none",
    view: 0,
    unreadOnly: false,
    excludePrivate: true,
    capturedAt: "2026-10-07",
  },
}))
vi.mock("~/lib/local-ai", () => ({
  completeLocalAI: mocks.complete,
  cancelLocalAI: mocks.cancel,
  getLocalAIConfig: () => mocks.config,
}))
vi.mock("~/atoms/settings/ai", () => ({
  getAISettings: () => ({ personalizePrompt: "Use Chinese" }),
}))
vi.mock("../services", () => ({ AIPersistService: { ensureSession: mocks.ensure } }))
vi.mock("./local-discovery", () => ({ discoverLocalSources: mocks.discovery }))
vi.mock("./local-context", () => ({
  LOCAL_CONTEXT_LIMIT: 80_000,
  LOCAL_REQUEST_LIMIT: 120_000,
  LOCAL_HISTORY_LIMIT: 40_000,
  captureLocalScopePart: () => [{ type: "data-local-scope", data: mocks.scope }],
  scopeFromBlocks: () => mocks.scope,
  resolveLocalEntries: mocks.resolve,
  throwIfAborted: (signal?: AbortSignal) => {
    if (signal?.aborted) throw new DOMException("Request cancelled", "AbortError")
  },
  awaitWithAbort: <T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> =>
    new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException("Request cancelled", "AbortError"))
        return
      }
      const abort = () => reject(new DOMException("Request cancelled", "AbortError"))
      signal?.addEventListener("abort", abort, { once: true })
      promise.then(resolve, reject).finally(() => signal?.removeEventListener("abort", abort))
    }),
}))
const message = (parts: BizUIMessage["parts"], id = "m1"): BizUIMessage => ({
  id,
  role: "user",
  createdAt: new Date(),
  parts,
})
const snapshot = (messageId = "m1"): LocalContextSnapshot => ({
  version: 1,
  messageId,
  scope: { ...mocks.scope, kind: "none" },
  capturedAt: "2026-10-07",
  entries: [],
  candidates: [],
  queries: [],
  truncated: false,
  warnings: [],
})
const options = (
  signal?: AbortSignal,
): Parameters<ChatTransport<BizUIMessage>["sendMessages"]>[0] => ({
  chatId: "local-test",
  messages: [message([{ type: "text", text: "Hi" }])],
  trigger: "submit-message",
  abortSignal: signal,
  messageId: undefined,
})
async function drain(stream: ReadableStream<UIMessageChunk>) {
  const reader = stream.getReader()
  const chunks: UIMessageChunk[] = []
  while (true) {
    const item = await reader.read()
    if (item.done) return chunks
    chunks.push(item.value)
  }
}

describe("local chat transport", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mocks.ensure.mockResolvedValue(undefined)
    mocks.resolve.mockResolvedValue(snapshot())
    mocks.complete.mockResolvedValue({ text: "Hello", model: "custom" })
  })
  it("reuses frozen historical context rather than reading the feed again", () => {
    const frozen = {
      ...snapshot(),
      scope: { ...snapshot().scope, kind: "article" as const },
      entries: [
        {
          id: "1",
          title: "Original title",
          url: "https://example.com",
          feedTitle: "Feed",
          text: "Original evidence",
          publishedAt: null,
        },
      ],
    }
    const result = getLocalChatMessages([
      message([
        { type: "text", text: "Summarize" },
        { type: "data-block", data: [{ id: "e", type: "mainEntry", value: "1" }] },
        { type: "data-local-context", data: frozen },
      ]),
      {
        ...message(
          [
            { type: "text", text: "Summary" },
            { type: "data-local-context", data: frozen },
          ],
          "answer",
        ),
        role: "assistant",
      },
    ])
    expect(result[0]?.content).toContain("Original evidence")
    expect(
      result
        .map((item) => item.content)
        .join("\n")
        .split("Original evidence"),
    ).toHaveLength(2)
    expect(mocks.resolve).not.toHaveBeenCalled()
  })
  it("keeps chats local, personal preferences and evidence snapshots", async () => {
    const chunks = await drain(await new LocalChatTransport().sendMessages(options()))
    expect(chunks).toContainEqual(expect.objectContaining({ type: "text-delta", delta: "Hello" }))
    expect(chunks).toContainEqual(
      expect.objectContaining({
        type: "data-local-context",
        data: expect.objectContaining({ messageId: "m1" }),
      }),
    )
    expect(mocks.complete.mock.calls[0]![0][0].content).toContain("Use Chinese")
    expect(isLocalAIChat("local-test")).toBe(true)
    expect(mocks.ensure).toHaveBeenCalledWith("local-test", { isLocal: true })
  })
  it("surfaces provider errors without cloud fallback", async () => {
    mocks.complete.mockRejectedValue(new Error("Provider unavailable"))
    await expect(drain(await new LocalChatTransport().sendMessages(options()))).rejects.toThrow(
      "Provider unavailable",
    )
  })
  it("cancels the active provider request and rejects late output", async () => {
    mocks.complete.mockImplementation(() => new Promise(() => {}))
    const controller = new AbortController()
    const stream = await new LocalChatTransport().sendMessages(options(controller.signal))
    const result = drain(stream)
    await vi.waitFor(() => expect(mocks.complete).toHaveBeenCalledOnce())
    controller.abort()
    await expect(result).rejects.toThrow("cancelled")
    expect(mocks.cancel).toHaveBeenCalledWith(mocks.complete.mock.calls[0]![1])
  })
  it("does not call model after context retrieval is cancelled", async () => {
    const controller = new AbortController()
    mocks.resolve.mockImplementation(async () => {
      controller.abort()
      return snapshot()
    })
    await expect(
      drain(await new LocalChatTransport().sendMessages(options(controller.signal))),
    ).rejects.toThrow("cancelled")
    expect(mocks.complete).not.toHaveBeenCalled()
  })
  it("retains newest history while bounding the entire request including system", () => {
    const result = budgetLocalMessages("s".repeat(5_000), [
      { role: "user", content: "o".repeat(50_000) },
      { role: "assistant", content: "old answer" },
      { role: "user", content: "n".repeat(79_000) },
    ])
    expect(result.trimmed).toBe(true)
    expect(result.messages.at(-1)?.content).toHaveLength(79_000)
    expect(
      result.messages.reduce((size, item) => size + item.content.length, 0),
    ).toBeLessThanOrEqual(120_000)
    expect(() =>
      budgetLocalMessages("system", [{ role: "user", content: "x".repeat(120_000) }]),
    ).toThrow("too large")
  })
  it("keeps at most 98 history messages as complete recent rounds", () => {
    const history: LocalAIMessage[] = Array.from({ length: 50 }, (_, index) => [
      { role: "user" as const, content: `question ${index}` },
      { role: "assistant" as const, content: `answer ${index}` },
    ]).flat()
    // Without the count budget, system + 100 short history messages + current = 102.
    const result = budgetLocalMessages("system", [...history, { role: "user", content: "current" }])
    expect(result.messages).toHaveLength(100)
    expect(result.trimmed).toBe(true)
    expect(result.messages[1]).toEqual({ role: "user", content: "question 1" })
    expect(result.messages.at(-2)).toEqual({ role: "assistant", content: "answer 49" })
    expect(result.messages.at(-1)).toEqual({ role: "user", content: "current" })
    expect(
      result.messages
        .slice(1, -1)
        .every((item, index) => item.role === (index % 2 ? "assistant" : "user")),
    ).toBe(true)
  })
  it("does not split the latest completed round to fit the character budget", () => {
    const result = budgetLocalMessages("system", [
      { role: "user", content: "x".repeat(40_000) },
      { role: "assistant", content: "answer" },
      { role: "user", content: "current" },
    ])
    expect(result.messages.map((item) => item.role)).toEqual(["system", "user"])
    expect(result.trimmed).toBe(true)
  })
  it("uses a snapshot bound to the user after the SDK removes the assistant", async () => {
    const opts = options()
    opts.messages[0]!.parts.push({ type: "data-local-context", data: snapshot() })
    await drain(await new LocalChatTransport().sendMessages(opts))
    expect(mocks.resolve).not.toHaveBeenCalled()
  })
  it("uses saved scope and snapshot when regenerating, regardless of current view", async () => {
    const opts = options()
    opts.messages.push({
      ...message([{ type: "data-local-context", data: snapshot() }], "answer"),
      role: "assistant",
    })
    await drain(await new LocalChatTransport().sendMessages(opts))
    expect(mocks.resolve).not.toHaveBeenCalled()
  })
})
