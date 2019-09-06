"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _daub = require("../daub");

const {
  balance,
  compact,
  VerboseRegExp
} = _daub.Utils;
let PARAMETERS = new _daub.Grammar({
  'parameter': {
    pattern: /(?:\b|^)((?:(?:[A-Za-z_$][\w\d]*)\s)*)(\s*)([a-zA-Z_$:][\w\d]*)(?=,|$)/,
    replacement: compact("\n      <span class=\"parameter\">\n        <span class=\"storage storage-type\">#{1}</span>\n        #{2}\n        <span class=\"variable\">#{3}</span>\n      </span>\n    "),
    captures: {
      '1': () => STORAGE
    }
  }
});
let ESCAPES = new _daub.Grammar({
  escape: {
    pattern: /\\./
  }
});
const DECLARATIONS = new _daub.Grammar({
  'meta: function': {
    pattern: /([A-Za-z_$]\w*)(\s+)([a-zA-Z_$:]\w*)(\s*)(\()(.*)(\))(\s*)(?={)/,

    index(match) {
      let parenIndex = balance(match, ')', '(', {
        startIndex: match.indexOf('(')
      }); // Find the index just before the opening brace after the parentheses are
      // balanced.

      return match.indexOf('{', parenIndex) - 1;
    },

    replacement: "<b><span class='storage storage-type storage-return-type'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}#{8}</b>",
    captures: {
      '3': 'entity',
      '6': () => PARAMETERS
    }
  },
  'meta: bare declaration': {
    pattern: /\b([A-Za-z_$][\w\d]*)(\s+)([A-Za-z_$][\w\d]*)(\s*)(?=;)/,
    captures: {
      '1': 'storage storage-type',
      '3': 'variable'
    }
  },
  'meta: declaration with assignment': {
    pattern: /\b([A-Za-z_$][\w\d]*)(\s+)([A-Za-z_$][\w\d]*)(\s*)(=)/,
    captures: {
      '1': 'storage storage-type',
      '3': 'variable',
      '5': 'operator'
    }
  },
  'meta: array declaration': {
    pattern: /\b([A-Za-z_$][\w\d]*)(\s+)([A-Za-z_$][\w\d]*)(\[)(\d+)(\])/,
    captures: {
      '1': 'storage storage-type',
      '3': 'variable',
      '4': 'punctuation',
      '5': 'number',
      '6': 'punctuation'
    }
  },
  'meta: declaration with parens': {
    pattern: /\b([A-Za-z_$][\w\d]*)(\s+)([A-Za-z_$][\w\d]*)(\s*)(\()([\s\S]*)(\))(;)/,

    index(match) {
      let balanceIndex = balance(match, ')', '(') + 1;
      let index = match.indexOf(';', balanceIndex);
      return index;
    },

    captures: {
      '1': 'storage storage-type',
      '3': 'variable',
      '5': 'punctuation',
      '6': () => VALUES,
      '7': 'punctuation'
    }
  },
  'meta: class declaration': {
    pattern: /\b(class|enum)(\s+)([A-Za-z][A-Za-z0-9:_$]*)(\s*)({)/,
    captures: {
      '1': 'storage storage-type',
      '3': 'entity entity-class'
    }
  }
});
const VALUES = new _daub.Grammar({
  'constant': {
    pattern: /\b[A-Z_]+\b/
  },
  'lambda': {
    pattern: /(\[\])(\s*)(\()([\s\S]*)(\))(\s*)({)([\s\S]*)(})/,

    index(match) {
      return balance(match, '}', '{', {
        startIndex: match.indexOf('{')
      });
    },

    wrapReplacement: true,
    captures: {
      '1': 'punctuation',
      '3': 'punctuation',
      '4': () => PARAMETERS,
      '5': 'punctuation',
      '7': 'punctuation',
      '8': () => MAIN,
      '9': 'punctuation'
    }
  },
  'constant constant-boolean': {
    pattern: /\b(?:true|false)\b/
  },
  'string string-single-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-apostrophes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-apostrophe pair.
    pattern: /(')((?:[^'\\]|\\\\|\\')*)(')/,
    wrapReplacement: true,
    captures: {
      '2': () => ESCAPES
    }
  },
  'string string-double-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-quotes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-quote pair.
    pattern: /(")((?:[^"\\]|\\\\|\\")*)(")/,
    wrapReplacement: true,
    captures: {
      '2': () => ESCAPES
    }
  },
  'number': {
    pattern: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i
  }
});
const COMMENTS = new _daub.Grammar({
  comment: {
    pattern: /(\/\/[^\n]*(?=\n|$))|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
  }
});
const STORAGE = new _daub.Grammar({
  'storage storage-type': {
    pattern: /\b(?:u?int(?:8|16|36|64)_t|int|long|float|double|char(?:16|32)_t|char|class|bool|wchar_t|volatile|virtual|extern|mutable|const|unsigned|signed|static|struct|template|private|protected|public|mutable|volatile|namespace|struct|void|short|enum)/
  }
});
const MACRO_VALUES = new _daub.Grammar({}).extend(COMMENTS, VALUES);
const MACROS = new _daub.Grammar({
  'macro macro-define': {
    pattern: /^(\#define)(\s+)(\w+)(.*?)$/,
    replacement: compact("\n      <span class=\"keyword keyword-macro\">#{1}</span>#{2}\n      <span class=\"entity entity-macro\">#{3}</span>\n      #{4}\n    "),
    captures: {
      '1': 'keyword keyword-macro',
      '3': 'entity entity-macro',
      '4': () => MACRO_VALUES
    }
  },
  'macro macro-include': {
    pattern: /^(\#include)(\s+)("|<|&lt;)(.*?)("|>|&gt;)(?=\n|$)/,
    replacement: compact("\n      <span class=\"keyword keyword-macro\">#{1}</span>#{2}\n      <span class=\"string string-include\">\n        <span class=\"punctuation\">#{3}</span>\n        #{4}\n        <span class=\"punctuation\">#{5}</span>\n      </span>\n    ")
  },
  'macro macro-with-one-argument': {
    pattern: /(\#(?:ifdef|ifndef|undef|if))(\s+)(\w+)/,
    captures: {
      '1': 'keyword keyword-macro',
      '3': 'entity entity-macro'
    }
  },
  'macro macro-error': {
    pattern: /(#error)(\s*)(")(.*)(")/,
    replacement: compact("\n      <span class=\"keyword keyword-macro\">#{1}</span>\n      #{2}\n      <span class=\"string string-quoted\">#{3}#{4}#{5}</span>\n    ")
  },
  'keyword keyword-macro': {
    pattern: /#(endif|else)/
  }
});
const MAIN = new _daub.Grammar('arduino', {
  'keyword keyword-control': {
    pattern: /\b(?:alignas|alignof|asm|auto|break|case|catch|compl|constexpr|const_cast|continue|decltype|default|delete|do|dynamic_cast|else|explicit|export|for|friend|goto|if|inline|new|noexcept|nullptr|operator|register|reinterpret_cast|return|sizeof|static_assert|static_cast|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|using|while)\b/
  }
}).extend(COMMENTS, DECLARATIONS);
MAIN.extend(MACROS, VALUES, STORAGE, {
  'operator': {
    pattern: /--?|\+\+?|!=?|(?:<|&lt;){1,2}=?|(&gt;|>){1,2}=?|-(?:>|&gt;)|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|\|?|\?|\*|\/|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/
  }
});
var _default = MAIN;
exports.default = _default;