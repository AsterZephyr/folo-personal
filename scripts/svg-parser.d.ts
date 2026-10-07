declare module "svg-parser" {
  interface SvgNode {
    type: string
    tagName?: string
    properties?: Record<string, string | number>
    children?: SvgNode[]
  }
  export function parse(source: string): { children: SvgNode[] }
}
