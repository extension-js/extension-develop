import fs from 'fs';
import path from 'path';
import { type RsbuildPlugin, type RsbuildPluginAPI } from '@rsbuild/core';

import { type PluginInterface, type Manifest } from '../types';
import utils from './utils';
import { getManifestOverrides } from './manifest-overrides';

function applyDevOverrides(overrides: Record<string, any>) {
  if (!overrides.content_scripts) return {};

  return overrides.content_scripts.map(
    (contentObj: { js: string[]; css: string[] }, index: number) => {
      if (contentObj.css.length && !contentObj.js.length) {
        contentObj.js = [
          utils.getFilename(`content_scripts-${index}`, 'dev.js', []),
        ];
      }

      return contentObj;
    },
  );
}

function transformManifest(api: RsbuildPluginAPI) {
  const distPath = api.context.distPath;
  const manifestOutputpath = path.join(distPath, 'manifest.json');
  const defaultOutputManifest = JSON.parse(
    fs.readFileSync(manifestOutputpath).toString(),
  );
  const compiledEntries: Record<string, any> = defaultOutputManifest.entries;
  const publicFolder =
    typeof api.getRsbuildConfig().server?.publicDir === 'boolean'
      ? 'public/'
      : (api.getRsbuildConfig().server?.publicDir as Record<string, string>)
          .name + '/';

  // console.log({publicFolder})
  const manifest = api.useExposed('manifest-json')();

  const patchedManifest: Manifest = {
    ...manifest,
    ...getManifestOverrides(manifest, compiledEntries, publicFolder),
  };

  // During development, if user has only CSS files in content_scripts,
  // we add a JS file to the content_scripts bundle so that
  // these files can be dynamically imported, thus allowing HMR.
  if (process.env.NODE_ENV !== 'production') {
    if (patchedManifest.content_scripts) {
      patchedManifest.content_scripts = applyDevOverrides(patchedManifest);
    }
  }

  const source = JSON.stringify(patchedManifest, null, 2);
  fs.writeFileSync(manifestOutputpath, source);
}

export const updateManifest = ({
  manifestPath,
}: PluginInterface): RsbuildPlugin => ({
  name: 'manifest:update-manifest',
  setup: (api) => {
    api.onAfterBuild(() => {
      transformManifest(api);
    });

    api.onDevCompileDone(() => {
      transformManifest(api);
    });
  },
});
