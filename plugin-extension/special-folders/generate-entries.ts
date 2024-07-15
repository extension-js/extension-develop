import fs from 'fs';
import path from 'path';

export function scanHtmlFilesInFolder(dirPath: string): string[] {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    return [];
  }

  const htmlFiles: string[] = [];

  function recurse(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        recurse(entryPath);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        htmlFiles.push(entryPath);
      }
    }
  }

  recurse(dirPath);
  return htmlFiles;
}

export function scanScriptFilesInFolder(
  projectPath: string,
  dirPath: string,
): string[] {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    return [];
  }

  const scriptFiles: string[] = [];

  function recurse(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const ext = path.extname(entry.name);
      const hasValidExt = [
        '.js',
        '.mjs',
        '.jsx',
        '.mjsx',
        '.ts',
        '.mts',
        '.tsx',
        '.mtsx',
      ].includes(ext);
      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        recurse(entryPath);
      } else if (entry.isFile() && hasValidExt) {
        scriptFiles.push(entryPath);
      }
    }
  }

  recurse(dirPath);
  return scriptFiles;
}

export function scanPublicFilesInFolder(dirPath: string): string[] {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    return [];
  }

  const publicFiles: string[] = [];

  function recurse(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        recurse(entryPath);
      } else if (entry.isFile()) {
        publicFiles.push(entryPath);
      }
    }
  }

  recurse(dirPath);
  return publicFiles;
}

type IncludeList = Record<string, string>;

export function generatePagesEntries(
  includes: string[] | undefined,
): IncludeList {
  if (!includes || !includes.length) return {};
  return includes.reduce((acc, include) => {
    const extname = path.extname(include);
    const filename = path.basename(include, extname);

    return {
      ...acc,
      [`pages/${filename}.html`]: include,
    };
  }, {});
}

export function generateScriptsEntries(
  includes: string[] | undefined,
): IncludeList {
  if (!includes || !includes.length) return {};
  return includes.reduce((acc, include) => {
    const extname = path.extname(include);
    const filename = path.basename(include, extname);

    return {
      ...acc,
      [`scripts/${filename}.js`]: include,
    };
  }, {});
}

export function generatePublicEntries(
  projectPath: string,
  includes: string[] | undefined,
): IncludeList {
  if (!includes || !includes.length) return {};
  return includes.reduce((acc, include) => {
    const relativePath = path.relative(projectPath, include);
    const publicPath = path.normalize(relativePath);

    return {
      ...acc,
      [publicPath]: include,
    };
  }, {});
}
