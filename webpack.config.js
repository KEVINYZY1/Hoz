const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/core/index.js',
  // entry: './demo/index.js',
  output: {
    filename: 'hoz.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'eslint-loader'
        ]
      }
    ]
  },
  devtool: 'inline-source-map',
  plugins: [
    new UglifyJSPlugin()
  ]
}
