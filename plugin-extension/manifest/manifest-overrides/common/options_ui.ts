import {type Manifest} from '../../../types'
import getFilename from '../../../manifest/getFilename'

export default function optionsUi(compiledEntries: Record<string, any>, publicFolder: string) {
  return (
    manifest.options_ui && {
      options_ui: {
        ...manifest.options_ui,
        ...(manifest.options_ui.page && {
          page: getFilename(
            'options_ui/page.html',
            manifest.options_ui.page,
            exclude
          )
        })
      }
    }
  )
}
