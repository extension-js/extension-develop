import path from 'path';
import { type RsbuildPlugin } from '@rsbuild/core';
import htmlFromManifest from './html-fields';
import iconFromManifest from './icons-fields';
import jsonFromManifest from './json-fields';
// import localesFromManifest from './locales-fields'
import scriptsFromManifest from './scripts-fields';
import webResourcesFromManifest from './web-resources-fields';
import { type InternalPluginInterface, type Manifest } from '../../types';

// TODO: cezaraugusto type this
export interface ManifestFields {
  html: Record<string, any>;
  icons: Record<string, any>;
  json: Record<string, any>;
  // locales: string,
  scripts: Record<string, any>;
  web_accessible_resources: Record<string, any>;
}

function getFieldsData(context: string, manifest: Manifest) {
  const fieldData = {
    html: htmlFromManifest(context, manifest),
    icons: iconFromManifest(context, manifest),
    json: jsonFromManifest(context, manifest),
    // locales: localesFromManifest(context, manifestPath),
    scripts: scriptsFromManifest(context, manifest),
    web_accessible_resources: webResourcesFromManifest(context, manifest),
  };
  return fieldData;
}

export const manifestFields = ({
  manifestPath,
}: InternalPluginInterface): RsbuildPlugin => ({
  name: 'plugin-extension:manifest-fields',
  setup: (api) => {
    const context = path.dirname(manifestPath);
    const manifest = api.useExposed('manifest-json')();
    const fieldsData = getFieldsData(context, manifest);
    api.expose('manifest-fields', () => fieldsData);
  },
});
