module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "plugins": [
    "unicorn"
  ],
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-useless-escape": "off",
    "no-cond-assign": "off",
    "no-unused-vars": "off",
    "no-console": [
      "warn",
      {
        "allow": ["debug", "error"]
      }
    ],

    'unicorn/custom-error-definition': 'error',
    'unicorn/no-new-buffer': 'error',
    'unicorn/prefer-type-error': 'error'
  }
};
