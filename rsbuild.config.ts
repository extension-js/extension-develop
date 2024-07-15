import path from 'path'
import {defineConfig, mergeRsbuildConfig} from '@rsbuild/core'
import {pluginExtension} from './plugin-extension'

// TODO: Have a place to parse these
const projectPath = process.env.EXTENSION_PROJECT_PATH || ''
const projectFlags = process.env.EXTENSION_PROJECT_FLAGS || ''

const MANIFEST_PATH = path.join(__dirname, projectPath, 'manifest.json')
const TARGET_BROWSER = 'chrome'

console.log('MANIFEST_PATH:', __dirname, projectPath)
// console.log('EXTENSION_PROJECT_FLAGS:', projectFlags)
// console.log('TARGET_BROWSER:', TARGET_BROWSER)

const sharedConfig = defineConfig({
  plugins: [
    pluginExtension({manifestPath: MANIFEST_PATH})
  ],
  dev: {
    writeToDisk: true, // (file) => !file.includes('.hot-update.'),
    watchFiles: {
      paths: path.join(projectPath, 'manifest.json')
    }
  },
  // html: {},
  // tools: {
  //   htmlPlugin: false,
  // },
  output: {
    manifest: true,
    distPath: {
      root: path.join(__dirname, projectPath, 'dist', TARGET_BROWSER),
      html: '/',
      js: '',
      jsAsync: '',
      css: '',
      cssAsync: '',
      svg: 'svg',
      font: 'font',
      wasm: 'wasm',
      image: 'image',
      media: 'media',
    }
  },
  source: {
    // include: [path.resolve(__dirname, '../other-dir')],
    entry: {
      manifest_fake: MANIFEST_PATH,
      // TODO: exclude bg?
      // exclude: [
        // path.join(__dirname, projectPath, 'public'),
        // MANIFEST_PATH
      // ],
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.EXTENSION_BROWSER': TARGET_BROWSER
    },
  },
  server: {
    printUrls({ urls, port, protocol, routes }) {
      // console.log(urls); // ['http://localhost:3000', 'http://192.168.0.1:3000']
      // console.log(port); // 3000
      // console.log(protocol); // 'http' or 'https'
      // console.log(routes); // ['/', '/about', '/contact']
    },
    publicDir: {
      name: 'public',
      watch: true,
    },
  },
  // security: {},
  // performance: {},
  // moduleFederation: {},
  // environments: {},
})

const config = mergeRsbuildConfig(sharedConfig, {})

export default config
