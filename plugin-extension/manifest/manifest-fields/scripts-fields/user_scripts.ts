import { type Manifest } from '../../types';

export default function userScripts(manifest: Manifest): string | undefined {
  if (
    !manifest ||
    !manifest.user_scripts ||
    !manifest.user_scripts.api_script
  ) {
    return undefined;
  }

  const userScript: string = manifest.user_scripts.api_script;

  return userScript;
}
