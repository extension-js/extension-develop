import { type RsbuildPlugin } from '@rsbuild/core';

import { type PluginInterface } from '../types';
import { addScripts } from './add-scripts';
import { addStyles } from './add-styles';
// import { injectChromeExtensionUrlPrefix } from './inject-chrome-extension-url-prefix';

/**
 * ScriptsPlugin is responsible for handiling all possible JavaScript
 * (and CSS, for content_scripts) fields in manifest.json. It also
 * supports extra scripts defined via this.include option. These
 * extra scripts are added to the compilation and are also HMR
 * enabled. They are useful for adding extra scripts to the
 * extension runtime, like content_scripts via `scripting`, for example.
 *
 * Features supported:
 * - content_scripts.js - HMR enabled
 * - content_scripts.css - HMR enabled
 * - background.scripts - HMR enabled
 * - service_worker - Reloaded by chrome.runtime.reload()
 * - user_scripts.api_scripts - HMR enabled
 * - scripts via this.include - HMR enabled
 */
export const scripts = ({ manifestPath }: PluginInterface): RsbuildPlugin => ({
  name: 'plugin-extension:scripts',
  setup: async (api) => {
    const manifestScripts = api.useExposed('manifest-fields')();
    const nonManifestScripts = api.useExposed('special-folders')().scripts;

    const scriptFields: Record<string, any> = {
      ...manifestScripts,
      ...nonManifestScripts,
    };

    // 1 - Adds the scripts entries from the manifest file
    // and from the extra scripts defined in this.include
    // to the compilation.
    // In production: Adds the CSS files to the entry points
    // along with other content_script files.
    // In development: Extracts the content_scripts css files
    // from content_scripts and injects them as dynamic imports
    // so we can benefit from HMR.
    addScripts({
      manifestPath: manifestPath,
      includeList: scriptFields.scripts,
    }).setup(api);

    if (process.env.NODE_ENV === 'development') {
      addStyles({
        manifestPath: manifestPath,
        includeList: scriptFields.scripts,
      }).setup(api);
    }

    // 2 - Ensure scripts are HMR enabled by adding the HMR accept code.
    // if (process.env.NODE_ENV === 'development') {
    //   addHmrAcceptCode(manifestPath)
    // }

    // 3 - Fix the issue with the public path not being
    // available for content_scripts in the production build.
    // See https://github.com/cezaraugusto/extension.js/issues/95
    // See https://github.com/cezaraugusto/extension.js/issues/96
    // if (process.env.NODE_ENV === 'production') {
    //   addPublicPathRuntimeModule().apply(compiler)
    // }

    // 4 - Fix the issue where assets imported via content_scripts
    // running in the MAIN world could not find the correct public path.
    // injectChromeExtensionUrlPrefix({ manifestPath });

    // 5 - Fix the issue of content_scripts not being able to import
    // CSS files via import statements. This loader adds the
    // is_content_css_import=true query param to CSS imports in
    // content_scripts. This skips the MiniCssExtractPlugin loader
    // and allows the CSS to be injected in the DOM via <style> tags.
    // addQueryParamFromImportedCss(manifestPath)
  },
});
