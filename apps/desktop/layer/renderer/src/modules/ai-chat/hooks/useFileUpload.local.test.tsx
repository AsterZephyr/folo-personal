import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { FileUploadHandlers } from "./useFileUpload"
import { useFileUpload } from "./useFileUpload"

const mocks = vi.hoisted(() => ({ local: true, upload: vi.fn(), add: vi.fn(), update: vi.fn(), toast: vi.fn() }))
vi.mock("~/lib/local-ai", () => ({ isLocalAIEnabled: () => mocks.local }))
vi.mock("../store/hooks", () => ({ useChatBlockActions: () => ({ addFileAttachment: mocks.add, updateFileAttachment: mocks.update }) }))
vi.mock("../utils/file-processing", () => ({ processAndUploadFile: mocks.upload }))
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
vi.mock("sonner", () => ({ toast: { error: mocks.toast, success: vi.fn() } }))

let handlers: FileUploadHandlers
function Harness() { handlers = useFileUpload(); return null }
beforeEach(() => {
  Object.assign(globalThis, { React })
  vi.clearAllMocks()
  mocks.local = true
  renderToStaticMarkup(<Harness />)
})

describe("local AI attachment boundary", () => {
  it("rejects single upload, file picker, paste batch and drop before adding blocks or uploading", async () => {
    const file = new File(["private document"], "note.txt", { type: "text/plain" })
    expect(await handlers.uploadFile(file)).toMatchObject({ success: false, error: "local_ai.attachments_unavailable" })
    expect(await handlers.uploadFiles([file])).toEqual([expect.objectContaining({ success: false })])
    const files = { 0: file, length: 1, item: () => file, [Symbol.iterator]: function* () { yield file } } as FileList
    await handlers.handleFileDrop(files)
    const target = { files, value: "note.txt" }
    await handlers.handleFileInputChange({ target } as React.ChangeEvent<HTMLInputElement>)
    expect(target.value).toBe("")
    expect(mocks.add).not.toHaveBeenCalled()
    expect(mocks.upload).not.toHaveBeenCalled()
  })
  it("checks the current mode at invocation time rather than the hook render", async () => {
    mocks.local = false
    renderToStaticMarkup(<Harness />)
    mocks.local = true
    await handlers.uploadFile(new File(["private"], "note.txt"))
    expect(mocks.upload).not.toHaveBeenCalled()
  })
  it("retains the official upload path when local AI is disabled", async () => {
    mocks.local = false
    mocks.upload.mockResolvedValueOnce({ success: true, fileAttachment: { id: "test", uploadStatus: "completed" } })
    const result = await handlers.uploadFile(new File(["content"], "note.txt"))
    expect(result.success).toBe(true)
    expect(mocks.upload).toHaveBeenCalledOnce()
  })
})
