import {type RsbuildPlugin, type RsbuildPluginAPI} from '@rsbuild/core'
import {type PluginInterface} from '../types'
import htmlFromManifest from './html-fields'
import iconFromManifest from './icons-fields'
import jsonFromManifest from './json-fields'
// import localesFromManifest from './locales-fields'
import scriptsFromManifest from './scripts-fields'
import webResourcesFromManifest from './web-resources-fields'
import {type Manifest} from '../types'

// TODO: cezaraugusto type this
export interface ManifestFields {
  html: Record<string, any>,
  icons: Record<string, any>,
  json: Record<string, any>,
  // locales: string,
  scripts: Record<string, any>,
  web_accessible_resources: Record<string, any>,
}

function getFieldsData(manifest: Manifest) {
  const fieldData = {
    html: htmlFromManifest(manifest),
    icons: iconFromManifest(manifest),
    json: jsonFromManifest(manifest),
    // locales: localesFromManifest(manifestPath),
    scripts: scriptsFromManifest(manifest),
    web_accessible_resources: webResourcesFromManifest(manifest)
  }
  return fieldData
}

export const getManifestFieldsData = (manifest: Manifest) => {
    return getFieldsData(manifest)
}

export const manifestFields = (): RsbuildPlugin => ({
  name: 'plugin-extension:manifest-fields',
  setup: (api) => {
    const manifest = api.useExposed('manifest-json')()
    const fieldsData = getFieldsData(manifest)
    api.expose('manifest-fields', () => fieldsData);
  }
})
