const path = require('path');
const glob = require("glob");

const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: 	glob.sync('./src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'lib'),
		filename: 'index.js',
		libraryTarget: 'umd',
		library: 'McsAdvancedComponents',
  },
  module: {
    rules: [
			{
        test: /\.ts|\.tsx$/,
				include: path.resolve('src'),
				loaders: ['babel-loader', 'ts-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            query: {
              name: `${true ? '/assets/images/' : ''}[name].[ext]`,
            },
          },
          {
            loader: 'image-webpack-loader',
            query: {
              bypassOnDebug: true,
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
    ],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js'],
	},
  performance: { hints: false },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/styles', to: './style' },
        { from: './components/**/*.less', to: '[path][name].[ext]', context: 'src' },
        {
          from: './assets/**/*.png',
          to: '[path][name].[ext]',
          context: 'src'
        },
      ],
    }),
  ],
};
