'use strict';

const configCommon = require('./common');

module.exports = function(_path) {
  let config = configCommon(_path);
  let rules = config.module.rules;

  rules.push({
    exclude: /node_modules/,
    test: /\.js$/,
    enforce: 'pre',
    use: 'eslint-loader'
  });

  rules.push({
    test: /\.styl$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 2,
          localIdentName: '[local]__[hash:base64:5]-[emoji:1]'
        }
      },
      'postcss-loader',
      'stylus-loader'
    ]
  });
  rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 1,
          sourceMap: true,
          localIdentName: '[local]___[hash:base64:5]'
        }
      },
      'resolve-url-loader',
      'postcss-loader'
    ]
  });

  return {
    context: _path,
    devtool: 'source-map',
    devServer: {
      historyApiFallback: {
        disableDotRule: true
      },
      contentBase: './'
    },
    module: { rules }
  };
};
