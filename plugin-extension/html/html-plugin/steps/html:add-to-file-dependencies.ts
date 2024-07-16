import fs from 'fs';
import path from 'path';
import { type Compiler } from '@rspack/core';
import { Compilation } from '@rspack/core';

import { type IncludeList, type InternalPluginInterface } from '../../../types';

import getAssetsFromHtml from '../lib/get-assets-from-html';

export default class AddToFileDependencies {
  public readonly manifestPath: string;
  public readonly includeList?: IncludeList;

  constructor(options: InternalPluginInterface) {
    this.manifestPath = options.manifestPath;
    this.includeList = options.includeList;
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(
      'html:add-to-file-dependencies',
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'html:add-to-file-dependencies',
            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
          },
          (assets) => {
            if (compilation.errors?.length) return;

            const allEntries = this.includeList || {};

            for (const field of Object.entries(allEntries)) {
              const [, featureDataPath] = field;

              if (featureDataPath) {
                const resourceData = getAssetsFromHtml(featureDataPath);
                const fileDependencies = new Set(compilation.fileDependencies);

                if (fs.existsSync(featureDataPath)) {
                  const fileResources = [
                    featureDataPath,
                    ...(resourceData?.static || []),
                  ];

                  for (const thisResource of fileResources) {
                    if (!fileDependencies.has(thisResource)) {
                      fileDependencies.add(thisResource);

                      if (thisResource === featureDataPath) {
                        compilation.fileDependencies.add(thisResource);
                      }
                    }
                  }
                }
              }
            }
          },
        );
      },
    );
  }
}
