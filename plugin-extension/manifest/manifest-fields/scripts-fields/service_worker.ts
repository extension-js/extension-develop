import { type Manifest } from '../../types';

export default function serviceWorker(manifest: Manifest): string | undefined {
  if (!manifest || !manifest.background) {
    return undefined;
  }

  const serviceWorker = manifest.background.service_worker;

  if (serviceWorker) {
    return serviceWorker;
  }

  return undefined;
}
