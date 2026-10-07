export type LocalAIProvider = "openai" | "anthropic"

export interface LocalAIConfig {
  enabled: boolean
  provider: LocalAIProvider
  baseURL: string
  model: string
  hasKey: boolean
}

export interface LocalAISaveInput {
  enabled: boolean
  provider: LocalAIProvider
  baseURL: string
  model: string
  apiKey?: string
}

export interface LocalAIMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface LocalAICompleteInput {
  requestId: string
  messages: LocalAIMessage[]
  maxTokens?: number
}

export interface LocalAIResult {
  text: string
  model: string
}

export const DEFAULT_LOCAL_AI_CONFIG: LocalAIConfig = {
  enabled: false,
  provider: "openai",
  baseURL: "https://api.openai.com/v1",
  model: "",
  hasKey: false,
}

export function normalizeLocalAIConfig(input: LocalAISaveInput): LocalAISaveInput {
  if (!input || typeof input !== "object" || typeof input.enabled !== "boolean") {
    throw new Error("Invalid local AI configuration")
  }
  if (input.provider !== "openai" && input.provider !== "anthropic") {
    throw new Error("Unsupported AI provider")
  }
  if (typeof input.baseURL !== "string" || input.baseURL.length > 2048) {
    throw new Error("Invalid AI base URL")
  }
  let url: URL
  try {
    url = new URL(input.baseURL.trim())
  } catch {
    throw new Error("Invalid AI base URL")
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    !url.hostname ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error("AI base URL must be HTTP(S), without credentials, query or fragment")
  }
  if (typeof input.model !== "string" || input.model.length > 256 || /[\r\n]/.test(input.model)) {
    throw new Error("Invalid AI model")
  }
  if (input.enabled && !input.model.trim()) {
    throw new Error("Enter an AI model before enabling local AI")
  }
  if (
    input.apiKey !== undefined &&
    (typeof input.apiKey !== "string" || input.apiKey.length > 8192 || /[\r\n]/.test(input.apiKey))
  ) {
    throw new Error("Invalid AI key")
  }
  return {
    enabled: input.enabled,
    provider: input.provider,
    baseURL: url.toString().replace(/\/+$/, ""),
    model: input.model.trim(),
    ...(input.apiKey !== undefined ? { apiKey: input.apiKey.trim() } : {}),
  }
}

export function validateLocalAIRequestId(input: { requestId: string }): string {
  if (!input || typeof input.requestId !== "string" || !/^[\w-]{1,128}$/.test(input.requestId)) {
    throw new Error("Invalid local AI request ID")
  }
  return input.requestId
}

export function validateLocalAIMessages(input: LocalAICompleteInput): LocalAIMessage[] {
  validateLocalAIRequestId(input)
  if (!Array.isArray(input.messages) || !input.messages.length || input.messages.length > 100) {
    throw new Error("Provide between 1 and 100 AI messages")
  }
  let length = 0
  const messages = input.messages.map((message) => {
    if (
      !message ||
      !["system", "user", "assistant"].includes(message.role) ||
      typeof message.content !== "string"
    ) {
      throw new Error("Invalid AI message")
    }
    length += message.content.length
    return { role: message.role, content: message.content }
  })
  if (
    length > 240_000 ||
    !messages.some((message) => message.role === "user" && message.content.trim())
  ) {
    throw new Error("AI input is empty or too large (maximum 240000 characters)")
  }
  if (
    input.maxTokens !== undefined &&
    (!Number.isInteger(input.maxTokens) || input.maxTokens < 1 || input.maxTokens > 16384)
  ) {
    throw new Error("AI output limit must be between 1 and 16384 tokens")
  }
  return messages
}

export function createLocalAIRequest(
  config: LocalAIConfig,
  apiKey: string,
  messages: LocalAIMessage[],
  maxTokens = 4096,
) {
  const base = config.baseURL.replace(/\/+$/, "")
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (config.provider === "anthropic") {
    headers["x-api-key"] = apiKey
    headers["anthropic-version"] = "2023-06-01"
    return {
      url: `${base.endsWith("/v1") ? base : `${base}/v1`}/messages`,
      headers,
      body: JSON.stringify({
        model: config.model,
        max_tokens: maxTokens,
        stream: false,
        system: messages
          .filter((message) => message.role === "system")
          .map((message) => message.content)
          .join("\n\n"),
        messages: messages.filter((message) => message.role !== "system"),
      }),
    }
  }
  headers.Authorization = `Bearer ${apiKey}`
  return {
    url: `${base}/chat/completions`,
    headers,
    body: JSON.stringify({ model: config.model, messages, max_tokens: maxTokens, stream: false }),
  }
}

export function parseLocalAIResponse(provider: LocalAIProvider, data: unknown): string {
  if (!data || typeof data !== "object") throw new Error("AI gateway returned an invalid response")
  let text: unknown
  if (provider === "anthropic") {
    const content = "content" in data ? data.content : undefined
    text = Array.isArray(content)
      ? content
          .filter(
            (part: unknown): part is { type: "text"; text: string } =>
              typeof part === "object" &&
              part !== null &&
              "type" in part &&
              part.type === "text" &&
              "text" in part &&
              typeof part.text === "string",
          )
          .map((part) => part.text)
          .join("")
      : undefined
  } else {
    const choices = "choices" in data ? data.choices : undefined
    const message: unknown = Array.isArray(choices) ? choices[0]?.message : undefined
    text =
      message && typeof message === "object" && "content" in message ? message.content : undefined
  }
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("AI gateway returned no text; check the model and provider protocol")
  }
  return text
}
