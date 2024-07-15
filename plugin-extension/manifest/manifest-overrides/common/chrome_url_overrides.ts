import { Manifest } from "../../../types"

function getBookmarks(
    manifest: Manifest,
  compiledEntries: Record<string, any>,
  publicFolder: string
) {
  return {
    chrome_url_overrides: {
      ...manifest.chrome_url_overrides,
      bookmarks: '/chrome_url_overrides/bookmarks.html'
    }
  }
}

function getHistory(
    manifest: Manifest,
  compiledEntries: Record<string, any>,
  publicFolder: string
) {
  return {
    chrome_url_overrides: {
            ...manifest.chrome_url_overrides,
      history: '/chrome_url_overrides/history.html'
    }
  }
}

function newTab(
  manifest: Manifest,
  compiledEntries: Record<string, any>,
  publicFolder: string
) {
  return {
    chrome_url_overrides: {
            ...manifest.chrome_url_overrides,
      newtab: '/chrome_url_overrides/newtab.html'
    }
  }
}

export function chromeUrlOverrides(
  manifest: Manifest,
  compiledEntries: Record<string, any>,
  publicFolder: string
) {

  console.log(compiledEntries['chrome_url_overrides/newtab'])

  if (compiledEntries['chrome_url_overrides/history']) {
    return getHistory(manifest, compiledEntries, publicFolder)
  }

  if (compiledEntries['chrome_url_overrides/bookmarks']) {
    return getBookmarks(manifest, compiledEntries, publicFolder)
  }

  if (compiledEntries['chrome_url_overrides/newtab']) {
    return newTab(manifest, compiledEntries, publicFolder)
  }
}
