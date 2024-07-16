import path from 'path';
import { type Manifest } from '../../../types';

export default function icons(
  context: string,
  manifest: Manifest,
): string[] | undefined {
  if (!manifest || !manifest.icons) return undefined;

  const defaultIcons: string[] = [];
  for (const icon in manifest.icons) {
    const iconAbsolutePath = manifest.icons[icon];

    defaultIcons.push(iconAbsolutePath);
  }

  return defaultIcons;
}
