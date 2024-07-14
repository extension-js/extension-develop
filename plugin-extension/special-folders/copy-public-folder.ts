import fs from 'fs'
import path from 'path'
// import chokidar from 'chokidar'
import { RsbuildPlugin } from '@rsbuild/core'
import { PluginInterface } from '../types'

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  fs.mkdirSync(dirname, {recursive: true})
}

function copyFile(sourcePath: string, targetPath: string) {
  ensureDirectoryExistence(targetPath)
  fs.copyFileSync(sourcePath, targetPath)
}

// function copyFolder(source: string, target: string) {
//   if (!fs.existsSync(target)) fs.mkdirSync(target, {recursive: true})

//   const files = fs.readdirSync(source)

//   files.forEach((file) => {
//     const sourcePath = path.join(source, file)
//     const targetPath = path.join(target, file)

//     if (fs.statSync(sourcePath).isDirectory()) {
//       copyFolder(sourcePath, targetPath)
//     } else {
//       copyFile(sourcePath, targetPath)
//     }
//   })
// }

export const copyPublicFolder = ({
  manifestPath,
}: Partial<PluginInterface> = {}): RsbuildPlugin => ({
  name: 'special-folders:copy-public-folder',
  setup: (api) => {
    const projectPath = path.dirname(manifestPath!)
    const staticDir = path.join(projectPath, 'public')
    // TODO: cezaraugusto
    // const output = api.getRsbuildConfig().output?.distPath?.root || ''

    if (!fs.existsSync(staticDir)) return

    // compiler.hooks.afterEmit.tap('CopyStaticFolder', () => {
    //   const target = path.join(output, 'public')

    //   if (!fs.existsSync(target)) fs.mkdirSync(target, {recursive: true})

    //   if (fs.existsSync(staticDir)) {
    //     copyFolder(staticDir, target)
    //   }
    // })

    // if (process.env.NODE_ENV === 'production') return

    // compiler.hooks.afterPlugins.tap('WatchPagesPlugin', () => {
    //   const staticPath: string = path.join(projectPath, 'public')
    //   const watcher = chokidar.watch(staticPath, {ignoreInitial: true})

    //   watcher.on('add', (filePath: string) => {
    //     const target = path.join(output, path.relative(projectPath, filePath))
    //     copyFile(filePath, target)
    //   })

    //   watcher.on('change', (filePath: string) => {
    //     const target = path.join(output, path.relative(projectPath, filePath))
    //     copyFile(filePath, target)
    //   })

    //   watcher.on('unlink', (filePath: string) => {
    //     const target = path.join(output, path.relative(projectPath, filePath))

    //     if (fs.existsSync(target)) {
    //       fs.unlinkSync(target)
    //     }
    //   })

    //   compiler.hooks.watchClose.tap('WatchPagesPlugin', () => {
    //     watcher.close().catch(console.error)
    //   })
    // })
  }
})
