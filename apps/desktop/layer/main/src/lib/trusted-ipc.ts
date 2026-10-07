import { pathToFileURL } from "node:url"

import { app, BrowserWindow } from "electron"
import { getIpcContext } from "electron-ipc-decorator"
import path from "pathe"

export function trustedApplicationSender(): Electron.WebContents {
  const { sender, event } = getIpcContext()
  const { senderFrame } = event
  if (
    sender.isDestroyed() ||
    !senderFrame ||
    senderFrame !== sender.mainFrame ||
    !BrowserWindow.fromWebContents(sender)
  ) {
    throw new Error("This action is available only to the application window")
  }
  const frameURL = new URL(senderFrame.url)
  const entry = pathToFileURL(path.join(app.getAppPath(), "dist/renderer/index.html"))
  const localEntry =
    ((frameURL.protocol === "app:" && frameURL.hostname === "folo.is") ||
      frameURL.protocol === "file:") &&
    frameURL.pathname === entry.pathname
  const devURL = !app.isPackaged && process.env.ELECTRON_RENDERER_URL
  const developmentEntry = devURL && frameURL.origin === new URL(devURL).origin
  if (!localEntry && !developmentEntry) throw new Error("Untrusted application caller")
  return sender
}
