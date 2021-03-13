const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const dest = path.resolve(__dirname, "dist/webext/app");

module.exports = {
	mode: isProd ? 'production' : 'development',
	entry: "./src/app/index",
	devtool: isProd ? undefined : "source-map",
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: "src/app/public/", to: dest },
			]
		}),
		new CopyPlugin({
			patterns: [
				{ from: "src/webext/manifest.json", to: path.resolve(__dirname, "dist/webext") },
			]
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new HtmlWebpackPlugin({
			title: "New Tab",
			template: "src/app/templates/index.ejs",
			hash: true
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
							configFile: "tsconfig.app.json",
						}
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.s?[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				],
			},
			{
				test: /\.(svg|eot|woff|woff2|ttf)$/,
				type: 'asset/resource',
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
		filename: "[name].js",
		path: dest
	},
};
