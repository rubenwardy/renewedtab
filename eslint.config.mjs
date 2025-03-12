import { fixupConfigRules } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [...fixupConfigRules(compat.extends(
	"plugin:react/recommended",
	"plugin:@typescript-eslint/recommended",
	"plugin:react-hooks/recommended",
)), {
	languageOptions: {
		parser: tsParser,
	},

	settings: {
		react: {
			version: "detect",
		},
	},

	rules: {
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-namespace": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-require-imports": "off",
		"react/prop-types": "off",


		"@typescript-eslint/no-unused-vars": [
			"warn", // or "error"
			{
				"argsIgnorePattern": "^_",
				"varsIgnorePattern": "^_",
				"caughtErrorsIgnorePattern": "^_"
			}
		]
	},
}];
