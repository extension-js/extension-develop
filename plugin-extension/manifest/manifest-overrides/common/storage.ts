import {type Manifest} from '../../../types'
import getFilename from '../../../manifest/getFilename'

export default function storage(compiledEntries: Record<string, any>, publicFolder: string) {
  return (
    manifest.storage && {
      storage: {
        ...(manifest.storage.managed_schema && {
          managed_schema: getFilename(
            'storage/managed_schema.json',
            manifest.storage.managed_schema,
            exclude
          )
        })
      }
    }
  )
}
