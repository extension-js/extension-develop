import path from 'path';
import { RsbuildPlugin } from '@rsbuild/core';
import { PluginInterface } from '../types';
import {
  scanPublicFilesInFolder,
  scanHtmlFilesInFolder,
  scanScriptFilesInFolder,
  generatePublicEntries,
  generatePagesEntries,
  generateScriptsEntries,
} from './generate-entries';
import { warnUponFolderChanges } from './warn-upon-folder-changes';

/**
 * SpecialFoldersPlugin is responsible for handling the
 * three types of special folders in the extension:
 *
 * - /pages - HTML pages not included in the manifest
 * - /scripts - Script files not included in the manifest
 * - /public - Static files not included in the manifest
 */
export const specialFolders = ({
  manifestPath,
}: PluginInterface): RsbuildPlugin => ({
  name: 'plugin-extension:special-folders',
  setup: (api) => {
    const projectPath = path.dirname(manifestPath);

    // All Extension special folders
    // public/ - static assets. Copy/paste all files to the output folder
    const publicFolder = path.join(projectPath, 'public');
    // pages/ - Add every .html file inside pages/ to the compilation
    const pagesFolder = path.join(projectPath, 'pages');
    // scripts/ - Add every .js-like (see webpack module extensions)
    // file inside sxripts/ to the compilation
    const scriptsFolder = path.join(projectPath, 'scripts');

    // All files in each special folder
    const allPublic = scanPublicFilesInFolder(publicFolder);
    const allPages = scanHtmlFilesInFolder(pagesFolder);
    const allScripts = scanScriptFilesInFolder(projectPath, scriptsFolder);

    // resolve-plugin expects a key-value pair of all files
    const publicList = generatePublicEntries(projectPath, allPublic);
    const pagesList = generatePagesEntries(allPages);
    const scriptsList = generateScriptsEntries(allScripts);

    api.expose('special-folders', () => ({
      public: publicList,
      pages: pagesList,
      scripts: scriptsList,
    }));

    if (process.env.NODE_ENV === 'development') {
      if (api.getRsbuildConfig().dev?.watchFiles) {
        warnUponFolderChanges({ manifestPath }).setup(api);
      }
    }
  },
});
