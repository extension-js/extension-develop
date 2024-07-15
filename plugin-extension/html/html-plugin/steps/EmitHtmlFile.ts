import fs from 'fs'
import path from 'path'
import {type Compiler} from '@rspack/core'
import {sources} from '@rspack/core'

import {type IncludeList, type InternalPluginInterface} from '../../../types'


import {shouldExclude} from '../helpers/utils'
import errors from '../helpers/errors'
import getFilePath from '../helpers/getFilePath'

export default class EmitHtmlFile {
  public readonly manifestPath: string
  public readonly includeList?: IncludeList 

  constructor(options: InternalPluginInterface) {
    this.manifestPath = options.manifestPath
    this.includeList = options.includeList
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(
      'HtmlPlugin (EmitHtmlFile)',
      (compilation) => {
        compilation.hooks.afterProcessAssets.tap(
          'HtmlPlugin (EmitHtmlFile)',
          () => {
            const htmlFields = this.includeList || {}

            for (const field of Object.entries(htmlFields)) {
              const [feature, resource] = field

              if (resource) {
                const html = path.join(
                  path.dirname(this.manifestPath),
                  resource
                )

                // Resources from the manifest lib can come as undefined.
                if (html) {
                  // Do not output if file doesn't exist.
                  // If the user updates the path, this script runs again
                  // and output the file accordingly.
                  if (!fs.existsSync(html)) {
                    errors.entryNotFoundWarn(compilation, feature, html)
                    return
                  }

                  const rawHtml = fs.readFileSync(html, 'utf8')

                  if (!shouldExclude(html, ['public/'])) {
                    const rawSource = new sources.RawSource(rawHtml)
                    const filepath = getFilePath(feature, '.html')
                    compilation.emitAsset(filepath, rawSource)
                  }
                }
              }
            }
          }
        )
      }
    )
  }
}
