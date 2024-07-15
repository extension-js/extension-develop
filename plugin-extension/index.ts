import {type RsbuildPlugin} from '@rsbuild/core'

import {type PluginInterface} from './types'
import {specialFolders} from './special-folders'
import {scripts} from './scripts'
import {manifest} from './manifest'
import {html} from './html'

export const pluginExtension = ({
  manifestPath,
}: PluginInterface): RsbuildPlugin => ({
  name: 'extension-develop:plugin-extension',
  setup: (api) => {
    // 1 - Handle the manifest file in the extension.
    // The plugin will expose the manifest file to other
    // plugins. It also ensures manifest is valid.
    manifest({manifestPath}).setup(api)

    // 2 - Handle /pages, /scripts, and /public. Works
    // similar to manifestFields, but for custom routes.
    // This information is also exposed to other plugins.
    specialFolders({manifestPath}).setup(api)

    // 3 - Handle the scripts in the extension
    // which includes background, content, and user scripts.
    // The plugin will also handle scripts declared in scripts/
    scripts({manifestPath}).setup(api)

    // 4 - Handle the html files in the extension
    html({manifestPath}).setup(api)
  }
})
