import { Manifest } from "../../../types"

function getBookmarks(
    manifest: Manifest,
  compiledEntries: Record<string, any>,
  publicFolder: string
) {
  if (!compiledEntries['chrome_url_overrides/bookmarks.html']) {
    return undefined
  }

  if (compiledEntries['chrome_url_overrides/bookmarks.html'].includes(publicFolder)) {
    return undefined
  }

  return {
    chrome_url_overrides: {
      ...manifest.chrome_url_overrides,
      bookmarks: compiledEntries['chrome_url_overrides/bookmarks.html']
    }
  }
}

function getHistory(
    manifest: Manifest,
  compiledEntries: Record<string, any>,
  publicFolder: string
) {
  if (!compiledEntries['chrome_url_overrides/history.html']) {
    return undefined
  }

  if (compiledEntries['chrome_url_overrides/history.html'].includes(publicFolder)) {
    return undefined
  }

  return {
    chrome_url_overrides: {
            ...manifest.chrome_url_overrides,
      history: compiledEntries['chrome_url_overrides/history.html']
    }
  }
}

function newTab(
  manifest: Manifest,
  compiledEntries: Record<string, any>,
  publicFolder: string
) {
  if (!compiledEntries['chrome_url_overrides/newtab.html']) {
    return undefined
  }

  if (compiledEntries['chrome_url_overrides/newtab.html'].includes(publicFolder)) {
    return undefined
  }

  return {
    chrome_url_overrides: {
            ...manifest.chrome_url_overrides,
      newtab: compiledEntries['chrome_url_overrides/newtab.html']
    }
  }
}

export function chromeUrlOverrides(
  manifest: Manifest,
  compiledEntries: Record<string, any>,
  publicFolder: string
) {

  if (compiledEntries['chrome_url_overrides/history.html']) {
    return getHistory(manifest, compiledEntries, publicFolder)
  }

  if (compiledEntries['chrome_url_overrides/bookmarks.html']) {
    return getBookmarks(manifest, compiledEntries, publicFolder)
  }

  if (compiledEntries['chrome_url_overrides/newtab.html']) {
    return newTab(manifest, compiledEntries, publicFolder)
  }
}
