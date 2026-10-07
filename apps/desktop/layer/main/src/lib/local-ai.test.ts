import { describe, expect, it } from "vitest"

import {
  createLocalAIRequest,
  DEFAULT_LOCAL_AI_CONFIG,
  normalizeLocalAIConfig,
  parseLocalAIResponse,
  validateLocalAIMessages,
} from "./local-ai"

describe("local AI provider protocols", () => {
  it("keeps an explicit model and sends OpenAI messages without Folo credentials", () => {
    const request = createLocalAIRequest(
      {
        ...DEFAULT_LOCAL_AI_CONFIG,
        enabled: true,
        baseURL: "https://gateway.example/v1/",
        model: "custom-model",
      },
      "test-key",
      [{ role: "user", content: "hello" }],
    )
    expect(request.url).toBe("https://gateway.example/v1/chat/completions")
    expect(request.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer test-key",
    })
    expect(JSON.parse(request.body)).toMatchObject({ model: "custom-model", stream: false })
  })

  it("supports Anthropic roots with or without /v1 and separates system messages", () => {
    for (const baseURL of ["https://gateway.example", "https://gateway.example/v1"]) {
      const request = createLocalAIRequest(
        { ...DEFAULT_LOCAL_AI_CONFIG, provider: "anthropic", baseURL, model: "custom-model" },
        "test-key",
        [
          { role: "system", content: "Translate" },
          { role: "user", content: "hello" },
        ],
      )
      expect(request.url).toBe("https://gateway.example/v1/messages")
      expect(request.headers["x-api-key"]).toBe("test-key")
      expect(JSON.parse(request.body)).toMatchObject({
        system: "Translate",
        messages: [{ role: "user", content: "hello" }],
      })
    }
  })

  it("rejects unsafe URL schemes, embedded credentials and query secrets", () => {
    for (const baseURL of [
      "file:///tmp/test",
      "https://user:secret@example.com",
      "https://example.com?key=secret",
      "https://example.com#fragment",
    ]) {
      expect(() => normalizeLocalAIConfig({ ...DEFAULT_LOCAL_AI_CONFIG, baseURL })).toThrow()
    }
    expect(
      normalizeLocalAIConfig({ ...DEFAULT_LOCAL_AI_CONFIG, baseURL: "http://localhost:1234/v1/" })
        .baseURL,
    ).toBe("http://localhost:1234/v1")
  })

  it("bounds article input and rejects invalid message roles and output limits", () => {
    expect(() =>
      validateLocalAIMessages({
        requestId: "test",
        messages: [{ role: "user", content: "x".repeat(240001) }],
      }),
    ).toThrow(/too large/)
    expect(() =>
      validateLocalAIMessages({
        requestId: "test",
        messages: [{ role: "user", content: "ok" }],
        maxTokens: 0,
      }),
    ).toThrow(/tokens/)
    expect(() => validateLocalAIMessages({ requestId: "test", messages: [] })).toThrow()
  })

  it("extracts text from both protocols and rejects error-shaped responses", () => {
    expect(parseLocalAIResponse("openai", { choices: [{ message: { content: "OK" } }] })).toBe("OK")
    expect(
      parseLocalAIResponse("anthropic", {
        content: [
          { type: "thinking", thinking: "private" },
          { type: "text", text: "OK" },
        ],
      }),
    ).toBe("OK")
    expect(() => parseLocalAIResponse("openai", { error: { message: "key=secret" } })).toThrow(
      /no text/,
    )
  })
})
