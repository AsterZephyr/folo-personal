import { EventEmitter } from "node:events"

import { beforeEach, describe, expect, it, vi } from "vitest"

import { LocalAIService } from "./local-ai"

const mocks = vi.hoisted(() => ({
  stored: new Map<string, unknown>(),
  fetch: vi.fn(),
  context: vi.fn(),
  owner: vi.fn(),
  encryptionAvailable: vi.fn(async () => true),
  encrypt: vi.fn(async (value: string) => Buffer.from(`encrypted:${value}`)),
  decrypt: vi.fn(async (value: Buffer) => ({
    result: value.toString().replace("encrypted:", ""),
    shouldReEncrypt: false,
  })),
}))

vi.mock("electron", () => ({
  app: { isPackaged: true, getAppPath: () => "/test/app" },
  BrowserWindow: { fromWebContents: mocks.owner },
  net: { fetch: mocks.fetch },
  safeStorage: {
    isEncryptionAvailable: () => false,
    isAsyncEncryptionAvailable: mocks.encryptionAvailable,
    encryptStringAsync: mocks.encrypt,
    decryptStringAsync: mocks.decrypt,
  },
}))
vi.mock("electron-store", () => ({
  default: class {
    get(key: string) {
      return mocks.stored.get(key)
    }
    set(key: string, value: unknown) {
      mocks.stored.set(key, value)
    }
  },
}))
vi.mock("electron-ipc-decorator", () => ({
  IpcMethod: () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) => descriptor,
  IpcService: class {},
  getIpcContext: mocks.context,
}))

function makeSender(id = 1) {
  const mainFrame = { url: "app://folo.is/test/app/dist/renderer/index.html" }
  return Object.assign(new EventEmitter(), { id, mainFrame, isDestroyed: () => false })
}

const settings = {
  enabled: true,
  provider: "openai" as const,
  baseURL: "https://gateway.example/v1",
  model: "custom",
  apiKey: "test-secret",
}

