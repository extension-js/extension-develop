import { type RsbuildPlugin } from '@rsbuild/core';

import { type PluginInterface } from '../types';

import { emitManifest } from './emit-manifest';
import { manifestFields } from './manifest-fields';
import { checkManifestFiles } from './check-manifest-files';
import { updateManifest } from './update-manifest';
import { addDependencies } from './add-dependencies';
import { throwIfRecompileIsNeeded } from './throw-if-recompile-is-needed';

/**
 * ManifestPlugin is responsible for handling the manifest.json file.
 * It ensures that the files defined in the manifest have valid paths,
 * throwing errors if they don't. It also ensures the manifest is emitted
 * to the assets bundle, so other plugins can modify it, and stored
 * as file dependency so webpack can watch and trigger changes.
 *
 * The plugin also has a guard against recompiling entrypoints
 * at runtime, throwing an error if any of those files change.
 */
export const manifest = ({ manifestPath }: PluginInterface): RsbuildPlugin => ({
  name: 'plugin-extension:manifest',
  setup: (api) => {
    // 1 - Emit the manifest to the assets bundle.
    // It doesn't change the manifest, it just ensures
    // it's emitted to the assets bundle so other plugins
    // can modify it.
    emitManifest({ manifestPath }).setup(api);

    // 2 - With the manifest api.context.rootPathfile, expose its fields
    // so other plugins can consume its data without
    // requiring the manifest file every time.
    manifestFields({ manifestPath }).setup(api);

    // 3 - Ensure the files defined in the manifest have valid paths,
    // throwing errors if they don't.
    checkManifestFiles({ manifestPath }).setup(api);

    // 4 - This is the end result of the manifest plugin, it updates the
    // manifest with the output path of relevant files.
    updateManifest({ manifestPath }).setup(api);

    // 5 - Ensure this manifest is stored as file dependency
    // so webpack can watch and trigger changes.
    addDependencies({ manifestPath }).setup(api);

    // 6 - Some files in manifest are used as entrypoints. Since
    // we can't recompile entrypoints at runtime, we need to
    // throw an error if any of those files change.
    throwIfRecompileIsNeeded({ manifestPath }).setup(api);
  },
});
