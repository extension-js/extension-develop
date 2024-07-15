import { Manifest } from '../../../types';

export function contentScripts(
  manifest: Manifest,
  compiledEntries: Record<string, any>,
  publicFolder: string,
) {
  const contentScriptEntries = Object.keys(compiledEntries).filter((key) =>
    key.startsWith('content_scripts/content'),
  );

  return contentScriptEntries.length > 0
    ? {
        content_scripts: contentScriptEntries.map((key, index) => {
          const contentObj = compiledEntries[key];
          return {
            ...manifest.content_scripts![index],
            ...contentObj.initial,
          };
        }),
      }
    : undefined;
}
