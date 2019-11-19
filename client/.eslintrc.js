module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['react'],
  parser: 'babel-eslint',
  ecmaFeatures: { jsx: true },
  extends: ['airbnb', 'prettier'],
  rules: {
    'no-underscore-dangle': 0,
    'max-len': [1, 180, 2, { ignoreComments: true }],
    'no-console': 0,
    'no-unused-vars': [1, { vars: 'local', args: 'none' }],
    'arrow-body-style': [2, 'as-needed'],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/forbid-prop-types': 0,
    'react/jsx-no-bind': [
      'error',
      {
        allowArrowFunctions: true,
        allowBind: false,
        ignoreRefs: true,
      },
    ],
    'react/no-did-update-set-state': 'error',
    'react/no-unknown-property': 'error',
    'react/no-unused-prop-types': 'error',
    'react/prop-types': 'error',
    'react/react-in-jsx-scope': 'error',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-boolean-value': 'off',
  },
  globals: {
    React: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};
