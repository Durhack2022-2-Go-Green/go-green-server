module.exports = {
	'env': {
		'node': true,
		'es2021': true,
		'browser': true,
		'jest': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 13,
		'sourceType': 'module'
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'eol-last': 'error',
		'no-var' : 'error',
		'no-unused-vars': [
			'error', {
				'args': 'all', 
				'argsIgnorePattern': '(req|res|next)',
			}
		]
	}
};
