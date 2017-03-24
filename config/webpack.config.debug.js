var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, '..'),
  entry: './ts/src/index.ts',
  output: {
    filename: 'js/bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['.', 'ts/src/', 'node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            'target': 'es5',
            'lib': ['ES2015', 'DOM']
          }
        }
      }
    ]
  },
  devtool: 'source-map'
}
