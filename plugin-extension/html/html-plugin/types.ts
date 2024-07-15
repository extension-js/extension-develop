export interface HtmlPluginInterface {
  manifestPath: string
  include?: string[]
  exclude?: string[]
}

export interface InternalHtmlPluginInterface {
  manifestPath: string
  includeList: HtmlIncludeList
  exclude: string[]
}

export type HtmlIncludeList = Record<
  string,
  | {
      html: string
      js: string[]
      css: string[]
      static: string[]
    }
  | undefined
>

export type ResourceType =
  | 'script'
  | 'css'
  | 'html'
  | 'static'
  | 'staticSrc'
  | 'staticHref'
  | 'empty'
