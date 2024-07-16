import { type Compiler } from '@rspack/core';
import { sources, Compilation } from '@rspack/core';

import { type IncludeList, type InternalPluginInterface } from '../../../types';

import patchHtml from '../lib/patch-html';
import { shouldExclude } from '../helpers/utils';
import getFilePath from '../helpers/getFilePath';

export default class UpdateHtmlFile {
  public readonly manifestPath: string;
  public readonly includeList?: IncludeList;

  constructor(options: InternalPluginInterface) {
    this.manifestPath = options.manifestPath;
    this.includeList = options.includeList;
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(
      'html:update-html-file',
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'html:update-html-file',
            stage: Compilation.PROCESS_ASSETS_STAGE_DERIVED,
          },
          () => {
            if (compilation.errors.length > 0) return;

            const htmlEntries = this.includeList || {};

            for (const field of Object.entries(htmlEntries)) {
              const [featureName, featureDataPath] = field;

              if (featureDataPath) {
                const updatedHtml: string = patchHtml(
                  compilation,
                  featureName,
                  featureDataPath,
                  htmlEntries,
                );

                if (!shouldExclude(featureDataPath, ['public/'])) {
                  const rawSource = new sources.RawSource(updatedHtml);
                  const filepath = getFilePath(featureName, '.html');
                  compilation.updateAsset(filepath, rawSource);
                }
              }
            }
          },
        );
      },
    );
  }
}
