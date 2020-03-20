module.exports =  {
    root: true,
    parser:  '@typescript-eslint/parser',
    extends:  [
        'eslint:recommended',
        "plugin:@typescript-eslint/eslint-recommended",
        'plugin:@typescript-eslint/recommended',
    ],
    plugins: [
        'react-hooks'
    ],
    parserOptions:  {
        ecmaVersion:  2020,
        sourceType:  'module',
        ecmaFeatures:  {
            jsx:  true
        },
    },
    rules:  {
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-trailing-spaces': 'error',
        'comma-dangle': ['error', 'always-multiline']
    }
};