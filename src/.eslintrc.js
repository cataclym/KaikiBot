module.exports = {

	parser: "@typescript-eslint/parser",
	// Specifies the ESLint parser

	parserOptions: {

		ecmaVersion: 2020,
		// Allows for the parsing of modern ECMAScript features

		sourceType: "module",
		// Allows for the use of imports

	},

	extends: [

		"plugin:@typescript-eslint/recommended",
		// Uses the recommended rules from the @typescript-eslint/eslint-plugin

	],

	rules: {

		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs

		// e.g. "@typescript-eslint/explicit-function-return-type": "off",


		"brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
		"comma-dangle": ["error", "always-multiline"],
		"comma-spacing": "error",
		"comma-style": "error",
		"curly": ["error", "multi-line", "consistent"],
		"dot-location": ["error", "property"],
		"handle-callback-err": "off",
		"indent": ["error", "tab", { "SwitchCase": 1 }],
		"max-nested-callbacks": ["error", { "max": 4 }],
		"max-statements-per-line": ["error", { "max": 2 }],
		"no-console": "off",
		"no-empty-function": "error",
		"no-floating-decimal": "error",
		"no-inline-comments": "error",
		"no-lonely-if": "error",
		"no-multi-spaces": "error",
		"no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
		"no-shadow": ["error", { "allow": ["err", "resolve", "reject"] }],
		"no-trailing-spaces": ["error"],
		"no-var": "error",
		"object-curly-spacing": ["error", "always"],
		"prefer-const": "error",
		"quotes": ["error", "double"],
		"semi": ["error", "always"],
		"space-before-blocks": "error",
		"space-before-function-paren": ["error", {
			"anonymous": "never",
			"named": "never",
			"asyncArrow": "always",
		}],
		"space-in-parens": "error",
		"space-infix-ops": "error",
		"space-unary-ops": "error",
		"spaced-comment": "error",
		"yoda": "error",
		"keyword-spacing": ["error", { "before": true }],
	},
};