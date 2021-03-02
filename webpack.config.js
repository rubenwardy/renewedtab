const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dest = path.resolve(__dirname, "dist");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  	mode: isProd ? 'production' : 'development',
	entry: "./src/index",
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: "src/public", to: dest },
			]
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].[contenthash].css',
			chunkFilename: '[id].[contenthash].css',
		}),
		new HtmlWebpackPlugin({
			title: "Homescreen",
			template: "src/templates/index.ejs",
		}),
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: "ts-loader",
						options: {
							configFile: "tsconfig.json",
						}
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				],
			},
		]
	},
	resolve: {
		extensions: [ ".ts", ".tsx", ".js" ],
		modules: [
			path.resolve(__dirname, "src"),
			"node_modules"
		]

	},
	output: {
		filename: "[name].[contenthash].js",
		path: dest
	},
};
