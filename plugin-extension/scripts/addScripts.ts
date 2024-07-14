import {type RsbuildPlugin} from '@rsbuild/core'

import {type InternalPluginInterface} from '../types'
import {getScriptEntries, getCssEntries} from './utils'

export const addScripts = ({
  manifestPath,
  includeList,
}: InternalPluginInterface): RsbuildPlugin => ({
  name: 'scripts:add-scripts',
  setup: (api) => {
    let scriptEntries = {}

    for (const field of Object.entries(includeList)) {
      const [feature, scriptPath] = field

      const scriptImports = getScriptEntries(manifestPath, scriptPath)
      const cssImports = getCssEntries(manifestPath, scriptPath)
      const entryImports = [...cssImports, ...scriptImports]

      // During development, we extract the content_scripts css files from
      // content_scripts and inject them as dynamic imports
      // so we can benefit from HMR.
      // In production we don't need that, so we add the files to the entry points
      // along with other content_script files.
      if (process.env.NODE_ENV === 'production') {
        entryImports.push(...cssImports)
      }

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
