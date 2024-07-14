import {type RsbuildPlugin, type RsbuildPluginAPI} from '@rsbuild/core'
import {type PluginInterface} from '../types'
import htmlFromManifest from './html-fields'
import iconFromManifest from './icons-fields'
import jsonFromManifest from './json-fields'
// import localesFromManifest from './locales-fields'
import scriptsFromManifest from './scripts-fields'
import webResourcesFromManifest from './web-resources-fields'
import {type Manifest} from '../types'

function exposeFields(manifest: Manifest, api: RsbuildPluginAPI) {
  const fieldData = {
    html: htmlFromManifest(manifest),
    icons: iconFromManifest(manifest),
    json: jsonFromManifest(manifest),
    // locales: localesFromManifest(manifestPath),
    scripts: scriptsFromManifest(manifest),
    web_accessible_resources: webResourcesFromManifest(manifest)
  }

  api.expose('manifest-fields', () => fieldData);
}

export const manifestFields = ({
  manifestPath ='',
  includeList = {},
  exclude = []
}: Partial<PluginInterface> = {}): RsbuildPlugin => ({
  name: 'plugin-extension:manifest-fields',
  setup: (api) => {
    // Allow this plugin to run indenependently
    // from the plugins chain if a manifest.json
    // is provided.
    const manifest = manifestPath
      ? require(manifestPath)
      : api.useExposed('manifest-json')()

    exposeFields(manifest, api)
  }
})