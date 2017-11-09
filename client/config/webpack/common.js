const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const TextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

const nib = require('nib');
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function(_path) {
  const appPath = path.join(_path, 'src');
  const processEnv = process.env.NODE_ENV;

  const aliases = {
    _fonts: path.join(appPath, 'style', 'fonts'),
    _styles: path.join(appPath, 'style')
  };
  return {
    context: _path,
    // devtool: 'source-map',
    entry: ['./src/index.js'],
    output: {
      path: path.join(_path, 'dist'),
      filename: path.join('assets', 'js', '[name].[hash].js'),
      publicPath: '/',
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          exclude: /node_modules(?!\/webpack-dev-server)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['react', 'es2015', 'stage-1']
              }
            }
          ]
        },

        {
          test: /\.(ttf|eot|woff|woff2|png|ico|jpg|jpeg|gif|svg)$/i,
          use: [
            'file-loader?context=' +
              appPath +
              '&name=assets/static/[ext]/[name].[hash].[ext]'
          ]
        },
        { test: /\.html$/, loader: 'html-loader' }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.css', '.styl', '.jpg'],
      alias: aliases
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
        stylus: {
          preferPathResolver: 'webpack',
          use: [nib()]
        }
      }),
      new TextPlugin('assets/css/[name].[chunkhash].css'),
      new HtmlPlugin({
        title: 'Music',
        filename: 'index.html',
        template: path.join(_path, 'index.html')
      }),
      new webpack.DefinePlugin({
        'process.env': {
          IS_BROWSER: JSON.stringify('true'),
          NODE_ENV: JSON.stringify(processEnv), // default value if not specified
        },
        'BROWSER_SUPPORTS_HTML5': true
      }),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        },
        sourceMap: false
      })
      // ,new BundleAnalyzerPlugin()
    ]
  };
};
