/* eslint-disable no-useless-escape */
import Grammar from '#internal/grammar';
import {
  balance,
  balanceByLexer,
  balanceAndHighlightByLexer,
  serializeLexerFragment,
  compact,
  wrap,
  VerboseRegExp
} from '#internal/utils';
import Lexer from '#internal/lexer';

// TODO:
// * Generators.

// LEXERS
// ======

// Consumes until a string-ending delimiter. The string-beginning delimiter is
// in context as `string-begin`.
const LEXER_STRING = new Lexer([
  {
    name: 'string-escape',
    pattern: /\\./
  },
  {
    name: 'string-end',
    pattern: /('|")/,
    test: (match, text, context) => {
      let char = context.get('string-begin');
      if (match[1] !== char) { return false; }
      context.set('string-begin', null);
      return match;
    },
    final: true
  }
], 'string', { scopes: 'string' });

// After seeing `{`, consumes until it sees `}`. Goes one level deeper for each
// `{` it sees.
const LEXER_BALANCE_BRACES = new Lexer([
  {
    name: 'punctuation',
    pattern: /\{/,
    inside: {
      lexer: () => LEXER_BALANCE_BRACES
    }
  },
  {
    name: 'punctuation',
    pattern: /\}/,
    final: true
  }
], 'balance-braces');

const LEXER_TEMPLATE_STRING_INTERPOLATION = new Lexer([
  {
    name: 'exclude escaped closing brace',
    pattern: /\\\}/,
    raw: true
  },
  {
    name: 'punctuation interpolation-end',
    pattern: /\}/,
    final: true
  }
], 'template-string-interpolation');

const LEXER_TEMPLATE_STRING = new Lexer([
  {
    name: 'interpolation-start',
    pattern: /(\$\{)/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_TEMPLATE_STRING_INTERPOLATION
    }
  },
  {
    name: 'exclude escaped backtick',
    pattern: /\\\x60/,
    raw: true
  },
  {
    name: 'string-end',
    pattern: /\x60/,
    final: true
  }
], 'template-string');


// After seeing `$` followed by `{`, consumes until it sees a balanced closing
// brace.
const LEXER_JSX_INTERPOLATION = new Lexer([
  {
    name: 'punctuation interpolation-begin',
    pattern: /\{/,
    inside: { lexer: LEXER_BALANCE_BRACES }
  },
  {
    name: 'exclude escaped closing brace',
    pattern: /\\\}/,
    raw: true
  },
  {
    name: 'string-begin',
    // classNames: 'string string-quoted',
    pattern: /^\s*('|")/,
    test: (match, text, context) => {
      context.set('string-begin', match[1]);
      return match;
    },
    inside: {
      name: 'string',
      lexer: LEXER_STRING
    }
  },
  {
    name: 'template-string-begin',
    pattern: /\x60/,
    inside: {
      name: 'template-string',
      lexer: LEXER_TEMPLATE_STRING
    }
  },
  {
    name: 'punctuation interpolation-end',
    pattern: /\}/,
    final: true
  }
], 'jsx-interpolation', {
  highlight: (tokens, context) => {
    let last = tokens.pop();
    let serialized = serializeLexerFragment(tokens);
    let highlighted = MAIN.parse(serialized, context);
    return [highlighted, last];
  },
  scopes: 'embedded jsx-interpolation'
});

// Expects to be deployed immediately before a JSX interpolation. Consumes
// until the end of the interpolation.
const LEXER_BEFORE_JSX_INTERPOLATION = new Lexer([
  {
    name: 'punctuation interpolation-begin',
    pattern: /^\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    }
  }
], 'before-jsx-interpolation');

// After seeing `=` in a JSX tag, consumes either an interpolation or a string
// until the value ends.
const LEXER_ATTRIBUTE_VALUE = new Lexer([
  {
    name: 'punctuation interpolation-begin',
    pattern: /^\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    },
    final: true
  },
  {
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
  }
], 'attribute-value');

// Expects to be deployed immediately before the `=` that separates an
// attribute name and value.
const LEXER_ATTRIBUTE_SEPARATOR = new Lexer([
  {
    name: `punctuation`,
    pattern: /^=/,
    after: {
      name: 'attribute-value',
      lexer: LEXER_ATTRIBUTE_VALUE
    }
  }
], 'attribute-separator');

