import path from 'path';
import { type Compiler } from '@rspack/core';

import { type IncludeList, type InternalPluginInterface } from '../../../types';

export default class EnsureHMRForScripts {
  public readonly manifestPath: string;
  public readonly includeList?: IncludeList;

  constructor(options: InternalPluginInterface) {
    this.manifestPath = options.manifestPath;
    this.includeList = options.includeList;
  }

  public apply(compiler: Compiler): void {
    compiler.options.module.rules.push({
      test: /\.(t|j)sx?$/,
      use: [
        {
          loader: path.resolve(__dirname, './loaders/InjectHmrAcceptLoader'),
          options: {
            manifestPath: this.manifestPath,
            exclude: ['public/'],
            includeList: this.includeList,
          },
        },
      ],
    });
  }
}
