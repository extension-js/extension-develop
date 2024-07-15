import {backgroundPage} from './background'
import {chromeUrlOverrides} from './chrome_url_overrides'
import {contentScripts} from './content_scripts'
import devtoolsPage from './devtools_page'
import icons from './icons'
import optionsPage from './options_page'
import optionsUi from './options_ui'
import pageAction from './page_action'
import sandbox from './sandbox'
import sidePanel from '../mv3/side_panel'
import sidebarAction from './sidebar_action'
import storage from './storage'
import theme from './theme'
import userScripts from './user_scripts'
import webAccessibleResources from './web_accessible_resources'
import { Manifest } from '../../../types'

function manifestCommon(
  manifest: Manifest,
  compiledEntries: Record<string, any>, publicFolder: string) {
  return {
    ...backgroundPage(manifest, compiledEntries, publicFolder),
    ...chromeUrlOverrides(manifest, compiledEntries, publicFolder),
    ...contentScripts(manifest, compiledEntries, publicFolder),
    // ...devtoolsPage(compiledEntries, publicFolder),
    // ...icons(compiledEntries, publicFolder),
    // ...optionsPage(compiledEntries, publicFolder),
    // ...optionsUi(compiledEntries, publicFolder),
    // ...pageAction(compiledEntries, publicFolder),
    // ...sandbox(compiledEntries, publicFolder),
    // ...sidePanel(compiledEntries, publicFolder),
    // ...sidebarAction(compiledEntries, publicFolder),
    // ...storage(compiledEntries, publicFolder),
    // ...theme(compiledEntries, publicFolder),
    // ...userScripts(compiledEntries, publicFolder),
    // ...webAccessibleResources(compiledEntries, publicFolder)
  }
}

export default manifestCommon
