import { RsbuildPlugin } from '@rsbuild/core'

export const manifestPlugin = (): RsbuildPlugin => ({
  name: 'extension-develop:special-folders',
  setup: (api) => {
    const manifest = api.useExposed('manifest.json')()
    console.log({manifest})
  }
})

