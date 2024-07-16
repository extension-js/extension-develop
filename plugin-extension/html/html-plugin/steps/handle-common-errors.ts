import { type Compiler } from '@rspack/core';

import { type IncludeList, type InternalPluginInterface } from '../../../types';

import errors from '../helpers/errors';

export default class CommonErrorsPlugin {
  public readonly manifestPath: string;
  public readonly includeList?: IncludeList;

  constructor(options: InternalPluginInterface) {
    this.manifestPath = options.manifestPath;
    this.includeList = options.includeList;
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(
      'html:handle-common-errors',
      (compilation) => {
        compilation.hooks.afterSeal.tapPromise(
          'html:handle-common-errors',
          async () => {
            compilation.errors.forEach((error, index) => {
              // Handle "Module not found" errors.
              // This is needed because we can't recompile entrypoints at runtime.
              // This does not cover static assets because they are not entrypoints.
              // For that we use the AddAssetsToCompilationPlugin.
              const cantResolveError = errors.handleCantResolveError(
                this.manifestPath,
                this.includeList || {},
                error,
              );
              if (cantResolveError) {
                compilation.errors[index] = cantResolveError;
              }
            });
          },
        );
      },
    );
  }
}
