import { RsbuildPlugin } from '@rsbuild/core'

import {type InternalPluginInterface} from '../types'
import {getScriptEntries, getCssEntries, getRelativePath} from './utils'

export const addStyles = ({
  manifestPath,
  includeList,
}: InternalPluginInterface): RsbuildPlugin => ({
  name: 'scripts:add-styles',
  setup: (api) => {
    const scriptFields = includeList
    const cssImportPaths: Array<{
      feature: string
      scriptPath: string
      cssImports: string[]
    }> = []
    const scriptEntries = Object.entries(scriptFields).filter(
      ([feature, scriptPath]) => feature.startsWith('content') && scriptPath
    )

    if (!scriptEntries.length) return

    // The goal of this plugin is to enable HMR to standalone content_script.css
    // files. To do that, we get all CSS files defined and inject them
    // as dynamic imports in the content_script.js file.
    for (const contentScript of scriptEntries) {
      const [feature, scriptPath] = contentScript

      const scriptImports = [
        ...getScriptEntries(manifestPath, scriptPath)
      ]
      // content_scripts-1: ['content_script-a.css', 'content_script-b.css']
      // content_scripts-2: ['content_script-c.css', 'content_script-d.css']
      const cssImports = getCssEntries(manifestPath, scriptPath)

      // 1 - Since having a .js file is mandatory for HMR to work, if
      // during development if user has a content_script.css but not
      // a content_script.js file, we create one for each content_script.css
      // defined in the manifest.
      if (cssImports.length && !scriptImports.length) {
        const minimumContentFile = path.resolve(
          __dirname,
          'minimum-content-file.mjs'
        )

        api.modifyRsbuildConfig((config, {mergeRsbuildConfig}) => {
          return mergeRsbuildConfig(config, {
            source: {
              ...config.source,
              [feature]: {import: [minimumContentFile]}
            },
          })
        })

        scriptImports.push(minimumContentFile)
      }

      cssImportPaths.push({
        feature,
        scriptPath: scriptImports[0],
        cssImports: cssImports.map((cssImport) => {
          return getRelativePath(scriptImports[0], cssImport)
        })
      })
    }

    // 2 - Now that we have all the CSS files that need to be injected
    // as dynamic imports in the content_script.js files, we create a
    // loader that will do just that.
    // compiler.options.module.rules.push({
    //   // valid tests: js, mjs, ts, tsx, jsx, mjsx, mts, mtsx
    //   test: /\.(m?j(sx?|sx?)?|m?t(sx?|sx?))$/,
    //   use: [
    //     {
    //       loader: path.resolve(__dirname, './loaders/InjectDynamicCssLoader'),
    //       options: {
    //         manifestPath: this.manifestPath,
    //         cssImportPaths
    //       }
    //     }
    //   ]
    // })
  }
})

