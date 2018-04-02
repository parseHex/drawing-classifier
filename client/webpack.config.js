const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: {
		index: './src/index.ts',
		train: './src/train/index.ts',
		'nn.worker': './src/train/worker/index.ts',
	},

	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'build'),
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
			},
		],
	},

	devtool: 'source-map',
	mode: 'development',
	watch: true,

	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},

	// plugins: [new UglifyJSPlugin()],
};
