import { type Manifest } from '../../types';

export default function pageAction(
  manifest: Manifest,
): string | string[] | undefined {
  if (
    !manifest ||
    !manifest.page_action ||
    !manifest.page_action.default_icon
  ) {
    return undefined;
  }

  if (typeof manifest.page_action.default_icon === 'string') {
    return manifest.page_action.default_icon as string;
  }

  const pageActionDefaultIcons: string[] = [];

  for (const icon in manifest.page_action.default_icon) {
    const pageactionDefaultIconAbsolutePath = manifest.page_action.default_icon[
      icon
    ] as string;

    pageActionDefaultIcons.push(pageactionDefaultIconAbsolutePath);
  }

  return pageActionDefaultIcons;
}
