import {type RsbuildPlugin} from '@rsbuild/core'

import {type PluginInterface} from '../types'
import { addScripts } from './addScripts'
import { addStyles } from './addStyles'

export const scripts = ({
  manifestPath,
}: PluginInterface): RsbuildPlugin => ({
  name: 'plugin-extension:scripts',
  setup: async (api) => {
    const manifestsScripts = api.useExposed('manifest-fields')()
    const nonManifestScripts = api.useExposed('special-folders')().scripts

    console.log({
      manifestsScripts,
    })
    const scriptFields: Record<string, any> = {
      ...manifestsScripts,
      ...nonManifestScripts
    }

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
    }).setup(api)

    if (process.env.NODE_ENV === 'development') {
      addStyles({
        manifestPath: manifestPath,
        includeList: scriptFields.scripts,
      }).setup(api)
    }

    // 2 - Ensure scripts are HMR enabled by adding the HMR accept code.
    // if (process.env.NODE_ENV === 'development') {
    //   AddHmrAcceptCode(compiler, this.manifestPath)
    // }

    // 3 - Fix the issue with the public path not being
    // available for content_scripts in the production build.
    // See https://github.com/cezaraugusto/extension.js/issues/95
    // See https://github.com/cezaraugusto/extension.js/issues/96
    // if (process.env.NODE_ENV === 'production') {
    //   new AddPublicPathRuntimeModule().apply(compiler)
    // }

    // 4 - Fix the issue where assets imported via content_scripts
    // running in the MAIN world could not find the correct public path.
    // AddDynamicPublicPath(compiler, this.manifestPath)

    // 5 - Fix the issue of content_scripts not being able to import
    // CSS files via import statements. This loader adds the
    // is_content_css_import=true query param to CSS imports in
    // content_scripts. This skips the MiniCssExtractPlugin loader
    // and allows the CSS to be injected in the DOM via <style> tags.
    // AddQueryParamFromImportedCss(compiler, this.manifestPath)
  }
})
