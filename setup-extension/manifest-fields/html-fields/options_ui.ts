import {type Manifest} from '../../types'

export default function optionsUi(manifest: Manifest): string | undefined {
  if (manifest.options_page) {
    const optionsPage: string = manifest.options_page

    return optionsPage
  }

  if (!manifest || !manifest.options_ui || !manifest.options_ui.page) {
    return undefined
  }

  const optionsPage: string = manifest.options_ui.page

  return optionsPage
}
