import {type Manifest} from '../../../types'
import getFilename from '../../../manifest/getFilename'

export default function optionsPage(compiledEntries: Record<string, any>, publicFolder: string) {
  return (
    manifest.options_page && {
      options_page: getFilename(
        'options_ui/page.html',
        manifest.options_page,
        exclude
      )
    }
  )
}
