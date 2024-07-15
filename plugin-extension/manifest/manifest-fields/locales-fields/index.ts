import path from 'path';
import fs from 'fs';

export default function getLocaleFields(
  manifestPath: string,
): string[] | undefined {
  const localesFolder = path.join(path.dirname(manifestPath), '_locales');

  const localeFiles: string[] = [];

  if (fs.existsSync(localesFolder)) {
    // Iterate over all major locale folders
    for (const locale of fs.readdirSync(localesFolder)) {
      const localeDir = path.join(localesFolder, locale);

      for (const localeEntity of fs.readdirSync(localeDir)) {
        localeFiles.push(path.join('_locales', locale, localeEntity) as string);
      }
    }
  }

  return localeFiles;
}
