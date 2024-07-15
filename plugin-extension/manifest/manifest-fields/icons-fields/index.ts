import action from './action';
import browserAction from './browser_action';
import browserActionThemeIcons from './browser_action.theme_icons';
import icons from './icons';
import pageAction from './page_action';
import sidebarAction from './sidebar_action';
import { type Manifest, type ThemeIcon } from '../../types';

export default function getIconsFields(
  manifest: Manifest,
): Record<string, string | string[] | ThemeIcon[] | undefined> {
  return {
    action: action(manifest),
    browser_action: browserAction(manifest),
    'browser_action/theme_icons': browserActionThemeIcons(manifest),
    icons: icons(manifest),
    page_action: pageAction(manifest),
    sidebar_action: sidebarAction(manifest),
  };
}
