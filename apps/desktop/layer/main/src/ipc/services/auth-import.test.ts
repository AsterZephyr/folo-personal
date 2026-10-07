import { beforeEach, describe, expect, it, vi } from "vitest"

import { AuthService } from "./auth"

const mocks = vi.hoisted(() => ({
  readFile: vi.fn(),
  stat: vi.fn(),
  fetch: vi.fn(),
  currentToken: vi.fn(),
  setCookie: vi.fn(),
  trusted: vi.fn(),
}))

vi.mock("node:fs/promises", () => ({ readFile: mocks.readFile, stat: mocks.stat }))
vi.mock("electron", () => ({ net: { fetch: mocks.fetch } }))
vi.mock("@follow/utils/headers", () => ({
  createAuthRequestOriginHeaders: () => ({}),
  createDesktopAPIHeaders: () => ({}),
}))
vi.mock("~/constants/app", () => ({
  BETTER_AUTH_COOKIE_NAME_SESSION_TOKEN: "better-auth.session_token",
}))
vi.mock("electron-ipc-decorator", () => ({
  IpcMethod: () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) => descriptor,
  IpcService: class {},
}))
vi.mock("@follow/shared/env.desktop", () => ({
  env: { VITE_API_URL: "https://api.folo.is", VITE_WEB_URL: "https://app.folo.is" },
}))
vi.mock("~/manager/window", () => ({
  WindowManager: {
    getMainWindow: () => ({ webContents: { session: { cookies: { set: mocks.setCookie } } } }),
  },
}))
vi.mock("../../lib/trusted-ipc", () => ({ trustedApplicationSender: mocks.trusted }))
vi.mock("../../lib/cli-session-sync", () => ({
  getSessionTokenFromCookies: mocks.currentToken,
  getCliSessionToken: vi.fn(),
  syncSessionToCliConfig: vi.fn(),
}))
vi.mock("../../lib/auth-cookies", () => ({
  removeManagedAuthCookies: vi.fn(),
  dedupeManagedAuthCookies: vi.fn(),
}))
vi.mock("../../lib/user", () => ({
  deleteNotificationsToken: vi.fn(),
  updateNotificationsToken: vi.fn(),
}))
vi.mock("../../logger", () => ({ logger: { error: vi.fn() } }))

describe("explicit official Folo CLI session import", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.currentToken.mockResolvedValue(undefined)
    mocks.stat.mockResolvedValue({ size: 128 })
    mocks.readFile.mockResolvedValue(
      JSON.stringify({ token: "synthetic-session", apiUrl: "https://api.folo.is" }),
    )
    mocks.fetch.mockResolvedValue(
      new Response(JSON.stringify({ user: { id: "test" }, session: { id: "session" } })),
    )
  })

  it("verifies the CLI session then imports without returning credentials", async () => {
    await expect(new AuthService().importOfficialCliSession()).resolves.toEqual({ success: true })
    expect(mocks.readFile).toHaveBeenCalledWith(
      expect.stringMatching(/\/\.folo\/config\.json$/),
      "utf8",
    )
    expect(mocks.fetch).toHaveBeenCalledWith(
      "https://api.folo.is/better-auth/get-session",
      expect.objectContaining({ credentials: "omit", redirect: "error" }),
    )
    expect(mocks.setCookie).toHaveBeenCalledWith(
      expect.objectContaining({ value: "synthetic-session", httpOnly: true, secure: true }),
    )
  })

  it("does not read a CLI token when an account is already signed in", async () => {
    mocks.currentToken.mockResolvedValue("existing-session")
    await expect(new AuthService().importOfficialCliSession()).rejects.toThrow("already present")
    expect(mocks.readFile).not.toHaveBeenCalled()
    expect(mocks.setCookie).not.toHaveBeenCalled()
  })

  it("rejects a token belonging to another API before sending it", async () => {
    mocks.readFile.mockResolvedValue(
      JSON.stringify({ token: "synthetic-session", apiUrl: "https://other.example" }),
    )
    await expect(new AuthService().importOfficialCliSession()).rejects.toThrow("different API")
    expect(mocks.fetch).not.toHaveBeenCalled()
  })

  it("does not import an expired or concurrently superseded session", async () => {
    mocks.fetch.mockResolvedValue(new Response("null"))
    await expect(new AuthService().importOfficialCliSession()).rejects.toThrow("expired")
    expect(mocks.setCookie).not.toHaveBeenCalled()
    mocks.fetch.mockResolvedValue(new Response(JSON.stringify({ user: {}, session: {} })))
    mocks.currentToken.mockResolvedValueOnce(undefined).mockResolvedValueOnce("new-session")
    await expect(new AuthService().importOfficialCliSession()).rejects.toThrow("account changed")
    expect(mocks.setCookie).not.toHaveBeenCalled()
  })
})
