import fs from 'fs'
import path from 'path'
import {type RsbuildPlugin, type RsbuildPluginAPI} from '@rsbuild/core'

import {type PluginInterface, type Manifest} from '../types'
import HtmlPlugin from '../../../../packages/html-plugin'
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
export const html = ({
  manifestPath,
}: PluginInterface): RsbuildPlugin => ({
  name: 'extension-develop:html',
  setup: (api) => {
    const manifestsScripts = api.useExposed('manifest-fields')().html
    const nonManifestScripts = api.useExposed('special-folders')().pages

    const htmlFields: Record<string, any> = {
      ...manifestsScripts,
      ...nonManifestScripts
    }

    // console.log(htmlFields)
    api.modifyRsbuildConfig((config, {mergeRsbuildConfig}) => {      
      return mergeRsbuildConfig(config, {
        tools: {
          rspack: {
            plugins: [
              new HtmlPlugin({
                manifestPath,
                include: [],
                exclude: []
              })
            ]
          }
        }
      });
    });
  }
})
