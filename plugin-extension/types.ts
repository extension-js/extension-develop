export type ChromeManifest = Partial<chrome.runtime.ManifestV2> &
  Partial<chrome.runtime.ManifestV3> & {
    browser_action?: {
      theme_icons?: ThemeIcon[]
    }
  }

export type Manifest = ChromeManifest

export interface ThemeIcon {
  light: string
  dark: string
  size?: number
}

export interface PluginInterface {
  manifestPath: string
  includeList?: IncludeList
  exclude?: string[]
}

export type IncludeList = Record<string, string>
