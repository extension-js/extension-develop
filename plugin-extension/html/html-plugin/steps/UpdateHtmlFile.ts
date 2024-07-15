import { type Compiler } from '@rspack/core';
import { sources, Compilation } from '@rspack/core';

import { type IncludeList, type InternalPluginInterface } from '../../../types';

import patchHtml from '../lib/patchHtml';
import { shouldExclude } from '../helpers/utils';
import getFilePath from '../helpers/getFilePath';
import getAssetsFromHtml from '../lib/getAssetsFromHtml';

export default class UpdateHtmlFile {
  public readonly manifestPath: string;
  public readonly includeList?: IncludeList;

  constructor(options: InternalPluginInterface) {
    this.manifestPath = options.manifestPath;
    this.includeList = options.includeList;
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(
      'HtmlPlugin (UpdateHtmlFile)',
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'HtmlPlugin (UpdateHtmlFile)',
            // Summarize the list of existing assets.
            stage: Compilation.PROCESS_ASSETS_STAGE_DERIVED,
          },
          () => {
            if (compilation.errors.length > 0) return;

            const htmlEntries = this.includeList || {};

            for (const field of Object.entries(htmlEntries)) {
              const [feature, resource] = field;
              const html = resource;

              // Resources from the manifest lib can come as undefined.
              if (html) {
                const updatedHtml: string = patchHtml(
                  compilation,
                  feature,
                  html,
                  htmlEntries,
                );

                if (!shouldExclude(html, ['public/'])) {
                  const rawSource = new sources.RawSource(updatedHtml);
                  const filepath = getFilePath(feature, '.html');
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
