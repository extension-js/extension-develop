import path from 'path';
import fs from 'fs';
import { type Compiler } from '@rspack/core';
import { type IncludeList, type InternalPluginInterface } from '../../../types';
import getAssetsFromHtml from '../lib/get-assets-from-html';
import error from '../helpers/errors';
import { manifestFieldError } from '../helpers/messages';

export default class ThrowIfRecompileIsNeeded {
  public readonly manifestPath: string;
  public readonly includeList?: IncludeList;
  private initialHtmlAssets: Record<string, { js: string[]; css: string[] }> =
    {};

  constructor(options: InternalPluginInterface) {
    this.manifestPath = options.manifestPath;
    this.includeList = options.includeList;
  }

  private hasEntriesChanged(
    updatedEntries: string[] | undefined,
    prevEntries: string[] | undefined,
  ): boolean {
    if (!prevEntries || !updatedEntries) return true;

    if (updatedEntries.length !== prevEntries.length) return true;

    for (let i = 0; i < updatedEntries.length; i++) {
      if (updatedEntries[i] !== prevEntries[i]) {
        return true;
      }
    }
    return false;
  }

  private storeInitialHtmlAssets(htmlFields: Record<string, any>) {
    Object.entries(htmlFields).forEach(([key, resource]) => {
      const htmlFile = resource as string;

      if (htmlFile) {
        if (!fs.existsSync(htmlFile)) {
          console.error(manifestFieldError(key, htmlFile));
          process.exit(1);
        }

        this.initialHtmlAssets[htmlFile] = {
          js: getAssetsFromHtml(htmlFile)?.js || [],
          css: getAssetsFromHtml(htmlFile)?.css || [],
        };
      }
    });
  }

  public apply(compiler: Compiler): void {
    const htmlFields = this.includeList || {};

    this.storeInitialHtmlAssets(htmlFields);

    compiler.hooks.make.tapAsync(
      'html:throw-if-recompile-is-needed',
      (compilation, done) => {
        const files = compiler.modifiedFiles || new Set<string>();
        const changedFile = Array.from(files)[0];

        if (changedFile && this.initialHtmlAssets[changedFile]) {
          const updatedJsEntries = getAssetsFromHtml(changedFile)?.js || [];
          const updatedCssEntries = getAssetsFromHtml(changedFile)?.css || [];

          const { js, css } = this.initialHtmlAssets[changedFile];

          if (
            this.hasEntriesChanged(updatedCssEntries, css) ||
            this.hasEntriesChanged(updatedJsEntries, js)
          ) {
            const projectDir = path.dirname(this.manifestPath);
            error.serverStartRequiredError(
              compilation,
              projectDir,
              changedFile,
            );
          }
        }

        done();
      },
    );
  }
}
