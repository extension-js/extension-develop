// ██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗
// ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗
// ██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝
// ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝
// ██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║
// ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝

import path from 'path';
import { red, green, yellow, blue } from '@colors/colors/safe';

type CLIState = 'error' | 'success' | 'warning' | 'info';

export function brand(projectDir: string, cliState: CLIState) {
  const manifestJsonPath = path.join(projectDir, 'manifest.json');
  const manifest = require(manifestJsonPath);

  const stateColor =
    cliState === 'error'
      ? red
      : cliState === 'success'
        ? green
        : cliState === 'warning'
          ? yellow
          : blue;

  return `🧩 ${manifest.name} ${stateColor('►►►')}.`;
}
