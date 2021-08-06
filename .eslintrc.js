module.exports = {
	parser: "@typescript-eslint/parser", // Specifies the ESLint parser

	settings: {
		react: {
			version: "detect",
		}
	},

	extends: [
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
	],

	rules: {
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-namespace": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-var-requires": "off",
		"react/prop-types": "off",
		"react/display-name": "off",
	},

};
