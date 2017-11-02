'use strict';

/**
 * Development config
 * @param  {String} _path Absolute path to application
 * @return {Object}       Object of development settings
 */
module.exports = function(_path) {
  return {
    context: _path,
    devtool: 'eval',
    devServer: {
      historyApiFallback: {
        disableDotRule: true
      },
      contentBase: './'
    },
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.js$/,
          enforce: 'pre',
          use: 'eslint-loader'
        },
      ]
    }
  };
}
