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
  manifestPath: string,
  scriptPath: string | string[] | undefined,
): string[] {
  const projectPath = path.dirname(manifestPath);

  const scriptEntries = Array.isArray(scriptPath)
    ? scriptPath || []
    : scriptPath
      ? [scriptPath]
      : [];

  const fileAssets = scriptEntries.filter((scriptAsset) => {
    const asset = path.resolve(projectPath, scriptAsset);
    const validFile =
      // File exists
      fs.existsSync(asset) &&
      // Not in some public/ folder
      !asset.includes('public/');

    const assetExtension = path.extname(asset);

    return validFile && scriptAsset?.includes(assetExtension);
  });

  return fileAssets;
}

export function getCssEntries(
  manifestPath: string,
  scriptPath: string | string[] | undefined,
): string[] {
  const projectPath = path.dirname(manifestPath);

  const scriptEntries = Array.isArray(scriptPath)
    ? scriptPath || []
    : scriptPath
      ? [scriptPath]
      : [];

  const fileAssets = scriptEntries.filter((scriptAsset) => {
    const asset = path.resolve(projectPath, scriptAsset);

    const validFile =
      // File exists
      fs.existsSync(asset) &&
      // Not in some public/ folder
      !asset.includes('public/');

    return (
      (validFile && asset.endsWith('.css')) ||
      asset.endsWith('.scss') ||
      asset.endsWith('.sass') ||
      asset.endsWith('.less')
    );
  });

  return fileAssets;
}
