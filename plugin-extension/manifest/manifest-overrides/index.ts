import path from 'path'
import manifestCommon from './common'
import manifestV2 from './mv2'
import manifestV3 from './mv3'
import {type Manifest} from '../../types'

export function getManifestOverrides(
  manifest: Manifest,
  compiledEntries: Record<string, any>,
  exclude: string
) {
  return {
      ...manifestCommon(manifest, compiledEntries, exclude),
      // ...manifestV2(manifest, compiledEntries, exclude),
      ...manifestV3(manifest, compiledEntries, exclude)
    }
}
