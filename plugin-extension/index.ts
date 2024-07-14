import {type RsbuildPlugin} from '@rsbuild/core'

import {type PluginInterface} from './types'
import { Manifest } from './types'
import {manifestFields} from './manifest-fields'
import {specialFolders} from './special-folders'

export const pluginExtension = ({
  manifestPath,
  includeList,
  exclude = []
}: PluginInterface): RsbuildPlugin => ({
  name: 'extension-develop:plugin-extension',
  setup: (api) => {
    if (!manifestPath) {
      throw new Error('manifestPath is required')
    }

    // 1 - Get the manifest file from the path
    // and expose it so other plugins can consume its data.
    const manifest: Manifest = require(manifestPath)
    api.expose('manifest.json', () => manifest);

    // 2 - With the manifest file, expose its fields
    // so other plugins can consume its data without
    // requiring the manifest file every time.
    manifestFields().setup(api)

    // 3 - Handle the special folders in the extension
    // such as /pages, /scripts, and /public. This
    // information is also exposed to other plugins.
    specialFolders().setup(api)
  }
})
