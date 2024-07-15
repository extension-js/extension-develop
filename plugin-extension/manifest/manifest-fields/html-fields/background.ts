import path from 'path';

import { type Manifest } from '../../types';

export default function background(manifest: Manifest): string | undefined {
  // @ts-ignore
  if (!manifest || !manifest.background || !manifest.background.page) {
    return undefined;
  }

  // @ts-ignore
  const backgroundPage: string = manifest.background.page;

  return backgroundPage;
}
