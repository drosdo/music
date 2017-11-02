const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const TextPlugin = require('extract-text-webpack-plugin');

const nib = require('nib');
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function(_path) {
  const appPath = path.join(_path, 'src');
  console.log('dev config');
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
          exclude: /node_modules/,
          test: /\.js$/,
          enforce: 'pre',
          use: 'eslint-loader'
        },
        {
          exclude: /node_modules/,
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
        },
        {
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
        },
        {
          test: /\.(ttf|eot|woff|woff2|png|ico|jpg|jpeg|gif|svg)$/i,
          use: [
            'file-loader?context=' +
              appPath +
              '&name=assets/static/[ext]/[name].[hash].[ext]'
          ]
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.css', '.styl', '.jpg'],
      alias: {
        _fonts: path.join(appPath, 'style', 'fonts'),
        _styles: path.join(appPath, 'style')
      }
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
      new webpack.DefinePlugin({
        'process.env': {
          IS_BROWSER: JSON.stringify('true') // default value if not specified
        }
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
