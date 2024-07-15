import { type Manifest } from '../../types';
import backgroundScripts from './background';
import serviceWorker from './service_worker';
import contentScripts from './content_scripts';
import userScripts from './user_scripts';

export default function getScriptFields(
  manifest: Manifest,
): Record<string, string | string[] | undefined> {
  return {
    'background/scripts': backgroundScripts(manifest),
    'background/service_worker': serviceWorker(manifest),
    // read as: content_scripts/content-<index>: contentScripts(manifest),
    ...contentScripts(manifest),
    'user_scripts/api_script': userScripts(manifest),
  };
}
