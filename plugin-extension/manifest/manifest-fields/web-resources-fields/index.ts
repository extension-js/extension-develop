import { type Manifest } from '../../types';

export default function getWebAccessibleResources(
  manifest: Manifest,
): Manifest['web_accessible_resources'] | undefined {
  if (
    !manifest ||
    !manifest.web_accessible_resources ||
    !manifest.web_accessible_resources.length
  ) {
    return undefined;
  }

  return manifest.web_accessible_resources;
}
