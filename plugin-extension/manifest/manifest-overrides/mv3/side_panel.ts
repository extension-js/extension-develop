import {type Manifest} from '../../../types'
import getFilename from '../../../manifest/getFilename'

export default function sidePanel(compiledEntries: Record<string, any>, publicFolder: string) {
  return (
    manifest.side_panel && {
      side_panel: {
        ...(manifest.side_panel.default_path && {
          default_path: getFilename(
            'side_panel/default_path.html',
            manifest.side_panel.default_path as string,
            exclude
          )
        })
      }
    }
  )
}
