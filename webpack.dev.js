const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-maps',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  externals: ['antd', 'react', 'react-dom'],
});