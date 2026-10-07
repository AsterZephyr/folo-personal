import { describe, expect, it, vi } from "vitest"

import { translateDocument } from "./local-ai-text"

describe("local article translation", () => {
  it("keeps original markup and inserts translation only as text", async () => {
    const complete = vi.fn().mockResolvedValue(JSON.stringify(["你好 <script>attack()</script>"]))
    const result = await translateDocument(
      '<p><a href="https://example.com">Hello</a></p>',
      "zh-CN",
      "bilingual",
      true,
      complete,
    )
    expect(result).toContain('<p><a href="https://example.com">Hello</a></p>')
    expect(result).toContain("你好 &lt;script&gt;attack()&lt;/script&gt;")
    expect(result).not.toContain("<script>")
    expect(complete).toHaveBeenCalledOnce()
  })
  it("rejects malformed translations instead of writing incomplete data", async () => {
    await expect(
      translateDocument("<p>One</p><p>Two</p>", "zh-CN", "bilingual", true, async () => '["一"]'),
    ).rejects.toThrow("invalid shape")
  })
  it("preserves code and removes executable elements", async () => {
    const result = await translateDocument(
      "<p>Hello</p><pre>code()</pre><script>attack()</script>",
      "zh-CN",
      "translation-only",
      true,
      async () => '["你好"]',
    )
    expect(result).toBe("<p>你好</p><pre>code()</pre>")
  })
  it("does not silently truncate long articles", async () => {
    await expect(
      translateDocument("x".repeat(120001), "zh-CN", "bilingual", true, vi.fn()),
    ).rejects.toThrow("too long")
  })
})