// After seeing `</` in a JSX context, consumes until the end of the tag.
const LEXER_JSX_CLOSING_TAG = new Lexer([
  {
    name: 'tag HTML',
    scopes: 'tag tag-html',
    pattern: /^[a-z]+(?=&gt;|>)/
  },
  {
    name: 'tag JSX',
    scopes: 'tag tag-jsx',
    pattern: /^[A-Z][A-Za-z0-9_$\.]*(?=&gt;|>)/
  },
  {
    name: 'punctuation',
    pattern: /^\s*(?:>|&gt;)/,
    test: (match, text, context) => {
      let depth = context.get('jsx-tag-depth');
      if (depth < 1) { throw new Error(`Depth error!`); }
      depth--;
      context.set('jsx-tag-depth', depth);
      return match;
    },
    trim: true,
    final: true
  }
], 'jsx-closing-tag', { scopes: 'jsx-element element element-closing' });

// Consumes the inside of a JSX opening (or self-closing) tag, where "inside"
// means the part after the name and before the closing `>`.
const LEXER_INSIDE_TAG = new Lexer([
  {
    name: 'punctuation interpolation-begin',
    pattern: /^\s*\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    },
    trim: true
  },
  {
    name: 'attribute-name',
    pattern: /^\s*[a-zA-Z][a-zA-Z0-9_$]+(?=\=)/,
    after: {
      name: 'attribute-separator',
      lexer: LEXER_ATTRIBUTE_SEPARATOR
    },
    trim: true
  },
  {
    // The end of a self-closing tag.
    name: 'punctuation punctuation-self-closing',
    pattern: /^\s*\/(?:>|&gt;)/,
    test: (match, text, context) => {
      context.set('is-opening-tag', null);
      // Don't increment the tag depth.
      return match;
    },
    trim: true,
    final: (context) => context.get('is-root')
  },
  {
    // The end of a tag.
    name: 'punctuation',
    pattern: /^\s*(>|&gt;)/,
    test: (match, text, context) => {
      let wasOpeningTag = context.get('is-opening-tag');
      let depth = context.get('jsx-tag-depth');
      depth += wasOpeningTag ? 1 : -1;

      // This rule is designed to match situations where we're inside at least
      // one JSX tag, because in those cases we're still in JSX mode. So return
      // false if the new depth is now zero. The next rule will catch this.
      if (depth === 0) { return false; }
      context.set('jsx-tag-depth', depth);
      context.set('is-opening-tag', null);
      return match;
    },
    trim: true,
    final: (context) => {
      let depth = context.get('jsx-tag-depth');
      return context.get('only-opening-tag') || depth === 0;
    },
    skipSubRulesIfFinal: true,
    after: {
      name: 'jsx-contents',
      lexer: () => LEXER_WITHIN_TAG
    }
  },
], 'inside-tag');

// Consumes the contents of a tag — the stuff between the opening tag and
// closing tag.
const LEXER_WITHIN_TAG = new Lexer([
  {
    // Beginning of an opening (or self-closing) JSX tag.
    name: 'punctuation',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    trim: true,
    after: {
      name: 'tag',
      lexer: () => LEXER_TAG_NAME
    }
  },
  {
    name: 'punctuation',
    pattern: /(?:<|&lt;)\/(?=[A-Za-z])/,
    inside: {
      name: 'element jsx-element',
      lexer: LEXER_JSX_CLOSING_TAG
    },
    final: true
  },
  {
    name: 'punctuation interpolation-begin',
    pattern: /\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    }
  },
], 'within-tag');

// After seeing `<` followed by a letter, consumes the JSX tag name, followed
// by the rest of the tag contents.
const LEXER_TAG_NAME = new Lexer([
  {
    name: 'tag tag-html',
    pattern: /^[a-z\-]+(?=\s|(?:>|&gt;))/,
    test: (match, text, context) => {
      context.set('is-opening-tag', true);
      let depth = context.get('jsx-tag-depth');
      if (typeof depth !== 'number') {
        console.debug(`[depth] Depth set to`, 0);
        context.set('jsx-tag-depth', 0);
      }
      return match;
    },
    trim: true,
    after: {
      name: 'jsx-tag-contents',
      lexer: LEXER_INSIDE_TAG
    },
    final: (context) => {
      return context.get('only-opening-tag');
    }
  },
  {
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
  }
], 'tag-name');

