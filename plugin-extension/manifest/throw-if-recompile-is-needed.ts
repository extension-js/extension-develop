import fs from 'fs';
import { type RsbuildPlugin, type RsbuildPluginAPI } from '@rsbuild/core';

import { type InternalPluginInterface, type Manifest } from '../types';
import messages from './messages';

function readManifest(manifestPath: string): Manifest | undefined {
  try {
    const manifestJson = fs.readFileSync(manifestPath, 'utf-8');
    return JSON.parse(manifestJson);
  } catch (error) {
    console.error('Error reading manifest file:', error);

    return undefined;
  }
}

function getFlattenedAssets(api: RsbuildPluginAPI): string[] {
  const fields = api.useExposed('manifest-fields')();
  const html = fields.html;
  const scripts = fields.scripts;
  const htmlFields = Object.values(html);
  const scriptFields = Object.values(scripts).flat();
  const values = [...htmlFields, ...scriptFields].filter(
    (value) => value != null,
  );

  return values as string[];
}

export const throwIfRecompileIsNeeded = ({
  manifestPath,
}: InternalPluginInterface): RsbuildPlugin => ({
  name: 'manifest:throw-if-recompile-is-needed',
  setup: (api) => {
    api.onDevCompileDone(({ stats }) => {
      // const files = compiler.modifiedFiles || new Set<string>()
      // if (files.has(manifestPath)) {
      //   const updatedValues = getFlattenedAssets(api).sort()
      //   const initialValues = updatedValues.sort()
      //   if (initialValues.toString() !== updatedValues.toString()) {
      //     compiler.hooks.thisCompilation.tap(
      //       'ManifestPlugin (ThrowIfRecompileIsNeeded)',
      //       (compilation) => {
      //         const errorMessage = messages.serverRestartRequired()
      //         compilation.errors.push(new rspack.WebpackError(errorMessage))
      //       }
      //     )
      //   }
      // }
    });
  },
});
