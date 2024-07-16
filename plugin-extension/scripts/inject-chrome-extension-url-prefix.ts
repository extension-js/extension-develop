import path from 'path';
import { type RsbuildPlugin } from '@rsbuild/core';

import { type PluginInterface } from '../types';

export const injectChromeExtensionUrlPrefix = ({
  manifestPath,
}: PluginInterface): RsbuildPlugin => ({
  name: 'scripts:inject-chrome-extension-url-prefix',
  setup: (api) => {
    const reloadCode = `;__webpack_public_path__ = chrome.extension.getURL('/');`;
    const manifest = api.useExposed('manifest-json')();

    api.transform({ test: /\.pug$/ }, ({ resourcePath, code }) => {
      const projectPath = path.dirname(manifestPath);

      if (manifest.background) {
        if (manifest.background.scripts) {
          for (const bgScript of manifest.background.scripts) {
            const absoluteUrl = path.resolve(projectPath, bgScript as string);
            if (resourcePath.includes(absoluteUrl)) {
              return `${reloadCode}${code}`;
            }
          }
        }

        if (manifest.background.service_worker) {
          const absoluteUrl = path.resolve(
            projectPath,
            manifest.background.service_worker as string,
          );
          if (resourcePath.includes(absoluteUrl)) {
            return `${reloadCode}${code}`;
          }
        }
      }

      return code;
    });
  },
});
