import fs from "node:fs"

import path from "pathe"
import { parse } from "svg-parser"

import { generateFreeIcons } from "./generate-free-icons"

interface SvgNode {
  type: string
  tagName?: string
  properties?: Record<string, string | number>
  children?: SvgNode[]
}

const componentTags: Record<string, string> = {
  circle: "Circle",
  g: "G",
  path: "Path",
}

function generateElement(node: SvgNode, imports: Set<string>, depth = 3): string {
  if (node.type !== "element" || !node.tagName) throw new Error("Unexpected SVG node")
  const tagName = componentTags[node.tagName]
  if (!tagName) throw new Error(`Unsupported SVG tag: ${node.tagName}`)
  imports.add(tagName)
  const props = Object.entries(node.properties ?? {})
    .map(([key, value]) => {
      const camelKey = key.replaceAll(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase())
      if (value === "currentColor") return `${camelKey}={color}`
      return typeof value === "number"
        ? `${camelKey}={${value}}`
        : `${camelKey}=${JSON.stringify(value)}`
    })
    .join(" ")
  const indent = "  ".repeat(depth)
  const opening = `<${tagName}${props ? ` ${props}` : ""}`
  if (!node.children?.length) return `${indent}${opening} />`
  return `${indent}${opening}>\n${node.children.map((child) => generateElement(child, imports, depth + 1)).join("\n")}\n${indent}</${tagName}>`
}

const checking = process.argv.includes("--check")
const sourceDirectory = generateFreeIcons(checking)
const outputDirectory = path.resolve("apps/mobile/src/icons")
const { format, resolveConfig } = await import("prettier")
const prettierConfig = await resolveConfig(path.join(outputDirectory, "add_cute_re.tsx"))
if (!checking) fs.mkdirSync(outputDirectory, { recursive: true })
const expectedFiles = new Set<string>()

for (const file of fs
  .readdirSync(sourceDirectory)
  .filter((name) => name.endsWith(".svg"))
  .sort()) {
  const name = path.basename(file, ".svg")
  const componentName =
    name === "mingcute_right_line"
      ? "MingcuteRightLine"
      : `${name
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("")}Icon`
  const ast = parse(fs.readFileSync(path.join(sourceDirectory, file), "utf8")) as {
    children: SvgNode[]
  }
  const svg = ast.children[0]
  if (!svg || svg.tagName !== "svg") throw new Error(`Invalid SVG: ${file}`)
  const imports = new Set<string>()
  const elements = (svg.children ?? []).map((child) => generateElement(child, imports)).join("\n")
  const source = `// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { ${[...imports].sort().join(", ")} } from "react-native-svg"

export const ${componentName} = ({ width = 24, height = 24, color = "#10161F", ...props }: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
${elements}
  </Svg>
)
`
  const formatted = await format(source, { ...prettierConfig, parser: "typescript" })
  const destination = path.join(outputDirectory, `${name}.tsx`)
  expectedFiles.add(`${name}.tsx`)
  if (checking) {
    if (!fs.existsSync(destination) || fs.readFileSync(destination, "utf8") !== formatted) {
      throw new Error(`Generated mobile icon differs from its open source: ${name}`)
    }
  } else {
    fs.writeFileSync(destination, formatted)
  }
}
const unexpected = fs
  .readdirSync(outputDirectory)
  .filter((name) => name.endsWith(".tsx") && !expectedFiles.has(name))
if (unexpected.length)
  throw new Error(`Mobile icons without documented provenance: ${unexpected.join(", ")}`)
