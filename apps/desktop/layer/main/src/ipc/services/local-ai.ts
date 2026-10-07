import { net, safeStorage } from "electron"
import { IpcMethod, IpcService } from "electron-ipc-decorator"
import Store from "electron-store"

import type {
  LocalAICompleteInput,
  LocalAIConfig,
  LocalAIResult,
  LocalAISaveInput,
} from "../../lib/local-ai"
import {
  createLocalAIRequest,
  DEFAULT_LOCAL_AI_CONFIG,
  normalizeLocalAIConfig,
  parseLocalAIResponse,
  validateLocalAIMessages,
  validateLocalAIRequestId,
} from "../../lib/local-ai"
import { trustedApplicationSender } from "../../lib/trusted-ipc"

interface StoredLocalAI {
  config: Omit<LocalAIConfig, "hasKey">
  encryptedKey?: string
}

function withAbort<T>(operation: () => Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error("AI request cancelled"))
      return
    }
    const onAbort = () => reject(new Error("AI request cancelled"))
    signal.addEventListener("abort", onAbort, { once: true })
    void Promise.resolve()
      .then(() => {
        signal.throwIfAborted()
        return operation()
      })
      .then(resolve, reject)
      .finally(() => signal.removeEventListener("abort", onAbort))
  })
}

async function readBoundedJSON(response: Response): Promise<unknown> {
  if (!response.body) throw new Error("AI gateway returned an empty response")
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let text = ""
  let bytes = 0
  try {
    while (true) {
      const chunk = await reader.read().catch(() => {
        throw new Error("AI gateway response was interrupted")
      })
      if (chunk.done) break
      bytes += chunk.value.byteLength
      if (bytes > 4 * 1024 * 1024) throw new Error("AI response exceeds the 4 MB limit")
      text += decoder.decode(chunk.value, { stream: true })
    }
    text += decoder.decode()
    try {
      return JSON.parse(text) as unknown
    } catch {
      throw new Error("AI gateway returned invalid JSON")
    }
  } finally {
    await reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}

export class LocalAIService extends IpcService {
  static override readonly groupName = "localAI"

  private configStore?: Store<{ localAI: StoredLocalAI }>
  private readonly requests = new Map<string, AbortController>()
  private savingConfig = false

  private get storage() {
    this.configStore ??= new Store<{ localAI: StoredLocalAI }>({
      name: "local-ai",
      configFileMode: 0o600,
    })
    return this.configStore
  }

  private readConfig(): LocalAIConfig {
    const stored = this.storage.get("localAI")
    return stored
      ? {
          enabled: stored.config.enabled,
          provider: stored.config.provider,
          baseURL: stored.config.baseURL,
          model: stored.config.model,
          hasKey: Boolean(stored.encryptedKey),
        }
      : { ...DEFAULT_LOCAL_AI_CONFIG }
  }

  @IpcMethod()
  getConfig(): LocalAIConfig {
    trustedApplicationSender()
    return this.readConfig()
  }

  @IpcMethod()
  async saveConfig(input: LocalAISaveInput): Promise<LocalAIConfig> {
    trustedApplicationSender()
    if (this.savingConfig) throw new Error("AI configuration is already being saved")
    this.savingConfig = true
    try {
      return await this.persistConfig(input)
    } finally {
      this.savingConfig = false
    }
  }

  private async persistConfig(input: LocalAISaveInput): Promise<LocalAIConfig> {
    const normalized = normalizeLocalAIConfig(input)
    const previous = this.storage.get("localAI")
    let encryptedKey = previous?.encryptedKey
    if (normalized.apiKey !== undefined) {
      if (normalized.apiKey) {
        try {
          if (!(await safeStorage.isAsyncEncryptionAvailable())) throw new Error("Unavailable")
          encryptedKey = (await safeStorage.encryptStringAsync(normalized.apiKey)).toString(
            "base64",
          )
        } catch {
          throw new Error(
            "macOS secure storage is unavailable; allow Keychain access and try again",
          )
        }
      } else {
        encryptedKey = undefined
      }
    } else if (
      previous &&
      (previous.config.baseURL !== normalized.baseURL ||
        previous.config.provider !== normalized.provider)
    ) {
      throw new Error("Re-enter your AI key when changing its provider or base URL")
    }
    if (normalized.enabled && !encryptedKey)
      throw new Error("Enter an AI key before enabling local AI")
    const config = {
      enabled: normalized.enabled,
      provider: normalized.provider,
      baseURL: normalized.baseURL,
      model: normalized.model,
    }
    trustedApplicationSender()
    this.storage.set("localAI", { config, ...(encryptedKey ? { encryptedKey } : {}) })
    return { ...config, hasKey: Boolean(encryptedKey) }
  }

  @IpcMethod()
  testConnection(input: { requestId: string }): Promise<LocalAIResult> {
    return this.complete({
      requestId: validateLocalAIRequestId(input),
      messages: [{ role: "user", content: "Reply with exactly: LOCAL-AI-OK" }],
      maxTokens: 32,
    })
  }

  @IpcMethod()
  async complete(input: LocalAICompleteInput): Promise<LocalAIResult> {
    const sender = trustedApplicationSender()
    const messages = validateLocalAIMessages(input)
    const config = this.readConfig()
    if (!config.enabled) throw new Error("Local AI is disabled")
    const encryptedKey = this.storage.get("localAI")?.encryptedKey
    if (!encryptedKey) throw new Error("AI key is unavailable; save it again")
    const id = `${sender.id}:${input.requestId}`
    if (this.requests.has(id)) throw new Error("AI request ID is already active")
    if (this.requests.size >= 4)
      throw new Error("Too many AI requests; wait for a current request to finish")
    const controller = new AbortController()
    this.requests.set(id, controller)
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, 120_000)
    const onDestroyed = () => controller.abort()
    sender.once("destroyed", onDestroyed)
    try {
      let apiKey: string
      try {
        if (!(await withAbort(() => safeStorage.isAsyncEncryptionAvailable(), controller.signal)))
          throw new Error("Unavailable")
        const decrypted = await withAbort(
          () => safeStorage.decryptStringAsync(Buffer.from(encryptedKey, "base64")),
          controller.signal,
        )
        apiKey = decrypted.result
        if (decrypted.shouldReEncrypt) {
          const replacement = (
            await withAbort(() => safeStorage.encryptStringAsync(apiKey), controller.signal)
          ).toString("base64")
          const current = this.storage.get("localAI")
          if (current?.encryptedKey === encryptedKey) {
            this.storage.set("localAI", { ...current, encryptedKey: replacement })
          }
        }
      } catch {
        throw new Error("Unable to unlock the AI key; allow Keychain access or save the key again")
      }
      if (controller.signal.aborted) throw new Error("AI request cancelled")
      const request = createLocalAIRequest(config, apiKey, messages, input.maxTokens)
      let response: Response
      try {
        response = await net.fetch(request.url, {
          method: "POST",
          credentials: "omit",
          redirect: "error",
          headers: request.headers,
          body: request.body,
          signal: controller.signal,
        })
      } catch {
        throw new Error("Unable to reach the AI gateway; check its address and network connection")
      }
      if (!response.ok) {
        await response.body?.cancel().catch(() => {})
        throw new Error(
          `AI gateway returned HTTP ${response.status}; check the key, model and API protocol`,
        )
      }
      return {
        text: parseLocalAIResponse(config.provider, await readBoundedJSON(response)),
        model: config.model,
      }
    } catch (error) {
      if (controller.signal.aborted)
        throw new Error(
          timedOut ? "AI request timed out after 120 seconds" : "AI request cancelled",
        )
      throw error
    } finally {
      clearTimeout(timer)
      sender.removeListener("destroyed", onDestroyed)
      this.requests.delete(id)
    }
  }

  @IpcMethod()
  cancel(input: { requestId: string }): boolean {
    const sender = trustedApplicationSender()
    const requestId = validateLocalAIRequestId(input)
    const controller = this.requests.get(`${sender.id}:${requestId}`)
    controller?.abort()
    return Boolean(controller)
  }
}
