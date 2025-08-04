import type { PluginCreator } from 'postcss'

const plugin: PluginCreator<object> = () => {
  return {
    postcssPlugin: 'postcss-add-wx-root-content',
    Rule(rule) {
      if (rule.selectors.includes(':host')) {
        rule.selectors = [...rule.selectors, 'wx-root-content']
      }
    },
  }
}

plugin.postcss = true

export default plugin
