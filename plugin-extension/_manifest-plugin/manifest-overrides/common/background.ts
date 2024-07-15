import {type Manifest} from '../../types'
import getFilename from '../../../manifest/getFilename'

export default function getBackground(manifest: Manifest, exclude: string[]) {
  return (
    manifest.background &&
    manifest.background.page && {
      background: {
        ...manifest.background,
        ...(manifest.background.page && {
          page: getFilename(
            'background/page.html',
            manifest.background.page as string,
            exclude
          )
        })
      }
    }
  )
}
