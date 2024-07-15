import action from './action';
import { backgroundServiceWorker } from './background';
import sidePanel from './side_panel';
import { type Manifest } from '../../../types';

export default function manifestV3(
  manifest: Manifest,
  compiledEntries: Record<string, any>,
  publicFolder: string,
) {
  return {
    // ...action(manifest, compiledEntries, publicFolder),
    ...backgroundServiceWorker(manifest, compiledEntries, publicFolder),
    // ...sidePanel(manifest, compiledEntries,publicFolder)
  };
}
