import { type RsbuildPlugin } from '@rsbuild/core';

import { type InternalPluginInterface } from '../types';
import { getScriptEntries, getCssEntries } from './utils';

export const addScripts = ({
  manifestPath,
  includeList,
}: InternalPluginInterface): RsbuildPlugin => ({
  name: 'scripts:add-scripts',
  setup: (api) => {
    let scriptEntries = {};

    for (const field of Object.entries(includeList || {})) {
      const [feature, scriptPath] = field;

      const scriptImports = getScriptEntries(scriptPath);
      const cssImports = getCssEntries(scriptPath);

      const entryImports = [
        ...cssImports,
        ...scriptImports,
      ];

      if (cssImports.length || scriptImports.length) {
        scriptEntries = {
          ...scriptEntries,
          [feature]: entryImports,
        };
      }
    }

    api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
      return mergeRsbuildConfig(config, {
        tools: {
          htmlPlugin: false,
        },
        source: {
          ...config.source,
          entry: scriptEntries,
        },
      });
    });
  },
});
