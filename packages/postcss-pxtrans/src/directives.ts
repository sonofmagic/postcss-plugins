import type { Comment, Result } from 'postcss'
import type { PxTransformMethod, PxTransformOptions, PxTransformPlatform } from './types'

const postcssPlugin = 'postcss-pxtrans-directives'

interface DirectiveState {
  skip: boolean
}

function removeUntilEndif(comment: Comment) {
  let next = comment.next()
  while (next) {
    if (next.type === 'comment' && next.text.trim() === '#endif') {
      break
    }
    const temp = next.next()
    next.remove()
    next = temp
  }
}

function handleIfdef(comment: Comment, platform: PxTransformPlatform) {
  const wordList = comment.text.split(' ')
  if (!wordList.includes('#ifdef')) {
    return
  }
  if (wordList.includes(platform)) {
    return
  }
  removeUntilEndif(comment)
}

function handleIfndef(comment: Comment, platform: PxTransformPlatform) {
  const wordList = comment.text.split(' ')
  if (!wordList.includes('#ifndef')) {
    return
  }
  if (!wordList.includes(platform)) {
    return
  }
  removeUntilEndif(comment)
}

function handleRnEject(comment: Comment) {
  if (comment.text !== 'postcss-pxtransform rn eject enable') {
    return
  }
  let next = comment.next()
  while (next) {
    if (next.type === 'comment' && next.text === 'postcss-pxtransform rn eject disable') {
      break
    }
    const temp = next.next()
    next.remove()
    next = temp
  }
}

export function createDirectivePlugin(options: PxTransformOptions = {}) {
  const methods: PxTransformMethod[] = options.methods ?? ['platform', 'size']
  const platform: PxTransformPlatform = options.platform ?? 'weapp'

  const plugin = {
    postcssPlugin,
    prepare(result: Result) {
      const state: DirectiveState = { skip: false }
      const root = result.root

      return {
        Comment(comment: Comment) {
          if (comment.text === 'postcss-pxtransform disable') {
            state.skip = true
            root.raws.__pxtransSkip = true
            return
          }

          if (!methods.includes('platform')) {
            return
          }

          if (platform === 'rn') {
            handleRnEject(comment)
          }

          handleIfdef(comment, platform)
          handleIfndef(comment, platform)
        },
        OnceExit() {
          if (state.skip && root) {
            root.raws.__pxtransSkip = true
          }
        },
      }
    },
  }

  return plugin
}

export default createDirectivePlugin