// Expects to be deployed immediately before the beginning of a JSX opening (or
// self-closing) tag. Consumes only until the tag ends.
const LEXER_TAG_OPEN_START = new Lexer([
  {
    name: 'punctuation',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    test: (match, text, context) => {
      context.set('only-opening-tag', true);
      return match;
    },
    trim: true,
    after: {
      name: 'tag',
      lexer: LEXER_TAG_NAME,
      silent: true
    },
    final: true
  }
], 'tag-open-start');

// Expects to be deployed at the beginning of a root JSX element (i.e., where
// we switch from vanilla JS to JSX). Consumes until the entire JSX block is
// finished.
const LEXER_TAG_ROOT = new Lexer([
  {
    name: 'punctuation',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    test: (match, text, context) => {
      context.set('is-root', true);
      return match;
    },
    trim: true,
    after: {
      name: 'tag',
      lexer: LEXER_TAG_NAME,
      silent: true
    }
  }
], 'tag-root', { scopes: 'jsx-element element element-opening' });


// GRAMMARS
// ========

let ESCAPES = new Grammar({
  escape: { pattern: /\\./ }
});

let REGEX_INTERNALS = new Grammar({
  escape: { pattern: /\\./ },

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

let INSIDE_TEMPLATE_STRINGS = new Grammar({
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

const PARAMETERS = new Grammar({
  'meta: parameter with default': {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,
    captures: {
      '1': 'variable parameter',
      '2': 'ror',
      '3': () => VALUES
    }
  },

  'keyword operator': {
    pattern: /\.{3}/
  },

  operator: { pattern: /=/ },

  'variable variable-parameter': {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  }
});

let STRINGS = new Grammar({
  'string string-template': {
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
    captures: { '2': ESCAPES },
    wrapReplacement: true
  }
});

let JSX_INTERPOLATION = new Grammar({
  'embedded jsx-interpolation': {
    pattern: /(\{)([\s\S]*)(\})/,
    index (text) {
      return balanceByLexer(text, LEXER_BEFORE_JSX_INTERPOLATION);
    },
    captures: {
      '1': 'punctuation embedded-start',
      '2': () => MAIN,
      '3': 'punctuation embedded-end'
    },
    wrapReplacement: true
  }
});

let JSX_ATTRIBUTES = new Grammar({
  string: {
    pattern: /('[^']*[^\\]'|"[^"]*[^\\]")/
  },

  attribute: {
    pattern: /\b([a-zA-Z-:]+)(=)/,
    captures: {
      '1': 'attribute-name',
      '2': 'punctuation'
    },
    wrapReplacement: true
  }
}).extend(JSX_INTERPOLATION);

let JSX_TAG_CONTENTS = new Grammar({});
JSX_TAG_CONTENTS.extend(JSX_ATTRIBUTES);
JSX_TAG_CONTENTS.extend(JSX_INTERPOLATION);
JSX_TAG_CONTENTS.extend({
  'punctuation punctuation-tag-close': {
    pattern: />|\/>/
  }
});

let JSX_TAG_ROOT = new Grammar({
  'jsx': {
    // This one is tricky. Most of the lexer machinery above is dedicated to
    // finding the balanced end to a JSX tag. That merely tells us _how much_
    // of the string we need to highlight. Then we invoke the JSX_CONTENTS
    // grammar to parse that substring.
    pattern: VerboseRegExp`
      (<|&lt;) # opening angle bracket
      ([a-zA-Z_$][a-zA-Z0-9_$\.]*\s*) # any valid identifier as a tag name
      ([\s\S]*) # middle-of-tag content (will be parsed later)
      (&gt;|>)
    `,
    index: (text, context) => {
      let index = balanceByLexer(text, LEXER_TAG_ROOT, context);
      // let { index, highlighted } = balanceAndHighlightByLexer(text, LEXER_TAG_ROOT, context);
      // context.set('lexer-highlighted', highlighted);
      return index;
    },
    captures: {
      '0': () => JSX_CONTENTS
    },
    replacement: `<span class='jsx'>#{0}</span>`,
    after (text, context) {
      return context.get('lexer-highlighted') || text;
    }
  }
});

function handleJsxOrHtmlTag (tagName) {
  if (tagName.match(/^[A-Z]/)) {
    return wrap(tagName, 'tag tag-jsx');
  } else {
    return wrap(tagName, 'tag tag-html');
  }
}

let JSX_TAGS = new Grammar({
  'meta: opening tag without attributes': {
    pattern: VerboseRegExp`
      (<|&lt;) # 1: opening angle bracket
      ([\w$][\w\d$\.]*) # 2: any valid identifier as a tag name
      (&gt;|>) # 3: closing bracket
    `,
    replacement: compact(`
      <span class='jsx-element element element-opening'>
        <span class='punctuation'>#{1}</span>
        #{2}
        <span class='punctuation'>#{3}</span>
      </span>
    `),
    before (r, context) {
      r[2] = handleJsxOrHtmlTag(r[2]);
    }
  },
  'tag tag-open': {
    pattern: VerboseRegExp`
      (<|&lt;) # 1: opening angle bracket
      ([\w$][\w\d$\.]*) # 2: any valid identifier as a tag name
      (\s+) # 3: space after the tag name
      ([\s\S]*) # 4: middle-of-tag content (will be parsed later)
      (.) # 5: the last character before the closing bracket
      (&gt;|>)
    `,
    replacement: compact(`
      <span class='#{name}'>
        <span class='punctuation'>#{1}</span>
        #{2}#{3}#{4}#{5}
        <span class='punctuation'>#{6}</span>
      </span>
    `),
    index (text) {
      return balanceByLexer(text, LEXER_TAG_OPEN_START);
    },
    before (r, context) {
      r.name = `jsx-element element element-opening`;
      // We grab the last character before the closing angle bracket because an
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
    pattern: VerboseRegExp`
      ((?:<|&lt;)\/) # 1: opening angle bracket and slash
      ([\w$][\w\d_$\.]*) # 2: any valid identifier as a tag name
      (\s*) # 3: optional space
      (&gt;|>) # 4: closing angle bracket
    `,
    replacement: compact(`
      <span class='jsx-element element element-closing'>
        <span class='punctuation'>#{1}</span>
        <span class='tag'>#{2}</span>#{3}
        <span class='punctuation'>#{4}</span>
      </span>
    `)
  }
});

let JSX_CONTENTS = new Grammar({}).extend(JSX_INTERPOLATION, JSX_TAGS);

let ARROW_FUNCTION_PARAMETERS = new Grammar({
  // TODO: This rule won't catch monstrous acts like the definition of an arrow
  // function as a default value inside a parameter. Not sure I care.
  'params': {
    pattern: VerboseRegExp`
      (\()    # 1: opening paren
      ([^)]+) # 2: contents of params
      (\))    # 3: closing paren
    `,
    wrapReplacement: true,
    captures: {
      '1': 'punctuation',
      '2': PARAMETERS,
      '3': 'punctuation'
    }
  },
  'variable variable-parameter': {
    pattern: /[\w$][\w\d_$]*/
  }
});

let ARROW_FUNCTIONS = new Grammar({
  'meta: single-parameter multiline arrow function': {
    pattern: VerboseRegExp`
      ([\w$][\w\d$]*) # any single identifier
      (\s*)           # optional space
      (=(?:>|&gt;))   # arrow function operator!
    `,
    captures: {
      '1': ARROW_FUNCTION_PARAMETERS,
      '3': 'operator'
    }
  },
  'meta: arrow function with params in parentheses': {
    pattern: VerboseRegExp`
      (       # 1:
        \(    # optional opening paren
        [^)]+ # contents of params
        \)    # optional closing paren
      )
      (\s*)         # 2: optional space
      (=(?:>|&gt;)) # arrow function operator!
    `,
    captures: {
      '1': ARROW_FUNCTION_PARAMETERS,
      '3': 'operator'
    }
  },
  'single line arrow function': {
    pattern: VerboseRegExp`
      ( # EITHER:
        \(? # optional opening paren
        [^)] # contents of params
        \)? # optional closing paren
        | # OR:
       [a-zA-Z_$][a-zA-Z0-9_$]* # any single identifier
      )
      (\s*) # optional space
      (=(?:>|&gt;)) # arrow function operator!
      (\s*) # optional space
    `,
    captures: {
      '1': ARROW_FUNCTION_PARAMETERS,
      '3': 'operator'
    }
  },
});

let VALUES = new Grammar({});
VALUES.extend(
  {
    constant: {
      pattern: /\b(?:arguments|this|false|true|super|null|undefined)\b/
    },

    'number number-binary-or-octal': {
      pattern: /0[bo]\d+/
    },

    number: {
      pattern: /(?:\d*\.?\d+)/,
    }
  }
);
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

let DESTRUCTURING = new Grammar({
  alias: {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,
    captures: { '1': 'entity' }
  },

  variable: {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  },

  operator: {
    pattern: /=/
  }
});

let IMPORT_SPECIFIERS = new Grammar('import specifiers', {
  ordinary: {
    pattern: VerboseRegExp`
      (^|,) # 1: beginning of string or comma
      ([\s\n]*) # 2: space
      ([A-Za-z_$][A-Za-z_$0-9]*) # 3: identifier
      (\s*) # 4: optional space
      (?=$|,) # followed by end of string or comma
    `,
    captures: {
      '1': 'punctuation',
      '3': 'variable variable-import'
    }
  },

  'default as': {
    pattern: VerboseRegExp`
      (^|,)     # 1: beginning of string or comma
      ([\s\n]*)     # 2: space
      (default) # 3: "default"
      (\s*)     # 4: space
      (as)      # 5: "as"
      (\s*)     # 6: space
      ([\w$][\w\d$]*) # 7: identifier
      (\s*)     # 8: space
      (?=$|,) # followed by end of string or comma
    `,
    captures: {
      '1': 'punctuation',
      '3': 'keyword keyword-default',
      '5': 'keyword keyword-as',
      '7': 'variable variable-import'
    }
  },

  'foo as bar': {
    pattern: VerboseRegExp`
      (^|,)     # 1: beginning of string or comma
      ([\s\n]*)     # 2: space
      ([\w$][\w\d$]*) # 3: identifier
      (\s+)     # 4: space
      (as)      # 5: "as"
      (\s+)     # 6: space
      ([\w$][\w\d$]*) # 7: identifier
      (\s*)     # 8: space
      (?=$|,) # followed by end of string or comma
    `,
    captures: {
      '1': 'punctuation',
      '3': 'variable variable-import',
      '5': 'keyword keyword-as',
      '7': 'variable variable-import'
    }
  }
});

let IMPORT_SPECIFIER = new Grammar('import specifier', {
  'implicit default specifier': {
    pattern: VerboseRegExp`
      ^(\s*) # 1: optional space anchored to beginning of import
      ([A-Za-z_$][A-Za-z_$0-9]*) # 2: identifier
      (\s*)
      (?=,|$) # followed by comma or end of string
    `,
    captures: {
      '2': 'variable variable-import'
    }
  },
  specifiers: {
    pattern: VerboseRegExp`
      (\{)(\s*) # opening brace
      ([^}]+) # stuff in the middle
      (}) # closing brace
    `,
    captures: {
      '3': IMPORT_SPECIFIERS
    }
  }
});

let IMPORTS = new Grammar({
  'import with destructuring': {
    pattern: VerboseRegExp`
      (^\s*)
      (import)(\s*)
      (?=\{) # lookahead: opening brace
      ([\s\S]*?)(\s*)
      (from)(\s*)
      (.*?)
      (?=;|\n) # ending with a newline or semicolon
    `,
    captures: {
      '2': 'keyword keyword-import',
      '4': IMPORT_SPECIFIER,
      '6': 'keyword keyword-from',
      '8': STRINGS
    }
  },
  'import with source': {
    pattern: VerboseRegExp`
      (^\s*)
      (import)(\s*)
      (.*?)(\s*)
      (from)(\s*)
      (.*?)
      (?=;|\n) # ending with a newline or semicolon
    `,
    captures: {
      '2': 'keyword keyword-import',
      '4': () => IMPORT_SPECIFIER,
      '6': 'keyword keyword-from',
      '8': () => STRINGS
    },
  },
  'import without source': {
    pattern: VerboseRegExp`
      (^\s*)   # 1: optional leading space
      (import) # 2: keyword
      (\s*)    # 3: space
      (?=\`|'|") # (lookahead) when we see an opening string delimiter...
      (.*?)    # 4: capture everything, including the delimiter...
      (?=;|\n) # (lookahead) ...until the end of the line
    `,
    captures: {
      '2': 'keyword keyword-import',
      '4': () => STRINGS
    }
  }
});

let EXPORT_SPECIFIERS = new Grammar('export specifiers', {
  ordinary: {
    pattern: VerboseRegExp`
      (^|,) # 1: beginning of string or comma
      (\s*) # 2: optional space
      ([A-Za-z_$][A-Za-z_$0-9]*) # 3: identifier
      (\s*) # 4: optional space
      (?=$|,) # followed by end of string or comma
    `,
    captures: {
      '1': 'punctuation',
      '3': 'variable variable-export'
    }
  },

  'as default': {
    pattern: VerboseRegExp`
      (^|,)     # 1: beginning of string or comma
      (\s*)     # 2: space
      ([\w$][\w\d$]*) # 3: identifier
      (\s*)     # 4: space
      (as)      # 5: "as"
      (\s*)     # 6: space
      (default) # 7: "default"
      (\s*)     # 8: space
      (?=$|,) # followed by end of string or comma
    `,
    captures: {
      '1': 'punctuation',
      '3': 'variable variable-export',
      '5': 'keyword keyword-as',
      '7': 'keyword keyword-default',
    }
  },

  'as [identifier]': {
    pattern: VerboseRegExp`
      (^|,)     # 1: beginning of string or comma
      (\s*)     # 2: space
      ([\w$][\w\d$]*) # 3: identifier
      (\s*)     # 4: space
      (as)      # 5: "as"
      (\s*)     # 6: space
      ([\w$][\w\d$]*) # 7: identifier
      (\s*)     # 8: space
      (?=$|,) # followed by end of string or comma
    `,
    captures: {
      '1': 'punctuation',
      '3': 'variable variable-import',
      '5': 'keyword keyword-as',
      '7': 'variable variable-export'
    }
  }
});

let EXPORT_SPECIFIER = new Grammar('export specifier', {
  specifiers: {
    pattern: VerboseRegExp`
      (\{)(\s*) # opening brace
      ([^}]+) # stuff in the middle
      (}) # closing brace
    `,
    captures: {
      '3': EXPORT_SPECIFIERS
    }
  }
});

let EXPORTS = new Grammar('exports', {
  'export with destructuring': {
    pattern: VerboseRegExp`
      (^\s*)
      (export)(\s*)
      (?=\{) # lookahead: opening brace
      ([\s\S]*?\s*\}) # ending with a closing brace
    `,
    captures: {
      '2': 'keyword keyword-export',
      '4': EXPORT_SPECIFIER
    }
  },

  'export default with identifier': {
    pattern: VerboseRegExp`
      (^\s*)   # 1: optional leading space
      (export) # 2: keyword
      (\s+)    # 3: space
      (default) # 4: "default" keyword
      (\s+)    # 5: space
      ([\w$][\w\d$]*) # 6: identifier
    `,
    captures: {
      '2': 'keyword keyword-export',
      '4': 'keyword keyword-default',
      '6': 'variable variable-export'
    }
  },

  'export by itself or with default': {
    pattern: VerboseRegExp`
      (^\s*)   # 1: optional leading space
      (export) # 2: keyword
      (\s+)    # 3: space
      (default)? # 4: optional "default" keyword
      (\s*) # 5: zero or more spaces (since default is optional)
      (?=let|const|var|function|\[|\{) # (lookahead) a token that would distinguish from the identifier scenario
    `,
    captures: {
      '2': 'keyword keyword-export',
      '4': 'keyword keyword-default'
    }
  }
});

let OPERATORS = new Grammar({
  'keyword operator': {
    pattern: /\|\||&&|&amp;&amp;|!==?|={1,3}|(?:>=|&gt;=)|(?:<=|&lt;=)|\+\+|\+|--|-|\*|[\*\+-\/]=|\.{3}|\b(?:instanceof|in|of)\b|!|void|\.|(?:>|&gt;)|(?:<|&lt;)/
  },
  // Ternary colons are very hard to distinguish from property-value-pair
  // colons. Punt on it! Don't highlight a colon or a question mark as ternary
  // operators unless they're flanked by spaces.
  'meta: ternary colon': {
    pattern: VerboseRegExp`
      (\s+)
      (\?|:)
      (\s+)
    `,
    captures: {
      2: 'keyword operator operator-ternary'
    }
  }
});

let JSX_EXPRESSIONS = new Grammar({});
JSX_EXPRESSIONS.extend(JSX_TAGS);
JSX_EXPRESSIONS.extend(VALUES);
JSX_EXPRESSIONS.extend(ARROW_FUNCTIONS);
JSX_EXPRESSIONS.extend(OPERATORS);

let MAIN = new Grammar('javascript-jsx', {}, { alias: ['react', 'javascript', 'js'] });

MAIN.extend(JSX_TAG_ROOT);
MAIN.extend(IMPORTS);
MAIN.extend(EXPORTS);
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
    pattern: VerboseRegExp`
      (new)                  # 1: keyword
      (\s+)                  # 2: space
      ((?:[\w$][\w\d$]*\.)*) # 3: any number of object properties
      ([\w$][\w\d$]*)        # 4: class
      (?=\()                 # (lookahead) open paren
    `,
    captures: {
      '1': 'keyword keyword-new',
      '3': () => OPERATORS,
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
    captures: { '2': 'variable' }
  },

  'meta: destructuring assignment': {
    pattern: VerboseRegExp`
      (let|var|const) # storage
      (\s+) # mandatory space
      (\{|\[) # opening brace or bracket
      ([\s\S]*) # a bunch of stuff
      (\}|\]) # closing brace or bracket
      (\s*)
      (=) # followed by an equals sign
    `,
    index: (text) => {
      // TODO: Should this use a lexer approach? Might be more accurate, but
      // would be lots more code.
      let pairs = { '{': '}', '[': ']' };
      let match = (/(let|var|const|)(\s+)(\{|\[)/).exec(text);
      let char = match[3], paired = pairs[char];
      let index = balance(text, paired, char);
      // Once we've balanced braces, find the next equals sign.
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
    pattern: VerboseRegExp`
      \b(function)
      (\s*)
      ([a-zA-Z_$]\w*)? # function name (optional)
      (\s*)
      (\()             # open parenthesis
      (.*?)            # raw params
      (\))             # close parenthesis
    `,
    captures: {
      '1': 'keyword keyword-function',
      '3': 'entity',
      '5': 'punctuation',
      '6': PARAMETERS,
      '7': 'punctuation'
    }
  },

  'function function-literal-shorthand-style': {
    pattern: VerboseRegExp`
      (^\s*)            # 1: space
      (get|set|static)? # 2: annotation
      (\s*)             # 3: space
      ([\w$][\w\d$]*)   # 4: function name
      (\s*)             # 5: space
      (\()              # 6: open parenthesis
      (.*?)             # 7: raw params
      (\))              # 8: close parenthesis
      (\s*)             # 9: space
      (?=\{)            # (lookahead) brace
    `,
    captures: {
      '2': 'storage',
      '4': 'entity',
      '6': 'punctuation',
      '7': PARAMETERS,
      '8': 'punctuation'
    },
  },

  'meta: function shorthand with computed property name': {
    pattern: VerboseRegExp`
      (])    # 1: closing bracket (signifying possible computed property name)
      (\s*)  # 2: space
      (\()   # 3: open paren
      (.*?)  # 4: raw params
      (\))   # 5: close paren
      (\s*)  # 6: space
      (?=\{) # (lookahead) opening brace
    `,
    captures: {
      '3': 'punctuation',
      '4': PARAMETERS,
      '5': 'punctuation',
      '7': 'punctuation'
    }
  },

  'function function-assigned-to-variable': {
    pattern: VerboseRegExp`
      \b
      ([\w$][\w\d$]*) # 1: variable name
      (\s*)      # 2: space
      (=)        # 3: equals sign
      (\s*)      # 4: space
      (function) # 5: keyword
      (\s*)      # 6: space
      (\()       # 7: open paren
      (.*?)      # 8: raw params
      (\))       # 9: close paren
    `,
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
    pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(?=:)/,
  },

  'meta: class definition': {
    pattern: VerboseRegExp`
      (class)                # 1: storage
      (?:                    # begin optional class name
        (\s+)                # 2: space
        ([A-Z][A-Za-z0-9_]*) # 3: class name
      )?                     # end optional class name
      (?:                    # begin optional 'extends' keyword
        (\s+)                # 4: space
        (extends)            # 5: storage
        (\s+)                # 6: space
        ([A-Z][A-Za-z0-9_$\.]*) # 7: superclass name
      )?                     # end optional 'extends' keyword
      (\s*)                  # 8: space
      ({)                    # 9: opening brace
    `,
    index (match) {
      return balance(
        match, '}', '{',
        { startIndex: match.indexOf('{') + 1 }
      );
    },
    captures: {
      '1': 'storage',
      '3': 'entity entity-class',
      '5': 'storage',
      '7': 'entity entity-class entity-superclass'
    }
  },

  storage: {
    pattern: /\b(?:var|let|const|class|extends|async|static)\b/
  },

  keyword: {
    pattern: /\b(?:try|catch|finally|if|else|do|while|for|break|continue|case|switch|default|return|yield|throw|await)\b/
  }
}).extend(OPERATORS);

export default MAIN;
