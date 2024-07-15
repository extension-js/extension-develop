import {type ManifestBase} from './manifest-types'

export interface HtmlPluginInterface {
  manifestPath: string
  include?: string[]
  exclude?: string[]
}

export interface StepPluginInterface {
  manifestPath: string
  includeList: IncludeList
  exclude: string[]
}

export type IncludeList = Record<
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

export type Manifest = ManifestBase
