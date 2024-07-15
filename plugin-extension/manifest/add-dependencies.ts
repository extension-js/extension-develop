import {type RsbuildPlugin} from '@rsbuild/core'
import {InternalPluginInterface} from '../types'

export const addDependencies = ({
  manifestPath,
}: InternalPluginInterface): RsbuildPlugin => ({
  name: 'manifest:add-dependencies',
  setup: (api) => {
    api.modifyRsbuildConfig((config) => {
      if (config) {
        if (config.dev) {
          config.dev.watchFiles = {
            paths: [
              ...config.dev.watchFiles 
              ? config.dev.watchFiles.paths
              : [],
              manifestPath
            ],
          }
        }
      }
    })
  }
})

