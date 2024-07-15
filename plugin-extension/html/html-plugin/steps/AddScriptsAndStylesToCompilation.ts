import path from 'path';
import fs from 'fs';
import { type Compiler } from '@rspack/core';

import { type IncludeList, type InternalPluginInterface } from '../../../types';

// Manifest fields
import manifestFields from 'browser-extension-manifest-fields';

import getAssetsFromHtml from '../lib/getAssetsFromHtml';
import { shouldExclude } from '../helpers/utils';

export default class AddScriptsAndStylesToCompilation {
  public readonly manifestPath: string;
  public readonly includeList?: IncludeList;

  constructor(options: InternalPluginInterface) {
    this.manifestPath = options.manifestPath;
    this.includeList = options.includeList;
  }

  public apply(compiler: Compiler): void {
    const htmlEntries = this.includeList || {};

    for (const field of Object.entries(htmlEntries)) {
      const [feature, resource] = field;

      // Resources from the manifest lib can come as undefined.
      if (resource) {
        if (!fs.existsSync(resource)) return;

        const htmlAssets = getAssetsFromHtml(resource);
        const jsAssets = htmlAssets?.js || [];
        const cssAssets = htmlAssets?.css || [];
        const fileAssets = [...jsAssets, ...cssAssets].filter(
          (asset) => !shouldExclude(asset, ['public/']),
        );

        if (compiler.options.mode === 'development') {
          fs.writeFileSync(
            path.resolve(__dirname, 'minimum-script-file.mjs'),
            '/** Maxwell was a physical */',
          );
          // you can't HMR without a .js file, so we add a minimum script file.
          const hmrScript = path.resolve(__dirname, 'minimum-script-file.mjs');
          fileAssets.push(hmrScript);
        }

        if (fs.existsSync(resource)) {
          if (!shouldExclude(resource, ['public/'])) {
            compiler.options.entry = {
              ...compiler.options.entry,
              // https://rspack.js.org/configuration/entry-context/#entry-descriptor
              [feature]: {
                import: fileAssets,
              },
            };
          }
        }
      }
    }
  }
}
