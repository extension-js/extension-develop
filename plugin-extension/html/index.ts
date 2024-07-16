import { type RsbuildPlugin } from '@rsbuild/core';

import { type PluginInterface } from '../types';
import HtmlPlugin from './html-plugin/module';
import { addScriptsAndStylesToCompilation } from './add-scripts-and-sttyles-to-compilation';

/**
 * HtmlPlugin is responsible for handling the HTML file
 * defined in the manifest.json. Static assets and CSS files
 * within the HTML file are added to the compilation. JS files
 * are added as rspack entrypoints. It also supports ecxtra
 * html files defined via this.include option. These extra
 * html files are added to the compilation and are also HMR
 * enabled. They are useful for adding extra pages to the
 * extension runtime that are not defined in manifest.
 *
 * The plugin also has a guard against recompiling entrypoints
 * at runtime, throwing an error if any of those files change.
 *
 * Features supported:
 * action.default_popup - HMR enabled
 * background.page - HMR enabled
 * chrome_settings_overrides.homepage - HMR enabled
 * chrome_url_overrides.newtab - HMR enabled
 * chrome_url_overrides.history - HMR enabled
 * chrome_url_overrides.bookmarks - HMR enabled
 * devtools_page - HMR enabled
 * options_ui.page - HMR enabled
 * page_action.default_popup - HMR enabled
 * sandbox.page - HMR enabled
 * side_panel.default_panel - HMR enabled
 * sidebar_action.default_panel - HMR enabled
 */
export const html = ({ manifestPath }: PluginInterface): RsbuildPlugin => ({
  name: 'extension-develop:html',
  setup: (api) => {
    const manifestHtml = api.useExposed('manifest-fields')().html;
    const nonManifestHtml = api.useExposed('special-folders')().pages;

    const htmlFields: Record<string, any> = {
      ...manifestHtml,
      ...nonManifestHtml,
    };

    addScriptsAndStylesToCompilation({
      manifestPath: manifestPath,
      includeList: htmlFields,
    }).setup(api);

    api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
      return mergeRsbuildConfig(config, {
        // source: {
        //   entry: {

        //   }
        // },
        tools: {
          htmlPlugin: false,
          rspack: {
            plugins: [
              new HtmlPlugin({
                manifestPath,
                includeList: htmlFields,
              }),
            ],
          },
        },
      });
    });
  },
});
