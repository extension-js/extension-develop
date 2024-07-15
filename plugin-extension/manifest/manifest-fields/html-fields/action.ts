import { type Manifest } from '../../types';

export default function action(manifest: Manifest): string | undefined {
  if (!manifest || !manifest.action || !manifest.action.default_popup) {
    return undefined;
  }

  const actionPage: string = manifest.action.default_popup;

  return actionPage;
}
