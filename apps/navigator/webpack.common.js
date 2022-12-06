const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            parseMap: true,
          },
        },
      },
    ],
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
