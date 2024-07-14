import path from 'path'
import {defineConfig, mergeRsbuildConfig} from '@rsbuild/core'
import {pluginExtension} from './plugin-extension'

// TODO: Have a place to parse these
const projectPath = process.env.EXTENSION_PROJECT_PATH || ''
const projectFlags = process.env.EXTENSION_PROJECT_FLAGS || ''

console.log('CLI_PROJECT_PATH:', projectPath)
console.log('CLI_PROJECT_FLAGS:', projectFlags)

const MANIFEST_PATH = path.join(__dirname, projectPath, 'manifest.json')

const sharedConfig = defineConfig({
  plugins: [
    pluginExtension({manifestPath: MANIFEST_PATH})
  ],
  // dev: {},
  // html: {},
  // tools: {},
  // output: {},
  source: {
    entry: {
      main: `${projectPath}/index.js`
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
