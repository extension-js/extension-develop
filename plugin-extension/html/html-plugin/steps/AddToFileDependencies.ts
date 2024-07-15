import fs from 'fs'
import {type Compiler} from '@rspack/core'
import {Compilation} from '@rspack/core'

import {type IncludeList, type InternalPluginInterface} from '../../../types'

import getAssetsFromHtml from '../lib/getAssetsFromHtml'

export default class AddToFileDependencies {
  public readonly manifestPath: string
  public readonly includeList?: IncludeList

  constructor(options: InternalPluginInterface) {
    this.manifestPath = options.manifestPath
    this.includeList = options.includeList
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(
      'HtmlPlugin (AddToFileDependencies)',
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'HtmlPlugin (AddToFileDependencies)',
            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
          },
          (assets) => {
            if (compilation.errors?.length) return

            const allEntries = this.includeList || {}

            for (const field of Object.entries(allEntries)) {
              const [, resource] = field

              const resourceData = getAssetsFromHtml(
                resource,
                fs.readFileSync(resource, 'utf8')
              )

              if (resource) {
                const fileDependencies = new Set(compilation.fileDependencies)

                if (fs.existsSync(resource)) {
                  const fileResources = [resource, ...resourceData?.static || []]

                  for (const thisResource of fileResources) {
                    if (!fileDependencies.has(thisResource)) {
                      fileDependencies.add(thisResource)

                      if (thisResource === resource) {
                        compilation.fileDependencies.add(thisResource)
                      }
                    }
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
