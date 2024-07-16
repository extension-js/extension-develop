import path from 'path';
import { type Manifest } from '../../../types';

export default function action(
  context: string,
  manifest: Manifest,
): string | undefined {
  if (
    !manifest ||
    !manifest.browser_action ||
    !manifest.browser_action.default_popup
  ) {
    return undefined;
  }

  const browserActionPage: string = manifest.browser_action.default_popup;

  return path.join(context, browserActionPage);
}
