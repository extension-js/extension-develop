import path from 'path'
import {type Compiler} from '@rspack/core'

import {type IncludeList, type ScriptsPluginInterface} from './types'
import AddScripts from './steps/AddScripts'
import AddStyles from './steps/AddStyles'
import AddHmrAcceptCode from './steps/AddHmrAcceptCode'
import AddPublicPathRuntimeModule from './steps/AddPublicPathRuntimeModule'
import AddDynamicPublicPath from './steps/AddDynamicPublicPath'
import AddQueryParamFromImportedCss from './steps/AddQueryParamFromImportedCss'

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
export default class ScriptsPlugin {
  public readonly manifestPath: string
  public readonly include?: string[]
  public readonly exclude?: string[]

  constructor(options: ScriptsPluginInterface) {
    this.manifestPath = options.manifestPath
    this.include = options.include || []
    this.exclude = options.exclude || []
  }

  private parseIncludes(includes: string[]): IncludeList {
    if (!includes.length) return {}
    return includes.reduce((acc, include) => {
      const extname = path.extname(include)
      const filename = path.basename(include, extname)

      return {
        ...acc,
        [`scripts/${filename}`]: include
      }
    }, {})
  }

  public apply(compiler: Compiler): void {
    // 1 - Adds the scripts entries from the manifest file
    // and from the extra scripts defined in this.include
    // to the compilation.
    // In production: Adds the CSS files to the entry points
    // along with other content_script files.
    // In development: Extracts the content_scripts css files
    // from content_scripts and injects them as dynamic imports
    // so we can benefit from HMR.
    new AddScripts({
      manifestPath: this.manifestPath,
      includeList: this.parseIncludes(this.include || []),
      exclude: this.exclude || []
    }).apply(compiler)

    if (compiler.options.mode === 'development') {
      new AddStyles({
        manifestPath: this.manifestPath,
        includeList: this.parseIncludes(this.include || []),
        exclude: this.exclude || []
      }).apply(compiler)
    }

    // 2 - Ensure scripts are HMR enabled by adding the HMR accept code.
    if (compiler.options.mode === 'development') {
      AddHmrAcceptCode(compiler, this.manifestPath)
    }

    // 3 - Fix the issue with the public path not being
    // available for content_scripts in the production build.
    // See https://github.com/cezaraugusto/extension.js/issues/95
    // See https://github.com/cezaraugusto/extension.js/issues/96
    if (compiler.options.mode === 'production') {
      new AddPublicPathRuntimeModule().apply(compiler)
    }

    // 4 - Fix the issue where assets imported via content_scripts
    // running in the MAIN world could not find the correct public path.
    AddDynamicPublicPath(compiler, this.manifestPath)

    // 5 - Fix the issue of content_scripts not being able to import
    // CSS files via import statements. This loader adds the
    // is_content_css_import=true query param to CSS imports in
    // content_scripts. This skips the MiniCssExtractPlugin loader
    // and allows the CSS to be injected in the DOM via <style> tags.
    AddQueryParamFromImportedCss(compiler, this.manifestPath)
  }
}
