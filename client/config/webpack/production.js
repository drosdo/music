'use strict';

const webpack = require('webpack');
const configCommon = require('./common');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(_path) {
  let config = configCommon(_path);
  let rules = config.module.rules;
  let plugins = config.plugins;

  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      exclude: /\.html/i,
      minimize: true,
      sourceMap: true,
      compress: {
        warnings: false
      }
    })
  );

  rules.push({
    test: /\.styl$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            localIdentName: '[local]__[hash:base64:5]'
          }
        },
        'postcss-loader',
        'stylus-loader'
      ]
    })
  });

  rules.push({
    test: /\.css/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            localIdentName: '[local]__[hash:base64:5]'
          }
        },
        'postcss-loader'
      ]
    })
  });

  return {
    context: _path,
    devtool: 'cheap-source-map',
    module: {rules},
    plugins: {plugins}
  };
};
