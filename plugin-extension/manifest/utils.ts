import { type Compilation } from '@rspack/core';
import { type Manifest } from '../types';

/**
 * Change the path from win style to unix style
 */
function unixify(path: string) {
  return path.replace(/\\/g, '/');
}

function shouldExclude(path: string, ignorePatterns: string[]): boolean {
  return ignorePatterns.some((pattern) => {
    const _pattern = unixify(pattern);
    return path.includes(
      _pattern.startsWith('/') ? _pattern.slice(1) : _pattern,
    );
  });
}

function getManifestContent(
  compilation: Compilation,
  manifestPath: string,
): Manifest {
  if (
    compilation.getAsset('manifest.json') ||
    compilation.assets['manifest.json']
  ) {
    const manifest = compilation.assets['manifest.json'].source().toString();
    return JSON.parse(manifest || '{}');
  }

  return require(manifestPath);
}

function getFilename(feature: string, filepath: string, exclude: string[]) {
  const entryExt = path.extname(filepath);

  // Do not attempt to rewrite the asset path if it's in the exclude list.
  const shouldSkipRewrite = shouldExclude(filepath, exclude);

  let fileOutputpath = shouldSkipRewrite ? path.normalize(filepath) : feature;

  if (['.js', '.jsx', '.tsx', '.ts'].includes(entryExt)) {
    fileOutputpath = fileOutputpath.replace(entryExt, '.js');
  }

  if (['.html', '.njk', '.nunjucks'].includes(entryExt)) {
    fileOutputpath = fileOutputpath.replace(entryExt, '.html');
  }

  if (['.css', '.scss', '.sass', '.less'].includes(entryExt)) {
    fileOutputpath = fileOutputpath.replace(entryExt, '.css');
  }

  return unixify(fileOutputpath);
}

export default {
  unixify,
  shouldExclude,
  getManifestContent,
  getFilename,
};
