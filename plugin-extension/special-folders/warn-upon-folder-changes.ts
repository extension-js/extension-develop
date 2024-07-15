import * as path from 'path';
import * as chokidar from 'chokidar';
import { type Compiler } from '@rspack/core';
import { bold, red, underline } from '@colors/colors/safe';
import { RsbuildPlugin } from '@rsbuild/core';
import { PluginInterface } from '../types';

function throwCompilationError(
  folder: string,
  filePath: string,
  isAddition?: boolean,
) {
  const pathRelative = path.relative(process.cwd(), filePath);
  const addingOrRemoving = isAddition ? 'Adding' : 'Removing';
  const addedOrRemoved = isAddition ? 'added' : 'removed';
  const typeOfAsset = folder === 'pages' ? 'HTML pages' : 'script files';
  const errorMessage =
    `\n🧩 ${bold('Extension.js')} ${red(
      '✖︎✖︎✖︎',
    )} ${addingOrRemoving} ${typeOfAsset} ` +
    `in the ${underline(
      folder + '/',
    )} folder after compilation requires a server restart.` +
    `\n\n- File ${addedOrRemoved}: ${underline(
      pathRelative,
    )}\n\nRestart the program to apply changes.`;

  // Adding a page or script doesn't make it loaded but at least don't break anything,
  // so we add a warning instead of an error and user can keep working.
  if (isAddition) {
    console.warn(errorMessage);
    return;
  }

  // Removing a page or script breaks the program, so we add an error and
  // user need to restart to see changes.
  console.error(errorMessage);
  process.exit(1);
}

export const warnUponFolderChanges = ({
  manifestPath,
  includeList = {},
  exclude = [],
}: Partial<PluginInterface> = {}): RsbuildPlugin => ({
  name: 'special-folders:warn-upon-folder-changes',
  setup: (api) => {
    // compiler.hooks.afterPlugins.tap('WatchPagesPlugin', () => {
    //   const projectPath: string = path.dirname(manifestPath!)
    //   const pagesPath: string = path.join(projectPath, 'pages')
    //   const scriptsPath: string = path.join(projectPath, 'scripts')
    //   const pagesWatcher = chokidar.watch(pagesPath, {ignoreInitial: true})
    //   const scriptsWatcher = chokidar.watch(scriptsPath, {ignoreInitial: true})
    //   const extensionsSupported = compiler.options.resolve?.extensions
    //   pagesWatcher.on('add', (filePath: string) => {
    //     const isHtml = filePath.endsWith('.html')
    //     if (isHtml) {
    //       throwCompilationError('pages', filePath, true)
    //     }
    //   })
    //   pagesWatcher.on('unlink', (filePath: string) => {
    //     const isHtml = filePath.endsWith('.html')
    //     if (isHtml) {
    //       throwCompilationError('pages', filePath)
    //     }
    //   })
    //   scriptsWatcher.on('add', (filePath: string) => {
    //     const isScript = extensionsSupported?.includes(path.extname(filePath))
    //     if (isScript) {
    //       throwCompilationError('scripts', filePath, true)
    //     }
    //   })
    //   scriptsWatcher.on('unlink', (filePath: string) => {
    //     const isScript = extensionsSupported?.includes(path.extname(filePath))
    //     if (isScript) {
    //       throwCompilationError('scripts', filePath)
    //     }
    //   })
    //   compiler.hooks.watchClose.tap('WatchPagesPlugin', () => {
    //     pagesWatcher.close().catch(console.error)
    //     scriptsWatcher.close().catch(console.error)
    //   })
    // })
  },
});
