const path = require('path')
const ScriptsPlugin = require('../../../dist/module').default

const manifestPath = path.join(__dirname, 'manifest.json')
const outputPath = path.resolve(__dirname, './dist')

module.exports = {
  mode: 'development',
  entry: {},
  output: {
    path: outputPath
    // clean: true
  },
  plugins: [
    new ScriptsPlugin({
      manifestPath
    })
  ]
}
