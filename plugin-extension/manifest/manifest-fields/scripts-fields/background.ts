import { type Manifest } from '../../types';

export default function background(manifest: Manifest): string[] | undefined {
  if (!manifest || !manifest.background) {
    return undefined;
  }

  const scripts = manifest.background.scripts;

  if (scripts) {
    return scripts.map((script: string) => {
      return script;
    });
  }

  return undefined;
}
