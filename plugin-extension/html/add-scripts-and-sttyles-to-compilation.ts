import path from 'path';
import fs from 'fs';
import { type RsbuildPlugin } from '@rsbuild/core';
import { type InternalPluginInterface } from '../types';
import getAssetsFromHtml from './html-plugin/lib/get-assets-from-html';

export const addScriptsAndStylesToCompilation = ({
  manifestPath,
  includeList,
}: InternalPluginInterface): RsbuildPlugin => ({
  name: 'extension-develop:html',
  setup: (api) => {
    let htmlEntries = {};

    for (const field of Object.entries(includeList || {})) {
      const [featureName, featureDataPath] = field;

      // Resources from the manifest lib can come as undefined.
      if (featureDataPath) {
        if (!fs.existsSync(featureDataPath)) return;

        const htmlAssets = getAssetsFromHtml(featureDataPath);
        const fileAssets = [
          ...(htmlAssets?.js || []),
          ...(htmlAssets?.css || []),
        ].filter((asset) => !asset.includes('public/'));

        if (process.env.NODE_ENV === 'development') {
          fs.writeFileSync(
            path.resolve(__dirname, 'minimum-script-file.mjs'),
            '/** Nothing to see here. */',
          );

          // You can't HMR without a .js file, so we add a minimum script file.
          const hmrScript = path.resolve(__dirname, 'minimum-script-file.mjs');
          fileAssets.push(hmrScript);
        }

        if (fs.existsSync(featureDataPath)) {
          if (!featureDataPath.includes('public/')) {
            htmlEntries = {
              // https://rspack.js.org/configuration/entry-context/#entry-descriptor
              [featureName]: {
                import: fileAssets,
              },
            };
          }
        }
      }
    }

    api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
      return mergeRsbuildConfig(config, {
        tools: {
          htmlPlugin: false,
        },
        source: {
          ...config.source,
          entry: htmlEntries,
        },
      });
    });
  },
});
