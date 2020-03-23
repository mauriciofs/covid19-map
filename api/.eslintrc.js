module.exports =  {
    root: true,
    parser:  '@typescript-eslint/parser',
    extends:  [
        'eslint:recommended',
        "plugin:@typescript-eslint/eslint-recommended",
        'plugin:@typescript-eslint/recommended',
    ],
    rules:  {
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-trailing-spaces': 'error',
        'comma-dangle': ['error', 'always-multiline']
    }
};