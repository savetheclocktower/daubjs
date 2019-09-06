"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _daub = require("../daub");

var _lexer = _interopRequireDefault(require("../lexer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  balanceByLexer,
  compact,
  VerboseRegExp
} = _daub.Utils;
const LEXER_STRING = new _lexer.default([{
  name: 'string-escape',
  pattern: /\\./
}, {
  name: 'string-end',
  pattern: /('|")/,
  test: (pattern, text, context) => {
    let char = context.get('string-begin');
    let match = pattern.exec(text);

    if (!match) {
      return false;
    }

    if (match[1] !== char) {
      return false;
    }

    context.set('string-begin', null);
    return match;
  },
  final: true
}]);
const LEXER_ATTRIBUTE_VALUE = new _lexer.default([{
  name: 'string-begin',
  pattern: /^\s*('|")/,
  test: (pattern, text, context) => {
    let match = pattern.exec(text);

    if (!match) {
      return false;
    }

    context.set('string-begin', match[1]);
    return match;
  },
  inside: {
    name: 'string',
    lexer: LEXER_STRING
  }
}]);
const LEXER_ATTRIBUTE_SEPARATOR = new _lexer.default([{
  name: "punctuation",
  pattern: /^=/,
  after: {
    name: 'attribute-value',
    lexer: LEXER_ATTRIBUTE_VALUE
  }
}]);
const LEXER_TAG = new _lexer.default([{
  name: 'tag tag-html',
  pattern: /^[a-z]+(?=\s)/
}, {
  name: 'attribute-name',
  pattern: /^\s*(?:\/)?[a-z]+(?=\=)/,
  after: {
    name: 'attribute-separator',
    lexer: LEXER_ATTRIBUTE_SEPARATOR
  }
}, {
  // Self-closing tag.
  name: 'punctuation',
  pattern: /\/(?:>|&gt;)/,
  final: true
}, {
  // Opening tag end with middle-of-tag context.
  name: 'punctuation',
  pattern: /(>|&gt;)/,
  final: true
}]);
const LEXER_TAG_START = new _lexer.default([{
  name: 'punctuation',
  pattern: /^(?:<|&lt;)/,
  after: {
    name: 'tag',
    lexer: LEXER_TAG
  }
}]);
const ATTRIBUTES = new _daub.Grammar({
  string: {
    pattern: /('[^']*[^\\]'|"[^"]*[^\\]")/
  },
  attribute: {
    pattern: /\b([a-zA-Z-:]+)(=)/,
    replacement: compact("\n      <span class='attribute'>\n        <span class='#{name}'>#{1}</span>\n        <span class='punctuation'>#{2}</span>\n      </span>\n    ")
  }
});
const MAIN = new _daub.Grammar('html', {
  doctype: {
    pattern: /&lt;!DOCTYPE([^&]|&[^g]|&g[^t])*&gt;/
  },
  'embedded embedded-javascript': {
    pattern: /(&lt;|<)(script|SCRIPT)(\s+.*?)?(&gt;|>)([\s\S]*?)((?:&lt;|<)\/)(script|SCRIPT)(&gt;|>)/,
    replacement: compact("\n      <span class='element element-opening'>\n        <span class='punctuation'>#{1}</span>\n        <span class='tag'>#{2}</span>#{3}\n        <span class='punctuation'>#{4}</span>\n      </span>\n        #{5}\n      <span class='element element-closing'>\n        <span class='punctuation'>#{6}</span>\n        <span class='tag'>#{7}</span>\n        <span class='punctuation'>#{8}</span>\n      </span>\n    "),
    before: (r, context) => {
      if (r[3]) {
        r[3] = ATTRIBUTES.parse(r[3], context);
      }

      r[5] = context.highlighter.parse(r[5], 'javascript', context);
    }
  },
  'tag tag-open': {
    pattern: /((?:<|&lt;))([a-zA-Z0-9:]+\s*)([\s\S]*)(\/)?(&gt;|>)/,
    index: function index(match) {
      return balanceByLexer(match, LEXER_TAG_START);
    },
    replacement: compact("\n      <span class='element element-opening'>\n        <span class='punctuation'>#{1}</span>\n        <span class='tag'>#{2}</span>#{3}\n        <span class='punctuation'>#{4}#{5}</span>\n      </span>#{6}\n    "),
    before: (r, context) => {
      r[3] = ATTRIBUTES.parse(r[3], context);
    }
  },
  'tag tag-close': {
    pattern: /(&lt;\/)([a-zA-Z0-9:]+)(&gt;)/,
    replacement: compact("\n      <span class='element element-closing'>\n        <span class='punctuation'>#{1}</span>\n        <span class='tag'>#{2}</span>\n        <span class='punctuation'>#{3}</span>\n      </span>\n    ")
  },
  comment: {
    pattern: /&lt;!\s*(--([^-]|[\r\n]|-[^-])*--\s*)&gt;/
  }
}, {
  encode: true
});
var _default = MAIN;
exports.default = _default;