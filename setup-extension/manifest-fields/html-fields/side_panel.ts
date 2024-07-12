import {type Manifest} from '../../types'

export default function sidePanel(manifest: Manifest): string | undefined {
  if (!manifest || !manifest.side_panel || !manifest.side_panel.default_path) {
    return undefined
  }

  const sidePanelPage: string = manifest.side_panel.default_path

  return sidePanelPage
}
