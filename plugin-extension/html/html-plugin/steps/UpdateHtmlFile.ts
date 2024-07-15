import {type Compiler} from '@rspack/core'
import {sources, Compilation} from '@rspack/core'

import {type HtmlIncludeList, type InternalHtmlPluginInterface} from '../types'

// Manifest fields
import manifestFields from 'browser-extension-manifest-fields'

import patchHtml from '../lib/patchHtml'
import {shouldExclude} from '../helpers/utils'
import getFilePath from '../helpers/getFilePath'
import * as fileUtils from '../helpers/utils'

export default class UpdateHtmlFile {
  public readonly manifestPath: string
  public readonly includeList: HtmlIncludeList
  public readonly exclude: string[]

  constructor(options: InternalHtmlPluginInterface) {
    this.manifestPath = options.manifestPath
    this.includeList = options.includeList
    this.exclude = options.exclude
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(
      'HtmlPlugin (UpdateHtmlFile)',
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'HtmlPlugin (UpdateHtmlFile)',
            // Summarize the list of existing assets.
            stage: Compilation.PROCESS_ASSETS_STAGE_DERIVED
          },
          () => {
            if (compilation.errors.length > 0) return

            const manifestSource = fileUtils.getManifestContent(
              compilation,
              this.manifestPath
            )

            const htmlEntries: HtmlIncludeList = {
              ...manifestFields(this.manifestPath, manifestSource as any).html,
              ...this.includeList
            }

            for (const field of Object.entries(htmlEntries)) {
              const [feature, resource] = field
              const html = resource?.html

              // Resources from the manifest lib can come as undefined.
              if (html) {
                const updatedHtml: string = patchHtml(
                  compilation,
                  feature,
                  html,
                  htmlEntries,
                  this.exclude
                )

                if (!shouldExclude(html, this.exclude)) {
                  const rawSource = new sources.RawSource(updatedHtml)
                  const filepath = getFilePath(feature, '.html')
                 var w= compilation.getAssets()
                  console.log('Updating HTML file:', w)
                  // compilation.updateAsset(filepath, rawSource)
                }
              }
            }
          }
        )
      }
    )
  }
}
