import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { FileAttachment } from "../store/types"
import { uploadFileAttachment } from "./file-processing"

const mocks = vi.hoisted(() => ({ local: false, upload: vi.fn() }))
vi.mock("~/lib/local-ai", () => ({ isLocalAIEnabled: () => mocks.local }))
vi.mock("~/lib/api-client", () => ({ followApi: { upload: { uploadChatAttachment: mocks.upload } } }))
vi.mock("i18next", () => ({ t: (key: string) => key }))
const attachment: FileAttachment = { id: "file", name: "note.txt", type: "text/plain", size: 4, dataUrl: "data:text/plain;base64,dGVzdA==", uploadStatus: "processing" }
beforeEach(() => { mocks.local = false; vi.clearAllMocks() })
afterEach(() => { vi.unstubAllGlobals() })
describe("attachment network boundary", () => {
  it("does not upload when local AI is enabled while the file is being read", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => {
      mocks.local = true
      return { blob: async () => new Blob(["private text"]) }
    }))
    const result = await uploadFileAttachment(attachment)
    expect(result.uploadStatus).toBe("error")
    expect(result.errorMessage).toBe("local_ai.attachments_unavailable")
    expect(mocks.upload).not.toHaveBeenCalled()
  })
  it("preserves uploads in cloud mode", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ blob: async () => new Blob(["text"]) })))
    mocks.upload.mockResolvedValueOnce({ data: { url: "https://example.com/attachment" } })
    expect((await uploadFileAttachment(attachment)).uploadStatus).toBe("completed")
    expect(mocks.upload).toHaveBeenCalledOnce()
  })
})
