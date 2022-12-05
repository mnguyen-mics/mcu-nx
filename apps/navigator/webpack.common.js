const webpack = require('webpack');

module.exports = {
  module: {
    parser: {
      javascript: {
        reexportExportsPresence: false,
        importExportsPresence: false
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_ENV': JSON.stringify(process.env.API_ENV),
    }),
  ],
};
