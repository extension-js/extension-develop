import fs from 'fs'
import { logger } from '@rsbuild/core'
import manifestFields from 'browser-extension-manifest-fields'

import messages from './messages'
import {type Manifest} from '../_manifest-plugin/types'

function manifestNotFoundError() {
  logger.error(
    (
      `[manifest.json]: ${messages.manifestNotFoundError}`
    )
  )
}

function manifestInvalidError( error: any) {
  logger.error(
    (`[manifest.json]: ${messages.manifestInvalidError}`)
  )
}

function handleHtmlErrors(
    manifestPath: string,
) {
  const manifest: Manifest = require(manifestPath)
  const htmlFields = manifestFields(manifestPath, manifest).html

  for (const [field, value] of Object.entries(htmlFields)) {
    if (value) {
      const fieldError = messages.manifestFieldError(field, value?.html)

      if (!fs.existsSync(value.html)) {
        logger.error((fieldError))
      }
    }
  }
}

function handleIconsErrors(
  
  manifestPath: string,
) {
  const manifest: Manifest = require(manifestPath)
  const iconsFields = manifestFields(manifestPath, manifest).icons

  for (const [field, value] of Object.entries(iconsFields)) {
    if (value) {
      if (typeof value === 'string') {
        const fieldError = messages.manifestFieldError(field, value)

        if (!fs.existsSync(value)) {
          logger.error((fieldError))
        }
      }
    }

    if (value != null && value.constructor.name === 'Object') {
      const icon = value as {light?: string; dark?: string}

      if (icon.light) {
        const fieldError = messages.manifestFieldError(field, icon.light)

        if (!fs.existsSync(icon.dark!)) {
          logger.error((fieldError))
        }
      }

      if (icon.dark) {
        const fieldError = messages.manifestFieldError(field, icon.dark)

        if (!fs.existsSync(icon.dark)) {
          logger.error((fieldError))
        }
      }
    }

    if (Array.isArray(value)) {
      for (const icon of value) {
        const fieldError = messages.manifestFieldError(field, icon as string)

        if (typeof icon === 'string') {
          if (!fs.existsSync(icon)) {
            logger.error((fieldError))
          }
        }
      }
    }
  }
}

function handleJsonErrors(
  
  manifestPath: string,

) {
  const manifest: Manifest = require(manifestPath)
  const jsonFields = manifestFields(manifestPath, manifest).json

  for (const [field, value] of Object.entries(jsonFields)) {
    if (value) {
      const valueArr: string[] = Array.isArray(value) ? value : [value]

      for (const json of valueArr) {
        const fieldError = messages.manifestFieldError(field, json)

        if (!fs.existsSync(json)) {
          logger.error((fieldError))
        }
      }
    }
  }
}

function handleScriptsErrors(
  
  manifestPath: string,

) {
  const manifest: Manifest = require(manifestPath)
  const scriptsFields = manifestFields(manifestPath, manifest).scripts

  for (const [field, value] of Object.entries(scriptsFields)) {
    if (value) {
      const valueArr = Array.isArray(value) ? value : [value]

      for (const script of valueArr) {
        if (field.startsWith('content_scripts')) {
          const [featureName, index] = field.split('-')
          const prettyFeature = `${featureName} (index ${index})`
          const fieldError = messages.manifestFieldError(prettyFeature, script)

          if (!fs.existsSync(script)) {
            logger.error((fieldError))
          }
        } else {
          const fieldError = messages.manifestFieldError(field, script)

          if (!fs.existsSync(script)) {
            logger.error((fieldError))
          }
        }
      }
    }
  }
}

export default {
  manifestNotFoundError,
  manifestInvalidError,
  handleHtmlErrors,
  handleIconsErrors,
  handleJsonErrors,
  handleScriptsErrors
}
