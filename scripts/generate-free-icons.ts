import fs from "node:fs"
import { createRequire } from "node:module"

import path from "pathe"

interface IconSet {
  width: number
  height: number
  icons: Record<string, { body: string; width?: number; height?: number }>
}

// Compatibility names are identifiers, never artwork from the commercial collection.
export function generateFreeIcons(check = false) {
  const require = createRequire(import.meta.url)
  const source = require("@iconify-json/mingcute/icons.json") as IconSet
  const metadata = require("@iconify-json/mingcute/package.json") as {
    version: string
    license: string
  }
  if (metadata.version !== "1.2.8" || metadata.license !== "Apache-2.0") {
    throw new Error("Review icon provenance before changing the pinned MingCute package")
  }
  const directory = path.resolve("icons/mingcute-free")
  const mapping = JSON.parse(
    fs.readFileSync(path.join(directory, "compatibility.json"), "utf8"),
  ) as Record<string, string>
  for (const [name, target] of Object.entries(mapping)) {
    if (!/^[\w-]+$/.test(name)) throw new Error(`Invalid icon alias: ${name}`)
    const icon = source.icons[target]
    if (!icon) throw new Error(`Unknown open MingCute icon: ${target}`)
    const svg = `<!-- MingCute Design, Apache-2.0. Wrapper and alias generated for Folo Personal on 2026-10-07; see NOTICE.md. -->\n<svg xmlns="http://www.w3.org/2000/svg" width="${icon.width ?? source.width}" height="${icon.height ?? source.height}" viewBox="0 0 ${icon.width ?? source.width} ${icon.height ?? source.height}">${icon.body}</svg>\n`
    const destination = path.join(directory, `${name}.svg`)
    if (check) {
      if (!fs.existsSync(destination) || fs.readFileSync(destination, "utf8") !== svg) {
        throw new Error(`Generated icon differs from the licensed source: ${name}`)
      }
    } else {
      fs.writeFileSync(destination, svg)
    }
  }
  const unexpected = fs
    .readdirSync(directory)
    .filter((name) => name.endsWith(".svg") && !mapping[path.basename(name, ".svg")])
  if (unexpected.length) throw new Error(`Unmapped icon files: ${unexpected.join(", ")}`)
  return directory
}
