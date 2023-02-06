/* eslint-env node */
module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "plugins": [
    "unicorn"
  ],
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
  },
  "rules": {
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1
      }
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
    "no-console": "off",
    // "no-console": [
    //   "warn",
    //   {
    //     "allow": ["debug", "error"]
    //   }
    // ],

    'unicorn/custom-error-definition': 'error',
    'unicorn/no-new-buffer': 'error',
    'unicorn/prefer-type-error': 'error'
  }
};
