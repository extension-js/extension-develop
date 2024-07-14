import {type RsbuildPlugin} from '@rsbuild/core'

import {type PluginInterface} from './types'
import { Manifest } from './types'
import {manifestFields} from './manifest-fields'
import {specialFolders} from './special-folders'
import {scripts} from './scripts'
import {manifest} from './manifest'

export const pluginExtension = ({
  manifestPath,
}: PluginInterface): RsbuildPlugin => ({
  name: 'extension-develop:plugin-extension',
  setup: (api) => {
    if (!manifestPath) {
      throw new Error('manifestPath is required')
    }

    // 1 - Get the manifest file from the path
    // and expose it so other plugins can consume its data.
    const manifestData: Manifest = require(manifestPath)
    api.expose('manifest-json', () => manifestData);

    // 2 - With the manifest file, expose its fields
    // so other plugins can consume its data without
    // requiring the manifest file every time.
    manifestFields().setup(api)

    // 3 - Handle the special folders in the extension
    // such as /pages, /scripts, and /public. This
    // information is also exposed to other plugins.
    specialFolders().setup(api)

    // 4 - Handle the manifest file in the extension
    manifest({manifestPath}).setup(api)

    // 5 - Handle the scripts in the extension
    // which includes background, content, and user scripts.
    // The plugin will also handle scripts declared in scripts/
    scripts({manifestPath}).setup(api)
  }
})