describe("LocalAIService security and cancellation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.stored.clear()
    const sender = makeSender()
    mocks.context.mockReturnValue({ sender, event: { senderFrame: sender.mainFrame } })
    mocks.owner.mockReturnValue({})
    mocks.encryptionAvailable.mockResolvedValue(true)
    mocks.fetch.mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: "OK" } }] })),
    )
  })

  it("uses async Keychain even when synchronous encryption is unavailable", async () => {
    const service = new LocalAIService()
    expect(await service.saveConfig(settings)).toEqual({
      enabled: true,
      provider: "openai",
      baseURL: settings.baseURL,
      model: "custom",
      hasKey: true,
    })
    expect(JSON.stringify(mocks.stored.get("localAI"))).not.toContain("test-secret")
    expect(JSON.stringify(service.getConfig())).not.toContain("test-secret")
  })

  it("refuses plaintext fallback and key reuse at a changed endpoint", async () => {
    const service = new LocalAIService()
    mocks.encryptionAvailable.mockResolvedValue(false)
    await expect(service.saveConfig(settings)).rejects.toThrow(/secure storage/)
    expect(mocks.stored.size).toBe(0)
    expect(mocks.encrypt).not.toHaveBeenCalled()
    mocks.encryptionAvailable.mockResolvedValue(true)
    await service.saveConfig(settings)
    await expect(
      service.saveConfig({ ...settings, apiKey: undefined, baseURL: "https://other.example/v1" }),
    ).rejects.toThrow(/Re-enter/)
  })

  it("refreshes only encrypted storage after a Keychain key rotation", async () => {
    const service = new LocalAIService()
    await service.saveConfig(settings)
    mocks.decrypt.mockResolvedValueOnce({ result: "test-secret", shouldReEncrypt: true })
    mocks.encrypt.mockResolvedValueOnce(Buffer.from("rotated-ciphertext"))
    await expect(service.testConnection({ requestId: "rotate" })).resolves.toEqual({
      text: "OK",
      model: "custom",
    })
    expect(mocks.stored.get("localAI")).toMatchObject({
      encryptedKey: Buffer.from("rotated-ciphertext").toString("base64"),
    })
    expect(JSON.stringify(mocks.stored.get("localAI"))).not.toContain("test-secret")
  })

  it("does not call the gateway if asynchronous Keychain unlock fails", async () => {
    const service = new LocalAIService()
    await service.saveConfig(settings)
    mocks.decrypt.mockRejectedValueOnce(new Error("sensitive Keychain error"))
    await expect(service.testConnection({ requestId: "locked" })).rejects.toThrow(
      "Unable to unlock the AI key",
    )
    expect(mocks.fetch).not.toHaveBeenCalled()
  })

  it("cancels while Keychain is waiting and ignores its late result", async () => {
    const service = new LocalAIService()
    await service.saveConfig(settings)
    let unlock: ((value: { result: string; shouldReEncrypt: boolean }) => void) | undefined
    mocks.decrypt.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          unlock = resolve
        }),
    )
    const pending = service.testConnection({ requestId: "waiting-keychain" })
    const rejection = expect(pending).rejects.toThrow("cancelled")
    await vi.waitFor(() => expect(mocks.decrypt).toHaveBeenCalled())
    expect(service.cancel({ requestId: "waiting-keychain" })).toBe(true)
    await rejection
    unlock?.({ result: "test-secret", shouldReEncrypt: true })
    await new Promise((resolve) => setImmediate(resolve))
    expect(mocks.fetch).not.toHaveBeenCalled()
    expect(mocks.encrypt).toHaveBeenCalledTimes(1)
    await expect(service.testConnection({ requestId: "waiting-keychain" })).resolves.toMatchObject({
      text: "OK",
    })
  })

  it("times out and releases the request even if Keychain never resolves", async () => {
    const service = new LocalAIService()
    await service.saveConfig(settings)
    vi.useFakeTimers()
    try {
      mocks.decrypt.mockImplementationOnce(() => new Promise(() => {}))
      const pending = service.testConnection({ requestId: "keychain-timeout" })
      const rejection = expect(pending).rejects.toThrow("timed out")
      await vi.advanceTimersByTimeAsync(120000)
      await rejection
      expect(service.cancel({ requestId: "keychain-timeout" })).toBe(false)
      expect(mocks.fetch).not.toHaveBeenCalled()
    } finally {
      vi.useRealTimers()
    }
  })

  it("rejects subframes and non-application pages", () => {
    const service = new LocalAIService()
    const sender = makeSender()
    mocks.context.mockReturnValue({ sender, event: { senderFrame: { url: sender.mainFrame.url } } })
    expect(() => service.getConfig()).toThrow(/application window/)
    sender.mainFrame.url = "https://untrusted.example/"
    mocks.context.mockReturnValue({ sender, event: { senderFrame: sender.mainFrame } })
    expect(() => service.getConfig()).toThrow(/Untrusted/)
  })

  it("uses no cookies or redirect credential forwarding", async () => {
    const service = new LocalAIService()
    await service.saveConfig(settings)
    await expect(service.testConnection({ requestId: "test" })).resolves.toEqual({
      text: "OK",
      model: "custom",
    })
    expect(mocks.fetch).toHaveBeenCalledWith(
      "https://gateway.example/v1/chat/completions",
      expect.objectContaining({ credentials: "omit", redirect: "error", method: "POST" }),
    )
  })

  it("does not return upstream error text or key to the renderer", async () => {
    const service = new LocalAIService()
    await service.saveConfig(settings)
    mocks.fetch.mockResolvedValue(new Response("test-secret", { status: 401 }))
    await expect(service.testConnection({ requestId: "test" })).rejects.toThrow("HTTP 401")
    mocks.fetch.mockRejectedValue(new Error("test-secret"))
    await expect(service.testConnection({ requestId: "test" })).rejects.toThrow(
      "Unable to reach the AI gateway",
    )
  })

  it("allows cancellation only by the request owner", async () => {
    const service = new LocalAIService()
    await service.saveConfig(settings)
    const context = mocks.context()
    mocks.fetch.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () => reject(new Error("abort")))
        }),
    )
    const pending = service.testConnection({ requestId: "same-id" })
    const rejection = expect(pending).rejects.toThrow("cancelled")
    const other = makeSender(2)
    mocks.context.mockReturnValue({ sender: other, event: { senderFrame: other.mainFrame } })
    expect(service.cancel({ requestId: "same-id" })).toBe(false)
    mocks.context.mockReturnValue(context)
    expect(service.cancel({ requestId: "same-id" })).toBe(true)
    await rejection
  })
})
