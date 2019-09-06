"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _daub = require("../daub");

var _lexer = _interopRequireDefault(require("../lexer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-useless-escape */
const {
  balance,
  balanceByLexer,
  compact,
  wrap,
  VerboseRegExp
} = _daub.Utils; // TODO:
// * Generators.
// LEXERS
// ======
// Consumes until a string-ending delimiter. The string-beginning delimiter is
// in context as `string-begin`.

const LEXER_STRING = new _lexer.default([{
  name: 'string-escape',
  pattern: /\\./
}, {
  name: 'string-end',
  pattern: /('|")/,
  test: (match, text, context) => {
    let char = context.get('string-begin');

    if (match[1] !== char) {
      return false;
    }

    context.set('string-begin', null);
    return match;
  },
  final: true
}], 'string'); // After seeing `{`, consumes until it sees `}`. Goes one level deeper for each
// `{` it sees.

const LEXER_BALANCE_BRACES = new _lexer.default([{
  name: 'punctuation',
  pattern: /\{/,
  inside: {
    lexer: () => LEXER_BALANCE_BRACES
  }
}, {
  name: 'punctuation',
  pattern: /\}/,
  final: true
}], 'balance-braces');
const LEXER_TEMPLATE_STRING_INTERPOLATION = new _lexer.default([{
  name: 'exclude escaped closing brace',
  pattern: /\\\}/,
  raw: true
}, {
  name: 'interpolation-end',
  pattern: /\}/,
  final: true
}], 'template-string-interpolation');
const LEXER_TEMPLATE_STRING = new _lexer.default([{
  name: 'interpolation-start',
  pattern: /(\$\{)/,
  inside: {
    name: 'interpolation',
    lexer: LEXER_TEMPLATE_STRING_INTERPOLATION
  }
}, {
  name: 'exclude escaped backtick',
  pattern: /\\\x60/,
  raw: true
}, {
  name: 'string-end',
  pattern: /\x60/,
  final: true
}], 'template-string'); // After seeing `$` followed by `{`, consumes until it sees a balanced closing
// brace.

const LEXER_JSX_INTERPOLATION = new _lexer.default([{
  name: 'punctuation',
  pattern: /\{/,
  inside: {
    lexer: LEXER_BALANCE_BRACES
  }
}, {
  name: 'exclude escaped closing brace',
  pattern: /\\\}/,
  raw: true
}, {
  name: 'string-begin',
  pattern: /^\s*('|")/,
  test: (match, text, context) => {
    context.set('string-begin', match[1]);
    return match;
  },
  inside: {
    name: 'string',
    lexer: LEXER_STRING
  }
}, {
  name: 'template-string-begin',
  pattern: /\x60/,
  inside: {
    name: 'template-string',
    lexer: LEXER_TEMPLATE_STRING
  }
}, {
  name: 'interpolation-end',
  pattern: /\}/,
  final: true
}], 'jsx-interpolation'); // Expects to be deployed immediately before a JSX interpolation. Consumes
// until the end of the interpolation.

const LEXER_BEFORE_JSX_INTERPOLATION = new _lexer.default([{
  name: 'interpolation-begin',
  pattern: /^\{/,
  inside: {
    name: 'interpolation',
    lexer: LEXER_JSX_INTERPOLATION
  }
}], 'before-jsx-interpolation'); // After seeing `=` in a JSX tag, consumes either an interpolation or a string
// until the value ends.

const LEXER_ATTRIBUTE_VALUE = new _lexer.default([{
  name: 'interpolation-begin',
  pattern: /^\{/,
  inside: {
    name: 'interpolation',
    lexer: LEXER_JSX_INTERPOLATION
  },
  final: true
}, {
  name: 'string-begin',
  pattern: /^\s*('|")/,
  test: (match, text, context) => {
    context.set('string-begin', match[1]);
    return match;
  },
  inside: {
    name: 'string',
    lexer: LEXER_STRING
  }
}], 'attribute-value'); // Expects to be deployed immediately before the `=` that separates an
// attribute name and value.

const LEXER_ATTRIBUTE_SEPARATOR = new _lexer.default([{
  name: "punctuation",
  pattern: /^=/,
  after: {
    name: 'attribute-value',
    lexer: LEXER_ATTRIBUTE_VALUE
  }
}], 'attribute-separator'); // After seeing `</` in a JSX context, consumes until the end of the tag.

const LEXER_JSX_CLOSING_TAG = new _lexer.default([{
  name: 'tag tag-html',
  pattern: /^[a-z]+(?=&gt;|>)/
}, {
  name: 'tag tag-jsx',
  pattern: /^[A-Z][A-Za-z0-9_$\.]*(?=&gt;|>)/
}, {
  name: 'punctuation',
  pattern: /^\s*(?:>|&gt;)/,
  test: (match, text, context) => {
    let depth = context.get('jsx-tag-depth');

    if (depth < 1) {
      throw new Error("Depth error!");
    }

    depth--;
    context.set('jsx-tag-depth', depth);
    return match;
  },
  final: true
}], 'jsx-closing-tag'); // Consumes the inside of a JSX opening (or self-closing) tag, where "inside"
// means the part after the name and before the closing `>`.

const LEXER_INSIDE_TAG = new _lexer.default([{
  name: 'punctuation',
  pattern: /^\s*\{/,
  inside: {
    name: 'interpolation',
    lexer: LEXER_JSX_INTERPOLATION
  }
}, {
  name: 'attribute-name',
  pattern: /^\s*[a-zA-Z][a-zA-Z0-9_$]+(?=\=)/,
  after: {
    name: 'attribute-separator',
    lexer: LEXER_ATTRIBUTE_SEPARATOR
  }
}, {
  // The end of a self-closing tag.
  name: 'punctuation',
  pattern: /^\s*\/(?:>|&gt;)/,
  test: (match, text, context) => {
    context.set('is-opening-tag', null); // Don't increment the tag depth.

    return match;
  },
  final: context => context.get('is-root')
}, {
  // The end of a tag.
  name: 'punctuation',
  pattern: /^\s*(>|&gt;)/,
  test: (match, text, context) => {
    let wasOpeningTag = context.get('is-opening-tag');
    let depth = context.get('jsx-tag-depth');
    depth += wasOpeningTag ? 1 : -1; // This rule is designed to match situations where we're inside at least
    // one JSX tag, because in those cases we're still in JSX mode. So return
    // false if the new depth is now zero. The next rule will catch this.

    if (depth === 0) {
      return false;
    } // console.warn(`[depth] Depth is now`, depth);


    context.set('jsx-tag-depth', depth);
    context.set('is-opening-tag', null);
    return match;
  },
  final: context => {
    let depth = context.get('jsx-tag-depth');
    return context.get('only-opening-tag') || depth === 0;
  },
  skipSubRulesIfFinal: true,
  after: {
    name: 'jsx-contents',
    lexer: () => LEXER_WITHIN_TAG
  }
}], 'inside-tag'); // Consumes the contents of a tag — the stuff between the opening tag and
// closing tag.

const LEXER_WITHIN_TAG = new _lexer.default([{
  // Beginning of an opening (or self-closing) JSX tag.
  name: 'punctuation',
  pattern: /^\s*(?:<|&lt;)(?!\/)/,
  after: {
    name: 'tag',
    lexer: () => LEXER_TAG_NAME
  }
}, {
  name: 'punctuation',
  pattern: /(?:<|&lt;)\/(?=[A-Za-z])/,
  inside: {
    name: 'element jsx-element',
    lexer: LEXER_JSX_CLOSING_TAG
  },
  final: true
}, {
  name: 'punctuation',
  pattern: /\{/,
  inside: {
    name: 'interpolation',
    lexer: LEXER_JSX_INTERPOLATION
  }
}], 'within-tag'); // After seeing `<` followed by a letter, consumes the JSX tag name, followed
// by the rest of the tag contents.

const LEXER_TAG_NAME = new _lexer.default([{
  name: 'tag tag-html',
  pattern: /^[a-z\-]+(?=\s|(?:>|&gt;))/,
  test: (match, text, context) => {
    context.set('is-opening-tag', true);
    let depth = context.get('jsx-tag-depth');

    if (typeof depth !== 'number') {
      console.debug("[depth] Depth set to", 0);
      context.set('jsx-tag-depth', 0);
    }

    return match;
  },
  after: {
    name: 'jsx-tag-contents',
    lexer: LEXER_INSIDE_TAG
  },
  final: context => {
    return context.get('only-opening-tag');
  }
}, {
  name: 'tag tag-jsx',
  pattern: /^[A-Z][\w\d$\.]*(?=\s|(?:>|&gt;))/,
  test: (match, text, context) => {
    context.set('is-opening-tag', true);
    let depth = context.get('jsx-tag-depth');

    if (typeof depth !== 'number') {
      context.set('jsx-tag-depth', 0);
    }

    return match;
  },
  after: {
    name: 'jsx-tag-contents',
    lexer: LEXER_INSIDE_TAG
  }
}], 'tag-name'); // Expects to be deployed immediately before the beginning of a JSX opening (or
// self-closing) tag. Consumes only until the tag ends.

const LEXER_TAG_OPEN_START = new _lexer.default([{
  name: 'punctuation',
  pattern: /^\s*(?:<|&lt;)(?!\/)/,
  test: (match, text, context) => {
    context.set('only-opening-tag', true);
    return match;
  },
  after: {
    name: 'tag',
    lexer: LEXER_TAG_NAME
  },
  final: true
}], 'tag-open-start'); // Expects to be deployed at the beginning of a root JSX element (i.e., where
// we switch from vanilla JS to JSX). Consumes until the entire JSX block is
// finished.

const LEXER_TAG_ROOT = new _lexer.default([{
  name: 'punctuation',
  pattern: /^\s*(?:<|&lt;)(?!\/)/,
  test: (match, text, context) => {
    context.set('is-root', true);
    return match;
  },
  after: {
    name: 'tag',
    lexer: LEXER_TAG_NAME
  }
}], 'tag-root');
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
let INSIDE_TEMPLATE_STRINGS = new _daub.Grammar({
  'interpolation': {
    pattern: /(\$\{)(.*?)(\})/,
    captures: {
      '1': 'punctuation interpolation-start',
      '2': () => MAIN,
      '3': 'punctuation interpolation-end'
    },
    wrapReplacement: true
  }
}).extend(ESCAPES);
const PARAMETERS = new _daub.Grammar({
  'parameter parameter-with-default': {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,
    captures: {
      '1': 'variable parameter',
      '2': 'operator',
      '3': () => VALUES
    }
  },
  'keyword operator': {
    pattern: /\.{3}/
  },
  operator: {
    pattern: /=/
  },
  'variable parameter': {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  }
});
let STRINGS = new _daub.Grammar({
  'string string-template embedded': {
    pattern: /(`)((?:[^`\\]|\\\\|\\.)*)(`)/,
    captures: {
      '1': 'punctuation string-start',
      '2': INSIDE_TEMPLATE_STRINGS,
      '3': 'punctuation string-end'
    },
    wrapReplacement: true
  },
  'string string-single-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-apostrophes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-character pair.
    pattern: /(')((?:[^'\\]|\\\\|\\.)*)(')/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    captures: {
      '2': ESCAPES
    }
  },
  'string string-double-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-quotes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-character pair.
    pattern: /(")((?:[^"\\]|\\\\|\\.)*)(")/,
    captures: {
      '2': ESCAPES
    },
    wrapReplacement: true
  }
});
let JSX_INTERPOLATION = new _daub.Grammar({
  'embedded jsx-interpolation': {
    pattern: /(\{)([\s\S]*)(\})/,

    index(text) {
      return balanceByLexer(text, LEXER_BEFORE_JSX_INTERPOLATION);
    },

    captures: {
      '1': 'punctuation embedded-start',
      '2': () => JSX_EXPRESSIONS,
      '3': 'punctuation embedded-end'
    },
    wrapReplacement: true
  }
});
let JSX_ATTRIBUTES = new _daub.Grammar({
  string: {
    pattern: /('[^']*[^\\]'|"[^"]*[^\\]")/
  },
  attribute: {
    pattern: /\b([a-zA-Z-:]+)(=)/,
    replacement: compact("\n      <span class='attribute'>\n        <span class='#{name}'>#{1}</span>\n        <span class='punctuation'>#{2}</span>\n      </span>\n    ")
  }
}).extend(JSX_INTERPOLATION);
let JSX_TAG_CONTENTS = new _daub.Grammar({});
JSX_TAG_CONTENTS.extend(JSX_ATTRIBUTES);
JSX_TAG_CONTENTS.extend(JSX_INTERPOLATION);
JSX_TAG_CONTENTS.extend({
  'punctuation punctuation-tag-close': {
    pattern: />|\/>/
  }
});
let JSX_TAG_ROOT = new _daub.Grammar({
  'jsx': {
    // This one is tricky. Most of the lexer machinery above is dedicated to
    // finding the balanced end to a JSX tag. That merely tells us _how much_
    // of the string we need to highlight. Then we invoke the JSX_CONTENTS
    // grammar to parse that substring.
    pattern: /(<|&lt;)([a-zA-Z_$][a-zA-Z0-9_$\.]*\s*)([\s\S]*)(&gt;|>)/,
    index: text => {
      return balanceByLexer(text, LEXER_TAG_ROOT);
    },
    replacement: compact("\n      <span class='jsx'>#{0}</span>\n    "),
    before: m => {
      m[0] = JSX_CONTENTS.parse(m[0]);
    }
  }
});

function handleJsxOrHtmlTag(tagName) {
  if (tagName.match(/^[A-Z]/)) {
    return wrap(tagName, 'tag tag-jsx');
  } else {
    return wrap(tagName, 'tag tag-html');
  }
}

let JSX_TAGS = new _daub.Grammar({
  'meta: opening tag without attributes': {
    pattern: /(<|&lt;)([\w$][\w\d$\.]*)(&gt;|>)/,
    replacement: compact("\n      <span class='jsx-element element element-opening'>\n        <span class='punctuation'>#{1}</span>\n        #{2}\n        <span class='punctuation'>#{3}</span>\n      </span>\n    "),

    before(r, context) {
      r[2] = handleJsxOrHtmlTag(r[2]);
    }

  },
  'tag tag-open': {
    pattern: /(<|&lt;)([\w$][\w\d$\.]*)(\s+)([\s\S]*)(.)(&gt;|>)/,
    replacement: compact("\n      <span class='#{name}'>\n        <span class='punctuation'>#{1}</span>\n        #{2}#{3}#{4}#{5}\n        <span class='punctuation'>#{6}</span>\n      </span>\n    "),

    index(text) {
      return balanceByLexer(text, LEXER_TAG_OPEN_START);
    },

    before(r, context) {
      r.name = "jsx-element element element-opening"; // We grab the last character before the closing angle bracket because an
      // optional match won't work correctly after the greedy content match. If
      // that last character is a slash, we keep it as a separate token;
      // otherwise, we move it back to the end of capture group 4.

      r[2] = handleJsxOrHtmlTag(r[2]);

      if (r[5]) {
        if (r[5] === '/') {
          r.name = r.name.replace('element-opening', 'element-self');
          r[5] = wrap(r[5], 'punctuation');
        } else {
          r[4] += r[5];
          r[5] = '';
        }
      }

      r[4] = JSX_ATTRIBUTES.parse(r[4], context);
    }

  },
  'tag tag-close': {
    pattern: /((?:<|&lt;)\/)([\w$][\w\d_$\.]*)(\s*)(&gt;|>)/,
    replacement: compact("\n      <span class='jsx-element element element-closing'>\n        <span class='punctuation'>#{1}</span>\n        <span class='tag'>#{2}</span>#{3}\n        <span class='punctuation'>#{4}</span>\n      </span>\n    ")
  }
});
let JSX_CONTENTS = new _daub.Grammar({}).extend(JSX_INTERPOLATION, JSX_TAGS);
let ARROW_FUNCTION_PARAMETERS = new _daub.Grammar({
  // TODO: This rule won't catch monstrous acts like the definition of an arrow
  // function as a default value inside a parameter. Not sure I care.
  'params': {
    pattern: /(\()([^)]+)(\))/,
    wrapReplacement: true,
    captures: {
      '1': 'punctuation',
      '2': PARAMETERS,
      '3': 'punctuation'
    }
  },
  'variable parameter': {
    pattern: /[\w$][\w\d_$]*/
  }
});
let ARROW_FUNCTIONS = new _daub.Grammar({
  'single-parameter multiline arrow function': {
    pattern: /([\w$][\w\d$]*)(\s*)(=(?:>|&gt;))/,
    captures: {
      '1': ARROW_FUNCTION_PARAMETERS,
      '3': 'operator'
    }
  },
  'meta: arrow function with params in parentheses': {
    pattern: /(\([^)]+\))(\s*)(=(?:>|&gt;))/,
    captures: {
      '1': ARROW_FUNCTION_PARAMETERS,
      '3': 'operator'
    }
  },
  'single line arrow function': {
    pattern: /(\(?[^)]\)?|[a-zA-Z_$][a-zA-Z0-9_$]*)(\s*)(=(?:>|&gt;))(\s*)/,
    captures: {
      '1': ARROW_FUNCTION_PARAMETERS,
      '3': 'operator'
    }
  }
});
let VALUES = new _daub.Grammar({});
VALUES.extend({
  constant: {
    pattern: /\b(?:arguments|this|false|true|super|null|undefined)\b/
  },
  'number number-binary-or-octal': {
    pattern: /0[bo]\d+/
  },
  number: {
    pattern: /(?:\d*\.?\d+)/
  }
});
VALUES.extend(ARROW_FUNCTIONS);
VALUES.extend(STRINGS);
VALUES.extend({
  comment: {
    pattern: /(\/\/[^\n]*\n)|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
  },
  regexp: {
    // No such thing as an empty regex, so we can get away with requiring at
    // least one not-backslash character before the end delimiter.
    pattern: /(\/)(.*?[^\\])(\/)([mgiy]*)/,
    captures: {
      '2': REGEX_INTERNALS,
      '4': 'keyword regexp-flags'
    },
    wrapReplacement: true
  }
});
let DESTRUCTURING = new _daub.Grammar({
  alias: {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,
    captures: {
      '1': 'entity'
    }
  },
  variable: {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  },
  operator: {
    pattern: /=/
  }
});
let IMPORT_SPECIFIERS = new _daub.Grammar({
  ordinary: {
    pattern: /(^|,)(\s*)([A-Za-z_$][A-Za-z_$0-9]*)(\s*)(?=$|,)/,
    captures: {
      '1': 'punctuation',
      '3': 'variable variable-import'
    }
  },
  'default as': {
    pattern: /(^|,)(\s*)(default)(\s*)(as)(\s*)([\w$][\w\d$]*)(\s*)(?=$|,)/,
    captures: {
      '1': 'punctuation',
      '3': 'keyword keyword-default',
      '5': 'keyword keyword-as',
      '7': 'variable variable-import'
    }
  }
});
let IMPORT_SPECIFIER = new _daub.Grammar({
  'implicit default specifier': {
    pattern: /^(\s*)([A-Za-z_$][A-Za-z_$0-9]*)(\s*)(?=,|$)/,
    captures: {
      '2': 'variable variable-import'
    }
  },
  specifiers: {
    pattern: /(\{)(\s*)([^}]+)(})/,
    captures: {
      '3': IMPORT_SPECIFIERS
    }
  }
});
let IMPORTS = new _daub.Grammar({
  'import with destructuring': {
    pattern: /(^\s*)(import)(\s*)(?=\{)([\s\S]*?)(\s*)(from)(\s*)(.*?)(?=;|\n)/,
    captures: {
      '2': 'keyword keyword-import',
      '4': IMPORT_SPECIFIER,
      '6': 'keyword keyword-from',
      '8': STRINGS
    }
  },
  'import with source': {
    pattern: /(^\s*)(import)(\s*)(.*?)(\s*)(from)(\s*)(.*?)(?=;|\n)/,
    captures: {
      '2': 'keyword keyword-import',
      '4': () => IMPORT_SPECIFIER,
      '6': 'keyword keyword-from',
      '8': () => STRINGS
    }
  },
  'import without source': {
    pattern: /(^\s*)(import)(\s*)(?=\`|'|")(.*?)(?=;|\n)/,
    captures: {
      '2': 'keyword keyword-import',
      '4': () => STRINGS
    }
  }
});
let OPERATORS = new _daub.Grammar({
  'keyword operator': {
    pattern: /\|\||&&|&amp;&amp;|!==?|={1,3}|>=?|<=?|\+\+|\+|--|-|\*|[\*\+-\/]=|\?|\.{3}|\b(?:instanceof|in|of)\b/
  }
});
let JSX_EXPRESSIONS = new _daub.Grammar({});
JSX_EXPRESSIONS.extend(JSX_TAGS);
JSX_EXPRESSIONS.extend(VALUES);
JSX_EXPRESSIONS.extend(ARROW_FUNCTIONS);
JSX_EXPRESSIONS.extend(OPERATORS);
let MAIN = new _daub.Grammar('javascript-jsx', {}, {
  alias: ['react', 'javascript']
});
MAIN.extend(JSX_TAG_ROOT);
MAIN.extend(IMPORTS);
MAIN.extend(VALUES);
MAIN.extend({
  // TODO: Why did I need this?
  'meta: exclude digits in the middle of identifiers': {
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
  'meta: new keyword plus identifier': {
    pattern: /(new)(\s+)((?:[\w$][\w\d$]*\.)*)([\w$][\w\d$]*)(?=\()/,
    captures: {
      '1': 'keyword keyword-new',
      '4': 'entity-class'
    }
  },
  'meta: variable declaration': {
    pattern: /\b(var|let|const)(\s+)([\w$][\w\d$]*?)(\s*)(?=\s|=|;|,)/,
    captures: {
      '1': 'storage',
      '3': 'variable'
    }
  },
  'meta: variable assignment': {
    // This rule could accidentally match the middle of a parameter list with
    // defaults, which is why we try to weed those out first with an earlier
    // rule.
    pattern: /(\s+|,)([A-Za-z_$][\w\d$]*?)(\s*)(?==)(?!=(?:>|&gt;))/,
    captures: {
      '2': 'variable'
    }
  },
  'meta: destructuring assignment': {
    pattern: /(let|var|const)(\s+)(\{|\[)([\s\S]*)(\}|\])(\s*)(=)/,
    index: text => {
      // TODO: Should this use a lexer approach? Might be more accurate, but
      // would be lots more code.
      let pairs = {
        '{': '}',
        '[': ']'
      };
      let match = /(let|var|const|)(\s+)(\{|\[)/.exec(text);
      let char = match[3],
          paired = pairs[char];
      let index = balance(text, paired, char); // Once we've balanced braces, find the next equals sign.

      let equals = text.indexOf('=', index);
      let subset = text.slice(0, equals + 1);
      return equals;
    },
    captures: {
      '1': 'storage',
      '4': DESTRUCTURING,
      '7': 'operator'
    }
  },
  'function function-expression': {
    pattern: /\b(function)(\s*)([a-zA-Z_$]\w*)?(\s*)(\()(.*?)(\))/,
    captures: {
      '1': 'keyword keyword-function',
      '3': 'entity',
      '5': 'punctuation',
      '6': PARAMETERS,
      '7': 'punctuation'
    }
  },
  'function function-literal-shorthand-style': {
    pattern: /(^\s*)(get|set|static)?(\s*)([\w$][\w\d$]*)(\s*)(\()(.*?)(\))(\s*)(?=\{)/,
    captures: {
      '2': 'storage',
      '4': 'entity',
      '6': 'punctuation',
      '7': PARAMETERS,
      '8': 'punctuation'
    }
  },
  'meta: function shorthand with computed property name': {
    pattern: /(])(\s*)(\()(.*?)(\))(\s*)(?=\{)/,
    captures: {
      '3': 'punctuation',
      '4': PARAMETERS,
      '5': 'punctuation',
      '7': 'punctuation'
    }
  },
  'function function-assigned-to-variable': {
    pattern: /\b([\w$][\w\d$]*)(\s*)(=)(\s*)(function)(\s*)(\()(.*?)(\))/,
    captures: {
      '1': 'variable',
      '3': 'operator',
      '5': 'keyword',
      '7': 'punctuation',
      '8': PARAMETERS,
      '9': 'punctuation'
    }
  },
  'meta: property then function': {
    pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(:)(\s*)(?=function)/,
    captures: {
      '1': 'entity',
      '2': 'punctuation'
    }
  },
  'entity': {
    pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(?=:)/
  },
  'meta: class definition': {
    pattern: /(class)(?:(\s+)([A-Z][A-Za-z0-9_]*))?(?:(\s+)(extends)(\s+)([A-Z][A-Za-z0-9_$\.]*))?(\s*)({)/,
    index: match => {
      return balance(match, '}', '{', {
        startIndex: match.indexOf('{') + 1
      });
    },
    replacement: compact("\n      <span class=\"storage\">#{1}</span>\n      #{2}#{3}\n      #{4}#{5}#{6}#{7}\n      #{8}#{9}\n    "),
    captures: {
      '1': 'storage',
      '3': 'entity entity-class',
      '5': 'storage',
      '7': 'entity entity-class entity-superclass'
    }
  },
  storage: {
    pattern: /\b(?:var|let|const|class|extends|async)\b/
  },
  keyword: {
    pattern: /\b(?:try|catch|finally|if|else|do|while|for|break|continue|case|switch|default|return|yield|throw|await)\b/
  }
}).extend(OPERATORS);
var _default = MAIN;
exports.default = _default;