import path from 'path'
import {type Compiler} from '@rspack/core'

import {type HtmlIncludeList, type InternalHtmlPluginInterface} from '../types'

export default class EnsureHMRForScripts {
  public readonly manifestPath: string
  public readonly includeList: HtmlIncludeList
  public readonly exclude: string[]

  constructor(options: InternalHtmlPluginInterface) {
    this.manifestPath = options.manifestPath
    this.includeList = options.includeList
    this.exclude = options.exclude || []
  }

  public apply(compiler: Compiler): void {
    compiler.options.module.rules.push({
      test: /\.(t|j)sx?$/,
      use: [
        {
          loader: path.resolve(__dirname, './loaders/InjectHmrAcceptLoader'),
          options: {
            manifestPath: this.manifestPath,
            exclude: this.exclude,
            includeList: this.includeList
          }
        }
      ]
    })
  }
}