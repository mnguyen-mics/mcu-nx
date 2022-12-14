const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const path = require('path');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 9000,
    contentBase: paths.appPath,
    liveReload: false,
  },
  output: {
    filename: '[name].[contenthash].js',
    path: paths.appPath,
    publicPath: paths.publicPath,
  },

  node: {
    fs: 'empty',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: paths.reactAppSrc,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },

  resolve: {
    alias: {
      antd: path.resolve('./node_modules/antd'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      '@ant-design/icons': path.resolve('./node_modules/@ant-design/icons'),
      'react-router-dom': path.resolve('./node_modules/react-router-dom'),
      'react-intl': path.resolve('./node_modules/react-intl'),
    },
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('dev'),
      'process.env.API_ENV': JSON.stringify(process.env.API_ENV),
    }),
    new CopyWebpackPlugin([
      {
        from: 'app/conf/react-configuration.js',
        to: 'conf/react-configuration.js',
        transform(content) {
          return content
            .toString()
            .replace(
              /API_URL\ *:\ *'.*'/,
              process.env.API_ENV === 'prod'
                ? "API_URL : 'https://api.mediarithmics.com'"
                : "API_URL : 'https://api.mediarithmics.local'",
            );
        },
      },
    ]),
  ],
});
