import {type Manifest} from '../../types'

export default function devtools(manifest: Manifest): string | undefined {
  if (!manifest || !manifest.devtools_page) {
    return undefined
  }

  const devtoolsPage: string = manifest.devtools_page

  return devtoolsPage
}
