import {type Manifest} from '../../types'

export default function sidebarAction(manifest: Manifest): string | undefined {
  if (
    !manifest ||
    !manifest.sidebar_action ||
    !manifest.sidebar_action.default_panel
  ) {
    return undefined
  }

  const sidebarPage: string = manifest.sidebar_action.default_panel

  return sidebarPage
}
