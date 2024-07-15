import {Manifest} from '../../../types'

export function backgroundServiceWorker(
  manifest: Manifest,
  compiledEntries: Record<string, any>, publicFolder: string) {
  if (!compiledEntries['background/service_worker']) {
    return undefined
  }

  // if (compiledEntries['background/service_worker']?.includes(publicFolder)) {
  //   return undefined
  // }

  const serviceWorkerScripts = compiledEntries['background/service_worker'].initial.js
  return {
    background: {
      ...manifest.background,
      service_worker: serviceWorkerScripts[serviceWorkerScripts.length - 1]
    }
  }
}
