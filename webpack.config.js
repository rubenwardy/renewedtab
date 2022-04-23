const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const {GitRevisionPlugin} = require("git-revision-webpack-plugin");
const gitRevisionPlugin = new GitRevisionPlugin({
	lightweightTags: true,
});

const isProd = process.env.NODE_ENV === "production";
const dest = path.resolve(__dirname, "dist/webext/app");

const target = process.env.TARGET ?? "firefox";
if (target !== "firefox" && target !== "chrome") {
	throw new Error(`Unknown target: ${target}`);
}

const configFile = path.resolve(__dirname, "config.json");
function getConfig() {
	const config = JSON.parse(fs.readFileSync(configFile).toString());
	config.SENTRY_DSN = process.env.SENTRY_DSN ?? config.SENTRY_DSN;

	return {
		API_URL: JSON.stringify(config.API_URL),
		PROXY_URL: JSON.stringify(config.PROXY_URL),
		SENTRY_DSN: JSON.stringify(config.SENTRY_DSN),
	};
}

const mode = isProd ? "production" : "development";

console.log(`Webpack is building in ${mode} for ${target}`);

module.exports = {
	mode: mode,
	entry: "./src/app/index",
	devtool: "source-map",
	plugins: [
		new webpack.DefinePlugin({
			app_version: {
				version: JSON.stringify(gitRevisionPlugin.version()),
				is_debug: !isProd,
				commit: JSON.stringify(gitRevisionPlugin.commithash()),
				environment: JSON.stringify(gitRevisionPlugin.version().includes("-") ? "development" : "production"),
				target: JSON.stringify(target),
			},
			config: getConfig(),
		}),
		new CopyPlugin({
			patterns: [
				{ from: "src/webext/", to: path.resolve(__dirname, "dist/webext/"), globOptions: { ignore: ["**/webext/manifest.*"] }  },
				{ from: "src/app/public/", to: dest },
				{ from: "node_modules/webextension-polyfill/dist/browser-polyfill.min.js", to: dest },
				{ from: `src/webext/manifest.${target}.json`, to: path.resolve(__dirname, "dist/webext/manifest.json") },
			]
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "[name].css",
			chunkFilename: "[id].css",
		}),
		new HtmlWebpackPlugin({
			filename: "index.html",
			title: "Renewed Tab Web",
			template: "src/app/templates/index.ejs",
			hash: true,
			templateParameters: {
				"webext": false,
			},
		}),
		new HtmlWebpackPlugin({
			filename: "webext.html",
			title: "New Tab",
			template: "src/app/templates/index.ejs",
			hash: false,
			chunksSortMode: "manual",
			scriptLoading: "blocking",
			templateParameters: {
				"webext": true,
			},
		}),
		new ForkTsCheckerPlugin({
			typescript: {
				configFile: path.resolve(__dirname, "tsconfig.app.json"),
			},
		}),
	],
	module: {
		rules: [
			{
				test: /\.[t|j]sx?$/,
				loader: "babel-loader",
				options: {
					babelrc: false,
					cacheDirectory: true,
					presets: [
						[
							"@babel/preset-typescript",
							{
								isTSX: true,
								allExtensions: true,
							},
						],
						[
							"@babel/preset-env",
							{
								targets: { browsers: ["Chrome 78", "Firefox 70"] },
							},
						],
					],
					plugins: [
						"@babel/transform-react-jsx",
						[
							"formatjs",
							{
								"idInterpolationPattern": "[sha512:contenthash:base64:6]",
								"ast": true
							}
						],
					],
				},
			},
			{
				test: /\.s?[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				],
				sideEffects: true,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		modules: [
			path.resolve(__dirname, "src"),
			"node_modules"
		],
	},
	output: {
		filename: "[name].js",
		path: dest,
		clean: true,
	},
};
