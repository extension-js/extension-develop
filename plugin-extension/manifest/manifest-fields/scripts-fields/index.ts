import { type Manifest } from '../../../types';
import backgroundScripts from './background';
import serviceWorker from './service_worker';
import contentScripts from './content_scripts';
import userScripts from './user_scripts';

export default function getScriptFields(
  context: string,

  manifest: Manifest,
): Record<string, string | string[] | undefined> {
  return {
    'background/scripts': backgroundScripts(context, manifest),
    'background/service_worker': serviceWorker(context, manifest),
    // read as: content_scripts/content-<index>: contentScripts(manifest),
    ...contentScripts(context, manifest),
    'user_scripts/api_script': userScripts(context, manifest),
  };
}
