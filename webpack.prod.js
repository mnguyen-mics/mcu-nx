const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'production',

  node: {
    fs: 'empty',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: paths.reactAppSrc,
        use: ['babel-loader', 'ts-loader'],
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: './app/*.html', to: './[name].[ext]' },
      { from: './app/*.txt', to: './[name].[ext]' },
      { from: './app/*.json', to: './[name].[ext]' },
      {
        from: 'app/src/assets',
        to: 'src/assets',
      },
    ]),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      filename: './index.html',
      excludeAssets: [/(plateforme|app|console|converged-ww2).*\/style.*.(css|js)/],
    }),
    new HtmlWebpackExcludeAssetsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
