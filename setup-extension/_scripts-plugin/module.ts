import {type RsbuildPlugin} from '@rsbuild/core'

// Manifest fields
import manifestFields from 'browser-extension-manifest-fields'

import {type PluginInterface} from '../types'
import {getScriptEntries, getCssEntries} from '../utils'

export const pluginScripts = ({
  manifestPath,
  includeList,
  exclude
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
      const scriptImports = getScriptEntries(scriptPath, exclude)
      const cssImports = getCssEntries(scriptPath, exclude)
      const entryImports = [...cssImports, ...scriptImports]

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
