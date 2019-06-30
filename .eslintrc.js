module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },

  extends: 'eslint:recommended',

  parserOptions: {
    ecmaVersion: 2018
  },

  overrides: [
    {
      files: ['*.test.js'],
      env: {
        jest: true
      }
    }
  ],

  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never']
  }
}
