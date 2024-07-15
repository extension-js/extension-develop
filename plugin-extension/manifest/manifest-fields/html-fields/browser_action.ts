import {type Manifest} from '../../types'

export default function action(manifest: Manifest): string | undefined {
  if (
    !manifest ||
    !manifest.browser_action ||
    !manifest.browser_action.default_popup
  ) {
    return undefined
  }

  const browserActionPage: string = manifest.browser_action.default_popup

  return browserActionPage
}
