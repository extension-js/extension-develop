export type ChromeManifest = Partial<chrome.runtime.ManifestV2> &
  Partial<chrome.runtime.ManifestV3> & {
    browser_action?: {
      theme_icons?: ThemeIcon[];
    };
  };

export type Manifest = ChromeManifest;

export interface ThemeIcon {
  light: string;
  dark: string;
  size?: number;
}

export type PluginInterface = {
  manifestPath: string;
};

export type InternalPluginInterface = {
  manifestPath: string;
  includeList?: IncludeList;
};

export type IncludeList = Record<string, string>;

export type ResourceType =
  | 'script'
  | 'css'
  | 'html'
  | 'static'
  | 'staticSrc'
  | 'staticHref'
  | 'empty';
