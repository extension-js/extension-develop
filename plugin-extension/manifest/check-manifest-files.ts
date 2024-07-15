import {
  logger,
  type RsbuildPlugin,
  type RsbuildPluginAPI,
} from '@rsbuild/core';

import { type PluginInterface } from '../types';
import errors from './messages';

const handleHtmlErrors = (api: RsbuildPluginAPI) => {
  const htmlFields = api.useExposed('manifest-fields')();

  for (const [field, value] of Object.entries(htmlFields)) {
    if (value) {
      // console.log({value})
      // const fieldError = errors.manifestFieldError(field, value?.html)
      // if (!fs.existsSync(value.html)) {
      //   logger.error(fieldError)
      // }
    }
  }
};

const handleIconsErrors = (api: RsbuildPluginAPI) => {
  // const iconsFields = api.useExposed('manifest-fields').icons
  // for (const [field, value] of Object.entries(iconsFields)) {
  //   if (value) {
  //     if (typeof value === 'string') {
  //       const fieldError = errors.manifestFieldError(field, value)
  //       if (!fs.existsSync(value)) {
  //         logger.warn(fieldError)
  //       }
  //     }
  //   }
  //   if (value != null && value.constructor.name === 'Object') {
  //     const icon = value as {light?: string; dark?: string}
  //     if (icon.light) {
  //       const fieldError = errors.manifestFieldError(field, icon.light)
  //       if (!fs.existsSync(icon.dark!)) {
  //         logger.warn(fieldError)
  //       }
  //     }
  //     if (icon.dark) {
  //       const fieldError = errors.manifestFieldError(field, icon.dark)
  //       if (!fs.existsSync(icon.dark)) {
  //         logger.warn(fieldError)
  //       }
  //     }
  //   }
  //   if (Array.isArray(value)) {
  //     for (const icon of value) {
  //       const fieldError = errors.manifestFieldError(field, icon as string)
  //       if (typeof icon === 'string') {
  //         if (!fs.existsSync(icon)) {
  //           logger.warn(fieldError)
  //         }
  //       }
  //     }
  //   }
  // }
};

const handleJsonErrors = (api: RsbuildPluginAPI) => {
  // const jsonFields = api.useExposed('manifest-fields')().json
  // for (const [field, jsonPath] of Object.entries(jsonFields)) {
  //   if (jsonPath) {
  //     // const fieldError = errors.manifestFieldError(field, jsonPath)
  //     // if (!fs.existsSync(jsonPath)) {
  //     //   logger.warn(fieldError)
  //     // }
  //   }
  // }
};

const handleScriptsErrors = (api: RsbuildPluginAPI) => {
  // const scriptsFields = api.useExposed('manifest-fields').scripts
  // for (const [field, value] of Object.entries(scriptsFields)) {
  //   if (value) {
  //     const valueArr = Array.isArray(value) ? value : [value]
  //     for (const script of valueArr) {
  //       if (field.startsWith('content_scripts')) {
  //         const [featureName, index] = field.split('-')
  //         const prettyFeature = `${featureName} (index ${index})`
  //         const fieldError = errors.manifestFieldError(prettyFeature, script)
  //         if (!fs.existsSync(script)) {
  //           logger.error(fieldError)
  //         }
  //       } else {
  //         const fieldError = errors.manifestFieldError(field, script)
  //         if (!fs.existsSync(script)) {
  //           logger.error(fieldError)
  //         }
  //       }
  //     }
  //   }
  // }
};

export const checkManifestFiles = ({
  manifestPath,
}: PluginInterface): RsbuildPlugin => ({
  name: 'extension-develop:plugin-extension',
  setup: (api) => {
    // Handle HTML errors.
    handleHtmlErrors(api);

    // Handle icons errors.
    handleIconsErrors(api);

    // Handle JSON errors.
    handleJsonErrors(api);

    // Handle scripts errors.
    handleScriptsErrors(api);
  },
});
