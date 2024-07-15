import { ThemeIcon, type Manifest } from '../../types';

export default function browserActionThemeIcon(
  manifest: Manifest,
): ThemeIcon[] | undefined {
  if (
    !manifest ||
    !manifest.browser_action ||
    // @ts-ignore
    !manifest.browser_action.theme_icons
  ) {
    return undefined;
  }

  for (const themeIcon of manifest.browser_action.theme_icons as ThemeIcon[]) {
    if (themeIcon.light) {
      themeIcon.light = themeIcon.light;
    }

    if (themeIcon.dark) {
      themeIcon.dark = themeIcon.dark;
    }

    if (themeIcon.size) delete themeIcon.size;
  }

  return manifest.browser_action.theme_icons;
}
