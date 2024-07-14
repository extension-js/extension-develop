import path from 'path'
import {type RsbuildPlugin} from '@rsbuild/core'

// Manifest fields
import manifestFields from '../manifest-fields'

import {type PluginInterface} from '../types'
import {getScriptEntries, getCssEntries} from '../utils'

export const pluginScripts = ({
  manifestPath,
  includeList,
  exclude = []
}: PluginInterface): RsbuildPlugin => ({
  name: 'extension-develop:scripts',
  setup: async (api) => {
    const scriptFields = {
      ...manifestFields(manifestPath).scripts,
      ...includeList
    }

    let scriptEntries = {}

    for (const field of Object.entries(scriptFields)) {
      const [feature, scriptPath] = field
      const scriptImports = getScriptEntries(manifestPath, scriptPath, exclude)
      const cssImports = getCssEntries(manifestPath, scriptPath, exclude)
      const entryImports = [...cssImports, ...scriptImports]

      // During development, we extract the content_scripts css files from
      // content_scripts and inject them as dynamic imports
      // so we can benefit from HMR.
      // In production we don't need that, so we add the files to the entry points
      // along with other content_script files.
      // if (compiler.options.mode === 'production') {
      //   entryImports.push(...cssImports)
      // }

      if (cssImports.length || scriptImports.length) {
        scriptEntries = {
          ...scriptEntries,
          [feature]: entryImports
        }
      }
    }

    api.modifyRsbuildConfig((config, {mergeRsbuildConfig}) => {
      return mergeRsbuildConfig(config, {
        source: {
          ...config.source,
          entry: scriptEntries
        },
      })
    })
  }
})
