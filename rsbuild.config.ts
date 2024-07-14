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
    writeToDisk: true,
  },
  html: {
    outputStructure: 'nested',
  },
  // tools: {},
  output: {
    manifest: true,
    distPath: {
      root: path.join(__dirname, projectPath, 'dist', TARGET_BROWSER),
    }
  },
  source: {
    entry: {
      'fake_manifest': `${projectPath}/manifest.json`
    }
  }
  // server: {},
  // security: {},
  // performance: {},
  // moduleFederation: {},
  // environments: {},
})

const config = mergeRsbuildConfig(sharedConfig, {})

export default config
