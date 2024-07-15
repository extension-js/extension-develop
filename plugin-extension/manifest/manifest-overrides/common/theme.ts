import path from 'path';
import { type Manifest } from '../../../types';
import getFilename from '../../../manifest/getFilename';

const getBasename = (filepath: string) => path.basename(filepath);

export default function theme(
  compiledEntries: Record<string, any>,
  publicFolder: string,
) {
  return (
    manifest.theme && {
      theme: {
        ...manifest.theme,
        ...(manifest.theme.images && {
          images: {
            ...manifest.theme.images,
            theme_frame: getFilename(
              `theme/images/${getBasename(
                manifest.theme.images.theme_frame as string,
              )}`,
              manifest.theme.images.theme_frame as string,
              exclude,
            ),
          },
        }),
      },
    }
  );
}
