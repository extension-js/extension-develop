import path from 'path'
import fs from 'fs'
import {type Compiler} from '@rspack/core'

import {type IncludeList, type StepPluginInterface} from '../types'

// Manifest fields
import manifestFields from 'browser-extension-manifest-fields'

import getAssetsFromHtml from '../lib/getAssetsFromHtml'
import {shouldExclude} from '../helpers/utils'

export default class AddScriptsAndStylesToCompilation {
  public readonly manifestPath: string
  public readonly includeList: IncludeList
  public readonly exclude: string[]

  constructor(options: StepPluginInterface) {
    this.manifestPath = options.manifestPath
    this.includeList = options.includeList
    this.exclude = options.exclude
  }

  public apply(compiler: Compiler): void {
    const htmlEntries = {
      ...manifestFields(this.manifestPath).html,
      ...this.includeList
    }

    for (const field of Object.entries(htmlEntries)) {
      const [feature, resource] = field

      // Resources from the manifest lib can come as undefined.
      if (resource?.html) {
        if (!fs.existsSync(resource?.html)) return

        const htmlAssets = getAssetsFromHtml(resource?.html)
        const jsAssets = htmlAssets?.js || []
        const cssAssets = htmlAssets?.css || []
        const fileAssets = [...jsAssets, ...cssAssets].filter(
          (asset) => !shouldExclude(asset, this.exclude)
        )

        if (compiler.options.mode === 'development') {
          // you can't HMR without a .js file, so we add a minimum script file.
          const hmrScript = path.resolve(__dirname, 'minimum-script-file.mjs')
          fileAssets.push(hmrScript)
        }

        if (fs.existsSync(resource?.html)) {
          if (!shouldExclude(resource?.html, this.exclude)) {
            compiler.options.entry = {
              ...compiler.options.entry,
              // https://rspack.js.org/configuration/entry-context/#entry-descriptor
              [feature]: {
                import: fileAssets
              }
            }
          }
        }
      }
    }
  }
}
