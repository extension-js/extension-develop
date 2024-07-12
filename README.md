# extension-develop

> The very fast `dev` step of Extension.js

## Get Started

Start the dev server:

```bash
# -u, --user-data-dir – what path to use for the browser profile.
# -b, --browser – specify a browser to run your extension in development mode
# --polyfill – whether or not to apply the cross-browser polyfill. Defaults to `true`
# -p, --port – what port should Extension.js run. Defaults to `3000`
npm run dev
```

Build the app for production:

```bash
# -b, --browser <chrome | edge | firefox> – specify a browser to run your extension in development mode
# --polyfill [boolean] – whether or not to apply the cross-browser polyfill. Defaults to `false`
# --zip [boolean] – whether or not to compress the extension into a ZIP file. Defaults to `false`
# --zip-source [boolean] – whether or not to include the source files in the ZIP file. Defaults to `false`
# --zip-filename <string> – specify the name of the ZIP file. Defaults to the extension name and version
npm run build
```

Preview the production build locally:

```bash
# -b, --browser – specify a browser to preview your extension in production mode
npm run preview
```

Build and Preview the production build locally:

```bash
# -u, --user-data-dir – what path to use for the browser profile.
# -b, --browser – specify a browser to run your extension in development mode
# --polyfill – whether or not to apply the cross-browser polyfill. Defaults to `true`
# -p, --port – what port should Extension.js run. Defaults to `3000`
npm run start
```

## License

MIT (c) Cezar Augusto.
