import {type Manifest} from '../../types'

export default function pageAction(manifest: Manifest): string | undefined {
  if (
    !manifest ||
    !manifest.page_action ||
    !manifest.page_action.default_popup
  ) {
    return undefined
  }

  const pageActionPage: string = manifest.page_action.default_popup

  return pageActionPage
}
