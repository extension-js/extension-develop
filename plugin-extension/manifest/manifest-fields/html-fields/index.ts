import action from './action';
import browserAction from './browser_action';
import chromeUrlOverrides from './chrome_url_overrides';
import devtoolsPage from './devtools_page';
import optionsUi from './options_ui';
import pageAction from './page_action';
import sandbox from './sandbox';
import sidePanel from './side_panel';
import sidebarAction from './sidebar_action';
import { type Manifest } from '../../types';

export default function getHtmlFields(
  manifest: Manifest,
): Record<string, string | undefined> {
  return {
    'action/default_popup': action(manifest),
    'browser_action/default_popup': browserAction(manifest),
    // read as: chrome_url_overrides/<history | newtab | settings | ...>: chromeUrlOverrides(manifest),
    ...chromeUrlOverrides(manifest),
    devtools_page: devtoolsPage(manifest),
    'options_ui/page': optionsUi(manifest),
    'page_action/default_popup': pageAction(manifest),
    // read as: sandbox/page-<index>: sandbox(manifest),
    ...sandbox(manifest),
    'side_panel/default_path': sidePanel(manifest),
    'sidebar_action/default_panel': sidebarAction(manifest),
  };
}
