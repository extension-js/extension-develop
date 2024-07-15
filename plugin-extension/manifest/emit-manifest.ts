import fs from 'fs'
import {type RsbuildPlugin} from '@rsbuild/core'

import {type PluginInterface, type Manifest} from '../types'
import errors from './errors'

export const emitManifest = ({
  manifestPath,
}: PluginInterface): RsbuildPlugin => ({
  name: 'manifest:emit-manifest',
  setup: (api) => {
    // Do not emit manifest if it doesn't exist.
    if (!fs.existsSync(manifestPath)) {
      errors.manifestNotFoundError()
      return
    }

    // Do not emit manifest if json is invalid.
    try {
      JSON.parse(fs.readFileSync(manifestPath).toString())
    } catch (error: any) {
      errors.manifestInvalidError(error)
      return
    }

    const manifestData: Manifest = require(manifestPath)
    api.expose('manifest-json', () => manifestData);
  }
})
