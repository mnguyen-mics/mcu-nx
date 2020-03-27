const path = require('path');
var glob = require("glob");

module.exports = {
	mode: 'production',
  entry: 	glob.sync('./src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'lib'),
		filename: 'index.js',
		libraryTarget: 'umd',
		library: 'McsReactComponents',
  },
  module: {
    rules: [
			{
				test: /\.(ts|tsx)?$/,
				include: path.resolve('src'),
				loaders: ['babel-loader', 'ts-loader'],
				exclude: /node_modules/,
			},
    ],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js'],
	},
	performance: { hints: false },
};
