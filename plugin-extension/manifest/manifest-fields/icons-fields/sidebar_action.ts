import { type Manifest } from '../../../types';

export default function sidebarAction(
  context: string,
  manifest: Manifest,
): string | undefined {
  if (
    !manifest ||
    !manifest.sidebar_action ||
    !manifest.sidebar_action.default_icon
  ) {
    return undefined;
  }

  const sidebarActionDefaultIcon = manifest.sidebar_action
    .default_icon as string;

  return sidebarActionDefaultIcon;
}
