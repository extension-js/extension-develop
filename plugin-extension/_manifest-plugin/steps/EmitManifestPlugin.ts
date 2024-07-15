import fs from 'fs'
import {type Compiler} from '@rspack/core'
import {sources} from '@rspack/core'
import errors from '../../manifest/errors'

interface Options {
  manifestPath: string
}

export default class EmitManifestPlugin {
  private readonly options: Options

  constructor(options: Options) {
    this.options = options
  }

  apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(
      'ManifestPlugin (EmitManifestPlugin)',
      (compilation) => {
        // Fired when the compilation stops accepting new modules.
        compilation.hooks.afterProcessAssets.tap(
          'ManifestPlugin (EmitManifestPlugin)',
          () => {
            // Do not emit manifest if it doesn't exist.
            if (!fs.existsSync(this.options.manifestPath)) {
              errors.manifestNotFoundError(compilation)
              return
            }

            // Do not emit manifest if json is invalid.
            try {
              JSON.parse(fs.readFileSync(this.options.manifestPath).toString())
            } catch (error: any) {
              errors.manifestInvalidError(compilation, error)
              return
            }

            if (compilation.errors.length > 0) return

            const filename = 'manifest.json'
            const source = fs.readFileSync(this.options.manifestPath)
            const rawSource = new sources.RawSource(source)

            compilation.emitAsset(filename, rawSource)
          }
        )
      }
    )
  }
}
