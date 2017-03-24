var env = process.env.NODE_ENV;

var webpack = require('webpack');
var merge = require('webpack-merge');
var path = require('path');

var tsconfig = require('../tsconfig.json');
var resolveModules = tsconfig['compilerOptions']['paths']['*'].slice(1);
for (var i = 0; i < resolveModules.length; i++) {
  resolveModules[i] = resolveModules[i].replace(/\*/g, '');
}
resolveModules.unshift('.');
resolveModules.push('node_modules');

var base = {
  context: path.join(__dirname, '..'),
  entry: './ts/src/index.ts',
  output: {
    filename: 'js/bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: resolveModules
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
  }
};

var development = {
  devtool: 'source-map'
};

var production = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};

module.exports = {
  development: merge(base, development),
  production: merge(base, production)
}[env];
