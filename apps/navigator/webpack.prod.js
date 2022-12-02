const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const nrwlConfig = require('@nrwl/react/plugins/webpack.js');
const VersionPlugin = require('apps/navigator/VersionPlugin');
const path = require('path');
const paths = require('apps/navigator/paths');

module.exports = (config, context) => {
  nrwlConfig(config);
  return merge(config, common, {
    module: {
      plugins: [new VersionPlugin({ path: path.resolve(paths.appPath) })],
    },
  });
};
