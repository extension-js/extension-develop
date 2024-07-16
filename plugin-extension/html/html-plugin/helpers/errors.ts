import fs from 'fs';
import rspack, { Compilation } from '@rspack/core';
import {
  fileError,
  manifestFieldError,
  manifestMissingError,
  serverRestartRequired,
} from './messages';
import getAssetsFromHtml from '../lib/get-assets-from-html';
import { type IncludeList } from '../../../types';
import { StatsError } from '@rspack/core';

function manifestNotFoundError(compilation: Compilation) {
  const errorMessage = manifestMissingError();

  compilation.errors.push(new rspack.WebpackError(errorMessage));
}

function entryNotFoundWarn(
  compilation: Compilation,
  feature: string,
  htmlFilePath: string,
) {
  const errorMessage = manifestFieldError(feature, htmlFilePath);

  compilation.warnings.push(new rspack.WebpackError(errorMessage));
}

function fileNotFoundWarn(
  compilation: Compilation,
  manifestPath: string,
  htmlFilePath: string,
  filePath: string,
) {
  const errorMessage = fileError(manifestPath, htmlFilePath, filePath);

  compilation.warnings.push(new rspack.WebpackError(errorMessage));
}

function serverStartRequiredError(
  compilation: Compilation,
  projectDir: string,
  changedFile: string,
) {
  const errorMessage = serverRestartRequired(projectDir, changedFile);

  compilation.errors.push(new rspack.WebpackError(errorMessage));
}

function handleCantResolveError(
  manifestPath: string,
  includeList: IncludeList,
  error: StatsError,
) {
  const cantResolveMsg = "Module not found: Error: Can't resolve ";
  const customError = error.message.replace(cantResolveMsg, '');
  const wrongFilename = customError.split("'")[1];

  if (error.message.includes(cantResolveMsg)) {
    for (const field of Object.entries(includeList)) {
      const [, featureDataPath] = field;

      // Resources from the manifest lib can come as undefined.
      if (featureDataPath) {
        if (!fs.existsSync(featureDataPath)) return null;

        const htmlAssets = getAssetsFromHtml(featureDataPath);
        const jsAssets = htmlAssets?.js || [];
        const cssAssets = htmlAssets?.css || [];

        if (
          jsAssets.includes(wrongFilename) ||
          cssAssets.includes(wrongFilename)
        ) {
          const errorMsg = fileError(
            manifestPath,
            featureDataPath,
            wrongFilename,
          );
          return new rspack.WebpackError(errorMsg);
        }
      }
    }
  }

  return null;
}

export default {
  manifestNotFoundError,
  entryNotFoundWarn,
  fileNotFoundWarn,
  serverStartRequiredError,
  handleCantResolveError,
};
