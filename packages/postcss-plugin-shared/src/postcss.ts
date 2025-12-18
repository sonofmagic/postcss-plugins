import type { ChildNode, Declaration } from 'postcss'

export function declarationExists(
  decls: { some: (cb: (node: ChildNode) => boolean) => boolean },
  prop: string,
  value: string,
) {
  return decls.some((node) => {
    if (node.type !== 'decl') {
      return false
    }
    const decl = node as Declaration
    return decl.prop === prop && decl.value === value
  })
}
