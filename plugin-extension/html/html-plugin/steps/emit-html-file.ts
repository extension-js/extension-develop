import fs from 'fs';
import { type Compiler, Compilation } from '@rspack/core';
import { sources } from '@rspack/core';
import { type IncludeList, type InternalPluginInterface } from '../../../types';
import errors from '../helpers/errors';
import getFilePath from '../helpers/getFilePath';

export default class EmitHtmlFile {
  public readonly manifestPath: string;
  public readonly includeList?: IncludeList;

  constructor(options: InternalPluginInterface) {
    this.manifestPath = options.manifestPath;
    this.includeList = options.includeList;
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(
      'html-plugin:emit-html-file',
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'AddAssetsToCompilationPlugin',
            // Derive new assets from the existing assets.
            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          () => {
            const htmlFields = Object.entries(this.includeList || {});

            for (const field of htmlFields) {
              const [featureName, featureDataPath] = field;

              if (featureDataPath) {
                // Do not output if file doesn't exist.
                // If the user updates the path, this script will
                // run again and update the file accordingly.
                if (!fs.existsSync(featureDataPath)) {
                  errors.entryNotFoundWarn(
                    compilation,
                    featureName,
                    featureDataPath,
                  );
                  return;
                }

                const rawHtml = fs.readFileSync(featureDataPath, 'utf8');

                if (!featureDataPath.includes('public/')) {
                  const rawSource = new sources.RawSource(rawHtml);
                  const filepath = getFilePath(featureName, '.html');
                  compilation.emitAsset(filepath, rawSource);
                }
              }
            }
          },
        );
      },
    );
  }
}
