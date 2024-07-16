import path from 'path';
import { type Manifest } from '../../../types';

export default function sidePanel(
  context: string,

  manifest: Manifest,
): string | undefined {
  if (!manifest || !manifest.side_panel || !manifest.side_panel.default_path) {
    return undefined;
  }

  const sidePanelPage: string = manifest.side_panel.default_path;

  return path.join(context, sidePanelPage);
}
