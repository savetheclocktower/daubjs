"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _daub = require("../daub");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  balance,
  compact,
  wrap,
  VerboseRegExp
} = _daub.Utils; // TODO:
// * Generators

let ESCAPES = new _daub.Grammar({
  escape: {
    pattern: /\\./
  }
});
let REGEX_INTERNALS = new _daub.Grammar({
  escape: {
    pattern: /\\./
  },
  'exclude from group begin': {
    pattern: /(\\\()/,
    replacement: "#{1}"
  },
  'group-begin': {
    pattern: /(\()/,
    replacement: '<b class="group">#{1}'
  },
  'group-end': {
    pattern: /(\))/,
    replacement: '#{1}</b>'
  }
});

function handleParams(text, context) {
  return PARAMETERS.parse(text, context);
}

let INSIDE_TEMPLATE_STRINGS = new _daub.Grammar({
  'interpolation': {
    pattern: /(\$\{)(.*?)(\})/,
    replacement: "<span class='#{name}'><span class='punctuation'>#{1}</span><span class='interpolation-contents'>#{2}</span><span class='punctuation'>#{3}</span></span>",
    before: (r, context) => {
      r[2] = MAIN.parse(r[2], context);
    }
  }
}).extend(ESCAPES);
const PARAMETERS = new _daub.Grammar({
  'parameter parameter-with-default': {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,
    replacement: compact("\n      <span class=\"parameter\">\n        <span class=\"variable\">#{1}</span>\n        <span class=\"operator\">#{2}</span>\n      #{3}\n      </span>\n    "),
    before: (r, context) => {
      r[3] = VALUES.parse(r[3], context);
    }
  },
  'keyword operator': {
    pattern: /\.{3}/
  },
  'variable parameter': {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  }
});
let STRINGS = new _daub.Grammar({
  'string string-template embedded': {
    pattern: /(`)([^`]*)(`)/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      r[2] = INSIDE_TEMPLATE_STRINGS.parse(r[2], context);
    }
  },
  'string string-single-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-apostrophes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-non-apostrophe pair.
    pattern: /(')((?:[^'\\]|\\\\|\\[^'])*)(')/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      r[2] = ESCAPES.parse(r[2], context);
    }
  },
  'string string-double-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-quotes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-non-quote pair.
    pattern: /(")((?:[^"\\]|\\\\|\\[^"])*)(")/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      r[2] = ESCAPES.parse(r[2], context);
    }
  }
});
let VALUES = new _daub.Grammar(_objectSpread({
  constant: {
    pattern: /\b(?:arguments|this|false|true|super|null|undefined)\b/
  },
  'number number-binary-or-octal': {
    pattern: /0[bo]\d+/
  },
  number: {
    pattern: /(?:\d*\.?\d+)/
  }
}, STRINGS.toObject(), {
  comment: {
    pattern: /(\/\/[^\n]*\n)|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
  },
  regexp: {
    // No such thing as an empty regex, so we can get away with requiring at
    // least one not-backslash character before the end delimiter.
    pattern: /(\/)(.*?[^\\])(\/)([mgiy]*)/,
    replacement: "<span class='regexp'>#{1}#{2}#{3}#{4}</span>",
    before: (r, context) => {
      r[2] = REGEX_INTERNALS.parse(r[2], context);
      if (r[4]) r[4] = wrap(r[4], 'keyword regexp-flags');
    }
  }
}));
let DESTRUCTURING = new _daub.Grammar({
  alias: {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,
    replacement: "<span class='entity'>#{1}</span>#{2}#{3}#{4}"
  },
  variable: {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  }
});
let MAIN = new _daub.Grammar('javascript', {}, {
  alias: ['js']
});
MAIN.extend(VALUES);
MAIN.extend({
  'meta: digits in the middle of identifiers': {
    pattern: /\$\d/,
    replacement: "#{0}"
  },
  // So that properties with keyword names don't get treated like keywords.
  'meta: properties with keyword names': {
    pattern: /(\.)(for|if|while|switch|catch|return)\b/,
    replacement: "#{0}"
  },
  // So that keywords that are followed by `(` don't get treated like
  // functions.
  'meta: functions with keyword names': {
    pattern: /(\s*)\b(for|if|while|switch|catch)\b/,
    replacement: "#{1}<span class='keyword'>#{2}</span>"
  },
  'meta: fat arrow function, one arg, no parens': {
    pattern: /([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*)(=(?:&gt;|>))/,
    replacement: "#{1}#{2}#{3}",
    before: (r, context) => {
      r[1] = handleParams(r[1], context);
    }
  },
  'meta: fat arrow function, args in parens': {
    pattern: /(\()([^\)]*?)(\))(\s*)(=(?:&gt;|>))/,
    replacement: "#{1}#{2}#{3}#{4}#{5}",
    before: (r, context) => {
      r[2] = handleParams(r[2], context);
    }
  },
  'keyword keyword-new': {
    pattern: /new(?=\s[A-Za-z_$])/
  },
  'variable variable-declaration': {
    pattern: /\b(var|let|const)(\s+)([A-Za-z_$][_$A-Z0-9a-z]*?)(?=\s|=|;|,)/,
    replacement: "<span class='storage'>#{1}</span>#{2}<span class='#{name}'>#{3}</span>"
  },
  'variable variable-assignment': {
    pattern: /(\s+|,)([A-Za-z_$][\w\d$]*?)(\s*)(?==)/,
    replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}"
  },
  'meta: destructuring assignment': {
    pattern: /(let|var|const)(\s+)(\{|\[)([\s\S]*)(\}|\])(\s*)(?==)/,
    index: matchText => {
      let pairs = {
        '{': '}',
        '[': ']'
      };
      let match = /(let|var|const|)(\s+)(\{|\[)/.exec(matchText);
      let char = match[3],
          paired = pairs[char];
      return balance(matchText, char, paired, {
        startIndex: matchText.indexOf(char) + 1
      });
    },
    replacement: "<span class='storage'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
    before: (r, context) => {
      r[4] = DESTRUCTURING.parse(r[4], context);
    }
  },
  'function function-expression': {
    pattern: /\b(function)(\s*)([a-zA-Z_$]\w*)?(\s*)(\()(.*?)(\))/,
    replacement: "<span class='keyword keyword-function'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
    before: function before(r, context) {
      if (r[3]) r[3] = "<span class='entity'>".concat(r[3], "</span>");
      r[6] = handleParams(r[6], context);
      return r;
    }
  },
  'function function-literal-shorthand-style': {
    pattern: /(^\s*)(get|set|static)?(\s*)([a-zA-Z_$][a-zA-Z0-9$_]*)(\s*)(\()(.*?)(\))(\s*)(\{)/,
    replacement: "#{1}#{2}#{3}<span class='entity'>#{4}</span>#{5}#{6}#{7}#{8}#{9}#{10}",
    before: (r, context) => {
      if (r[2]) r[2] = "<span class='storage'>".concat(r[1], "</span>");
      r[7] = handleParams(r[7], context);
    }
  },
  'function function-assigned-to-variable': {
    pattern: /\b([a-zA-Z_?\.$]+\w*)(\s*)(=)(\s*)(function)(\s*)(\()(.*?)(\))/,
    replacement: "<span class='variable'>#{1}</span>#{2}#{3}#{4} <span class='keyword'>#{5}</span>#{6}#{7}#{8}#{9}",
    before: (r, context) => {
      r[8] = handleParams(r[8], context);
    }
  },
  'meta: property then function': {
    pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(:)(\s*)(?=function)/,
    replacement: "<span class='entity'>#{1}</span>#{2}#{3}"
  },
  'entity': {
    pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(?=:)/
  },
  'meta: class definition': {
    pattern: /(class)(?:(\s+)([A-Z][A-Za-z0-9_]*))?(?:(\s+)(extends)(\s+)([A-Z][A-Za-z0-9_$\.]*))?(\s*)({)/,
    index: match => {
      return balance(match, '}', '{', {
        startIndex: match.indexOf('{') + 1
      }); // return findBalancedToken('}', '{', match, match.indexOf('{') + 1);
    },
    replacement: compact("\n      <span class=\"storage\">#{1}</span>\n      #{2}#{3}\n      #{4}#{5}#{6}#{7}\n      #{8}#{9}\n    "),
    before: r => {
      if (r[3]) r[3] = wrap(r[3], 'entity entity-class');
      if (r[5]) r[5] = wrap(r[5], 'storage');
      if (r[7]) r[7] = wrap(r[7], 'entity entity-class entity-superclass');
    }
  },
  storage: {
    pattern: /\b(?:var|let|const|class|extends|async)\b/
  },
  keyword: {
    pattern: /\b(?:try|catch|finally|if|else|do|while|for|break|continue|case|switch|default|return|yield|throw|await)\b/
  },
  'keyword operator': {
    pattern: /!==?|={1,3}|>=?|<=?|\+\+|\+|--|-|\*|[\*\+-\/]=|\?|\.{3}|\b(?:instanceof|in|of)\b/
  }
});
var _default = MAIN;
exports.default = _default;