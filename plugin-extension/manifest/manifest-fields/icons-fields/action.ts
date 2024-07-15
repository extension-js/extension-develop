import { type Manifest } from '../../types';

export default function action(
  manifest: Manifest,
): string | string[] | undefined {
  if (!manifest || !manifest.action || !manifest.action.default_icon) {
    return undefined;
  }

  if (typeof manifest.action.default_icon === 'string') {
    return manifest.action.default_icon as string;
  }

  const actionDefaultIcons: string[] = [];

  for (const icon in manifest.action.default_icon) {
    actionDefaultIcons.push(manifest.action.default_icon[icon] as string);
  }

  return actionDefaultIcons;
}
