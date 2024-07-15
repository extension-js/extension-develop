import {Manifest} from '../../../types'

export function backgroundPage(
  manifest: Manifest,
  compiledEntries: Record<string, any>, publicFolder: string) {
  if (!compiledEntries['background/page']) {
    return undefined
  }

  if (compiledEntries['background/page']?.includes(publicFolder)) {
    return undefined
  }

  return {
    background: {
      ...manifest.background,
      page: compiledEntries['background/page']
    }
  }
}
