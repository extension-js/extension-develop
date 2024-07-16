import path from 'path';

function serverRestartRequired() {
  const errorMessage = `[manifest.json] Entry Point Modification Found.

Changing the path of non-static assets defined in manifest.json requires a server restart. To apply these changes, restart the program.`;
  return errorMessage;
}

function manifestFieldError(feature: string, htmlFilePath: string) {
  const hintMessage =
    `Check the "${feature.replace('/', '.')}" ` +
    `field in your manifest.json file.`;

  const errorMessage = `[manifest.json] File path "${path.relative(process.cwd(), htmlFilePath)}" not found. ${hintMessage}`;
  return errorMessage;
}

function manifestNotFoundError() {
  const hintMessage = `Ensure you have a manifest.json file at the root direcotry of your project.`;
  const errorMessage = `A manifest file is required. ${hintMessage}`;

  return errorMessage;
}

function manifestInvalidError(error: any) {
  const hintMessage = `Update your manifest file and run the program again.`;
  const errorMessage = `${error}. ${hintMessage}`;

  return errorMessage;
}

export default {
  serverRestartRequired,
  manifestFieldError,
  manifestNotFoundError,
  manifestInvalidError,
};
