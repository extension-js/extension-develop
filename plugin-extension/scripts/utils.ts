import path from 'path';
import fs from 'fs';

export function shouldExclude(path: string, ignorePatterns: string[]): boolean {
  return ignorePatterns.some((pattern) => {
    return path.includes(pattern);
  });
}

export function getRelativePath(from: string, to: string) {
  let relativePath = path.relative(path.dirname(from), to);
  if (!relativePath.startsWith('.') && !relativePath.startsWith('..')) {
    relativePath = './' + relativePath;
  }
  return relativePath;
}

export function getScriptEntries(
  scriptPath: string | string[] | undefined,
): string[] {
  const scriptEntries = Array.isArray(scriptPath)
    ? scriptPath || []
    : scriptPath
      ? [scriptPath]
      : [];

  const fileAssets = scriptEntries.filter((scriptAsset) => {
    const validFile =
      // File exists
      fs.existsSync(scriptAsset) &&
      // Not in some public/ folder
      !scriptAsset.includes('public/');

    const assetExtension = path.extname(scriptAsset);

    return validFile && scriptAsset?.includes(assetExtension);
  });

  return fileAssets;
}

export function getCssEntries(
  scriptPath: string | string[] | undefined,
): string[] {
  const scriptEntries = Array.isArray(scriptPath)
    ? scriptPath || []
    : scriptPath
      ? [scriptPath]
      : [];

  const fileAssets = scriptEntries.filter((scriptAsset) => {
    const validFile =
      // File exists
      fs.existsSync(scriptAsset) &&
      // Not in some public/ folder
      !scriptAsset.includes('public/');

    return (
      (validFile && scriptAsset.endsWith('.css')) ||
      scriptAsset.endsWith('.scss') ||
      scriptAsset.endsWith('.sass') ||
      scriptAsset.endsWith('.less')
    );
  });

  return fileAssets;
}
