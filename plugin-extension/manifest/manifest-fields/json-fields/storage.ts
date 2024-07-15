import { type Manifest } from '../../types';

export default function storage(manifest: Manifest): string | undefined {
  if (!manifest || !manifest.storage || !manifest.storage.managed_schema) {
    return undefined;
  }

  const storageManagedSchema: string = manifest.storage.managed_schema;

  return storageManagedSchema;
}
