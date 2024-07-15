import path from 'path'
import {type Manifest} from '../../../types'
import getFilename from '../../../manifest/getFilename'

const getBasename = (filepath: string) => path.basename(filepath)

export default function icons(compiledEntries: Record<string, any>, publicFolder: string) {
  return (
    manifest.icons && {
      icons: Object.fromEntries(
        Object.entries(manifest.icons).map(([size, icon]) => {
          return [
            size,
            getFilename(`icons/${getBasename(icon)}`, icon, exclude)
          ]
        })
      )
    }
  )
}
