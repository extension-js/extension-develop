import htmlFromManifest from './html-fields'
import iconFromManifest from './icons-fields'
import jsonFromManifest from './json-fields'
import localesFromManifest from './locales-fields'
import scriptsFromManifest from './scripts-fields'
import webResourcesFromManifest from './web-resources-fields'
import {type Manifest} from '../types'

function browserExtensionManifestFields(manifestPath: string) {
  const manifest: Manifest = require(manifestPath)

  return {
    html: htmlFromManifest(manifest),
    icons: iconFromManifest(manifest),
    json: jsonFromManifest(manifest),
    locales: localesFromManifest(manifestPath),
    scripts: scriptsFromManifest(manifest),
    web_accessible_resources: webResourcesFromManifest(manifest)
  }
}

export default browserExtensionManifestFields
