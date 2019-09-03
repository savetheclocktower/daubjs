/* eslint-disable no-useless-escape */
import { Utils, Grammar } from '../daub';
import Lexer from '../lexer';
const {
  balance,
  balanceByLexer,
  compact,
  wrap,
  VerboseRegExp,
  regexpEscape
} = Utils;

// LEXERS
// ======

const LEXER_STRING = new Lexer([
  {
    name: 'string-escape',
    pattern: /\\./
  },
  {
    name: 'string-end',
    pattern: /('|")/,
    test: (pattern, text, context) => {
      let char = context.get('string-begin');
      let match = pattern.exec(text);
      if (!match) { return false; }
      if (match[1] !== char) { return false; }
      context.set('string-begin', null);
      return match;
    },
    final: true
  }
], 'string');

const LEXER_BALANCE_BRACES = new Lexer([
  {
    name: 'punctuation',
    pattern: /\{/,
    inside: {
      lexer: LEXER_BALANCE_BRACES
    }
  },
  {
    name: 'punctuation',
    pattern: /\}/,
    final: true
  }
], 'balance-braces');

const LEXER_JSX_INTERPOLATION = new Lexer([
  {
    name: 'punctuation',
    pattern: /\{/,
    inside: {
      lexer: LEXER_BALANCE_BRACES
    }
  },
  {
    name: 'interpolation-end',
    pattern: /\}/,
    final: true
  }
], 'jsx-interpolation');

const LEXER_ATTRIBUTE_VALUE = new Lexer([
  {
    name: 'interpolation-begin',
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
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      context.set('string-begin', match[1]);
      return match;
    },
    inside: {
      name: 'string',
      lexer: LEXER_STRING
    }
  }
], 'attribute-value');

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

const LEXER_JSX_CLOSING_TAG = new Lexer([
  {
    name: 'tag tag-html',
    pattern: /^[a-z]+(?=&gt;|>)/
  },
  {
    name: 'tag tag-jsx',
    pattern: /^[A-Z][A-Za-z0-9_$\.]*(?=&gt;|>)/
  },
  {
    name: 'punctuation',
    pattern: /^\s*(?:>|&gt;)/,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      let depth = context.get('jsx-tag-depth');
      if (depth < 1) { throw new Error(`Depth error!`); }
      depth--;
      context.set('jsx-tag-depth', depth);
      // console.warn(`[depth] Depth set to`, depth);
    },
    final: true
  }
], 'jsx-closing-tag');

// Define the "inside" of a tag as the part after the name and before the
// closing angle bracket.
const LEXER_INSIDE_TAG = new Lexer([
  {
    name: 'punctuation',
    pattern: /^\s*\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    }
  },
  {
    name: 'attribute-name',
    pattern: /^\s*[a-zA-Z][a-zA-Z0-9_$]+(?=\=)/,
    after: {
      name: 'attribute-separator',
      lexer: LEXER_ATTRIBUTE_SEPARATOR
    }
  },
  {
    // Self-closing tag.
    name: 'punctuation',
    pattern: /^\s*\/(?:>|&gt;)/,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      if (context.get('is-root')) {
        return false;
      }
      context.set('is-opening-tag', null);
      // Don't increment the tag depth.
    },
    final: (context) => !context.get('is-root')
  },
  {
    // The end of a tag (opening or closing).
    name: 'punctuation',
    pattern: /^\s*(>|&gt;)/,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      if ( context.get('only-opening-tag') ) {
        return false;
      }
      let wasOpeningTag = context.get('is-opening-tag');
      let depth = context.get('jsx-tag-depth');
      depth += wasOpeningTag ? 1 : -1;

      // This rule is designed to match situations where we're inside at least
      // one JSX tag, because in those cases we're still in JSX mode. So return
      // false if the new depth is now zero. The next rule will catch this.
      if (depth === 0) { return false; }
      // console.warn(`[depth] Depth is now`, depth);
      context.set('jsx-tag-depth', depth);
      context.set('is-opening-tag', null);
    },
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

const LEXER_WITHIN_TAG = new Lexer([
  {
    include: () => LEXER_TAG_START
  },
  {
    include: () => LEXER_TAG_END,
  },
  {
    name: 'punctuation',
    pattern: /\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    }
  },
], 'within-tag');

const LEXER_TAG_NAME = new Lexer([
  {
    name: 'tag tag-html',
    pattern: /^[a-z]+(?=\s|(?:>|&gt;))/,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      context.set('is-opening-tag', true);
      let depth = context.get('jsx-tag-depth');
      if (typeof depth !== 'number') {
        // console.warn(`[depth] Depth set to`, 0);
        context.set('jsx-tag-depth', 0);
      }
    },
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
    pattern: /^[A-Z][A-Za-z0-9_$\.]*(?=\s|(?:>|&gt;))/,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      context.set('is-opening-tag', true);
      let depth = context.get('jsx-tag-depth');
      if (typeof depth !== 'number') {
        // console.warn(`[depth] Depth set to`, 0);
        context.set('jsx-tag-depth', 0);
      }
    },
    after: {
      name: 'jsx-tag-contents',
      lexer: LEXER_INSIDE_TAG
    }
  }
], 'tag-name');

const LEXER_TAG_END = new Lexer([
  // The start of a closing tag. Final.
  {
    name: 'punctuation',
    pattern: /(?:<|&lt;)\/(?=[A-Za-z])/,
    test: (pattern, text, context) => {
      let depth = context.get('jsx-tag-depth');
      let match = pattern.exec(text);
      if (!match) { return false; }
    },
    inside: {
      name: 'element jsx-element',
      lexer: LEXER_JSX_CLOSING_TAG
    },
    final: true
  }
], 'tag-end');

const LEXER_TAG = new Lexer([
  {
    name: 'punctuation',
    pattern: /^\s*\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    }
  },
  {
    include: () => LEXER_TAG_END
  },
  // The start of an opening tag.
  {
    name: 'punctuation punctuation-wtf',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    after: {
      name: 'tag',
      lexer: () => LEXER_TAG_NAME
    }
  }
], 'tag');

const LEXER_TAG_START = new Lexer([
  {
    name: 'punctuation',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    after: {
      name: 'tag',
      lexer: LEXER_TAG_NAME
    }
  }
], 'tag-start');

const LEXER_TAG_OPEN_START = new Lexer([
  {
    name: 'punctuation',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      context.set('only-opening-tag', true);
    },
    after: {
      name: 'tag',
      lexer: LEXER_TAG_NAME
    },
    final: true
  }
], 'tag-open-start');

const LEXER_TAG_ROOT = new Lexer([
  {
    name: 'punctuation',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      context.set('is-root', true);
    },
    after: {
      name: 'tag',
      lexer: LEXER_TAG_NAME
    }
  }
], 'tag-root');


// TODO:
// * Generators

let ESCAPES = new Grammar({
  escape: {
    pattern: /\\./
  }
});

let REGEX_INTERNALS = new Grammar({
  escape: {
    pattern: (/\\./)
  },

  'exclude from group begin': {
    pattern: (/(\\\()/),
    replacement: "#{1}"
  },

  'group-begin': {
    pattern: (/(\()/),
    replacement: '<b class="group">#{1}'
  },

  'group-end': {
    pattern: (/(\))/),
    replacement: '#{1}</b>'
  }
});

let INSIDE_TEMPLATE_STRINGS = new Grammar({
  'interpolation': {
    pattern: /(\$\{)(.*?)(\})/,
    // replacement: "<span class='#{name}'><span class='punctuation interpolation-start'>#{1}</span><span class='interpolation-contents'>#{2}</span><span class='punctuation interpolation-end'>#{3}</span></span>",
    captures: {
      '1': 'punctuation interpolation-start',
      '2': MAIN,
      '3': 'punctuation interpolation-end'
    },
    wrapReplacement: true,
    // before: (r, context) => {
    //   r[2] = MAIN.parse(r[2], context);
    // }
  }
}).extend(ESCAPES);

const PARAMETERS = new Grammar({
  'parameter parameter-with-default': {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,
    // replacement: compact(`
    //   <span class="parameter">#{1}#{2}#{3}</span>
    // `),
    captures: {
      '1': 'variable',
      '2': 'operator',
      '3': () => VALUES
    }
  },

  'keyword operator': {
    pattern: /\.{3}/
  },

  'variable parameter': {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  }
});

let STRINGS = new Grammar({
  'string string-template embedded': {
    pattern: /(`)((?:[^`\\]|\\\\|\\.)*)(`)/,
    captures: {
      '2': INSIDE_TEMPLATE_STRINGS
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
    },
    // wrapReplacement: true,
    // before: (r, context) => {
    //   console.log('uhhh:', r);
    //   r[2] = ESCAPES.parse(r[2], context);
    // }
  },

  'string string-double-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-quotes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-non-quote pair.
    pattern: /(")((?:[^"\\]|\\\\|\\[^"])*)(")/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    // captures: {
    //   '2': ESCAPES
    // },
    // wrapReplacement: true,
    before: (r, context) => {
      r[2] = ESCAPES.parse(r[2], context);
    }
  }
});

let JSX_INTERPOLATION = new Grammar({
  'embedded jsx-interpolation': {
    pattern: /(\{)([\s\S]*)(\})/,
    index (match) {
      return balance(match, '}', '{');
    },
    // replacement: compact(`
    //   <span class='#{name}'>
    //     <span class='punctuation embedded-start'>#{1}</span>
    //     #{2}
    //     <span class='punctuation embedded-end'>#{3}</span>
    //   </span>
    // `),
    captures: {
      '1': 'punctuation embedded-start',
      '2': () => JSX_EXPRESSIONS,
      '3': 'punctuation embedded-end'
    },
    wrapReplacement: true,
    // before (r, context) {
    //   r[2] = JSX_EXPRESSIONS.parse(r[2], context);
    //   // r[2] = context.highlighter.parse(r[2], 'javascript-jsx', context);
    //   console.log('[ic] parsed:', r[2]);
    // }
  }
});

let JSX_ATTRIBUTES = new Grammar({
  string: {
    pattern: /('[^']*[^\\]'|"[^"]*[^\\]")/
  },

  attribute: {
    pattern: /\b([a-zA-Z-:]+)(=)/,
    replacement: compact(`
      <span class='attribute'>
        <span class='#{name}'>#{1}</span>
        <span class='punctuation'>#{2}</span>
      </span>
    `)
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
    index: (text) => {
      return balanceByLexer(text, LEXER_TAG_ROOT);
    },
    replacement: compact(`
      <span class='jsx'>#{0}</span>
    `),
    before: (m) => {
      m[0] = JSX_CONTENTS.parse(m[0]);
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
  'opening tag without attributes': {
    pattern: VerboseRegExp`
      (<|&lt;) # 1: opening angle bracket
      ([a-zA-Z_$][a-zA-Z0-9_$\.]*) # 2: any valid identifier as a tag name
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
      ([a-zA-Z_$][a-zA-Z0-9_$\.]*) # 2: any valid identifier as a tag name
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
      let index = balanceByLexer(text, LEXER_TAG_OPEN_START);
      return index;
    },
    before (r, context) {
      r.name = `jsx-element element element-opening`;
      // We grab the last character before the closing angle bracket because an
      // optional match won't work correctly after the greedy content match. If
      // that last character is a slash, we keep it as a separate token;
      // otherwise, we move it back to the end of capture group 4.
      r[2] = handleJsxOrHtmlTag(r[2]);
      if (r[5]) {
        if (r[5]=== '/') {
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
      ((?:<|&lt;)\/) # opening angle bracket and slash
      ([a-zA-Z_$][a-zA-Z0-9_$\.]*\s*) # any valid identifier as a tag name
      (&gt;|>) # closing angle bracket
    `,
    replacement: compact(`
      <span class='jsx-element element element-closing'>
        <span class='punctuation'>#{1}</span>
        <span class='tag'>#{2}</span>
        <span class='punctuation'>#{3}</span>
      </span>
    `)
  }
});

let JSX_CONTENTS = new Grammar({}).extend(JSX_INTERPOLATION, JSX_TAGS);

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

VALUES.extend(STRINGS);
VALUES.extend({
  comment: {
    pattern: /(\/\/[^\n]*\n)|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
  },

  regexp: {
    // No such thing as an empty regex, so we can get away with requiring at
    // least one not-backslash character before the end delimiter.
    pattern: /(\/)(.*?[^\\])(\/)([mgiy]*)/,
    // replacement: "<span class='regexp'>#{1}#{2}#{3}#{4}</span>",
    captures: {
      '2': REGEX_INTERNALS,
      '4': 'keyword regexp-flags'
    },
    wrapReplacement: true
    // before: (r, context) => {
    //   r[2] = REGEX_INTERNALS.parse(r[2], context);
    //   if (r[4]) r[4] = wrap(r[4], 'keyword regexp-flags');
    // }
  }
});

let DESTRUCTURING = new Grammar({
  alias: {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,
    // replacement: "<span class='entity'>#{1}</span>#{2}#{3}#{4}",
    captures: {
      '1': 'entity'
    }
  },

  variable: {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  }
});

let IMPORT_SPECIFIERS = new Grammar({
  ordinary: {
    pattern: VerboseRegExp`
      (^|,)(\s*) # 1: beginning of string or comma
      ([A-Za-z_$][A-Za-z_$0-9]*) # 2: identifier
      (\s*)
      (?=$|,) # followed by end of string or comma
    `,
    // replacement: compact(`
    //   #{1}#{2}
    //   <span class='variable variable-import'>#{3}</span>
    // `),
    captures: {
      '1': 'punctuation',
      '3': 'variable variable-import'
    }
  },

  'default as': {
    pattern: VerboseRegExp`
      (^|,) # 1: beginning of string or comma
      (\s*) # 2: space
      (default) # 3: "default"
      (\s*) # 4: space
      (as) # 5: "as"
      (\s*) # 6: space
      ([A-Za-z_$][A-Za-z_$0-9]*) # 7: identifier
      (\s*)
      (?=$|,) # followed by end of string or comma
    `,
    captures: {
      '1': 'punctuation',
      '3': 'keyword keyword-default',
      '5': 'keyword keyword-as',
      '7': 'variable variable-import'
    }
    // replacement: compact(`
    //   #{1}
    //   <span class='keyword keyword-default'>#{2}</span>#{3}
    //   <span class='keyword keyword-as'>#{4}</span>#{5}
    //   <span class='variable variable-import'>#{6}</span>#{7}
    // `)
  }
});

let IMPORT_SPECIFIER = new Grammar({
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
    // replacement: compact(`
    //   #{1}<span class='variable variable-import'>#{2}</span>#{3}
    // `)
  },
  specifiers: {
    pattern: VerboseRegExp`
      (\{)(\s*) # opening brace
      ([^}]+) # stuff in the middle
      (}) # closing brace
    `,
    // replacement: "#{1}#{2}#{3}#{4}",
    captures: {
      '3': IMPORT_SPECIFIERS
    }
    // before (r, context) {
    //   r[3] = IMPORT_SPECIFIERS.parse(r[3], context);
    // }
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
      (^\s*)
      (import)(\s*)
      (?=\`|'|")
      (.*?)
      (?=;|\n)
    `,
    captures: {
      '2': 'keyword keyword-import',
      '4': () => STRINGS
    },
    replacement: compact(
      `#{1}#{2}#{3}#{4}`
    )
  }
});

let OPERATORS = new Grammar({
  'keyword operator': {
    pattern: /\|\||&&|&amp;&amp;|!==?|={1,3}|>=?|<=?|\+\+|\+|--|-|\*|[\*\+-\/]=|\?|\.{3}|\b(?:instanceof|in|of)\b/
  }
});

let ARROW_FUNCTION_PARAMETERS = new Grammar({
  'params within parens': {
    pattern: VerboseRegExp`
      (\() # opening paren
      ([^)]) # contents of params
      (\)) # closing paren
    `,
    replacement: compact(`
      <span class='params'>
        <span class="punctuation">#{1}</span>
        #{2}
        <span class="punctuation">#{3}</span>
      </span>
    `),
    before: (m, context) => {
      m[2] = PARAMETERS.parse(m[2], context);
    }
  },
  'variable variable-parameter': {
    pattern: /[a-zA-Z_$][a-zA-Z0-9_$]*/
  }
});

let ARROW_FUNCTIONS = new Grammar({
  'multiline arrow function': {
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
      (\{) # opening brace
    `,
    index: (text) => {
      return balance(text, '}', '{');
    },
    before: (m, context) => {
      m[1] = ARROW_FUNCTION_PARAMETERS.parse(m[1], context);
      m[1] = wrap(m[1], 'temp');
    },
    replacement: compact(`
      <span class="function function-arrow">
        #{1}
        #{2}
        <span class="operator">#{3}</span>
        #{4}
        <span class="punctuation">#{5}</span>
      </span>
    `)
  },
  'multiline arrow function wrapped in parens': {
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
      (\() # opening paren
      ([\s\S]*) # contents of function
      (\)) # closing paren
    `,
    index: (text) => {
      return balance(text, ')', '(');
    },
    before: (m, context) => {
      m[1] = ARROW_FUNCTION_PARAMETERS.parse(m[1], context);
      m[6] = MAIN.parse(m[6]);
    },
    replacement: compact(`
      <span class="function function-arrow">
        #{1}
        #{2}
        <span class="operator">#{3}</span>
        #{4}
        <span class="punctuation">#{5}</span>
        #{6}
        <span class="punctuation">#{7}</span>
      </span>
    `)
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
    before: (m, context) => {
      m[1] = ARROW_FUNCTION_PARAMETERS.parse(m[1], context);
    },
    replacement: compact(`
      <span class="function function-arrow">
        #{1}
        #{2}
        <span class="operator">#{3}</span>
        #{4}
      </span>
    `)
  },
});

let JSX_EXPRESSIONS = new Grammar({});
JSX_EXPRESSIONS.extend(JSX_TAGS);
JSX_EXPRESSIONS.extend(VALUES);
JSX_EXPRESSIONS.extend(ARROW_FUNCTIONS);
JSX_EXPRESSIONS.extend(OPERATORS);

let MAIN = new Grammar('javascript-jsx', {}, { alias: ['react'] });
MAIN.extend(JSX_TAG_ROOT);
MAIN.extend(IMPORTS);
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
      r[1] = PARAMETERS.parse(r[1], context);
      r[3] = wrap(r[3], 'keyword operator');
    }
  },

  'meta: fat arrow function, args in parens': {
    pattern: VerboseRegExp`
      (\()            # 1: open paren
      ([^\)]*?)       # 2: raw params
      (\))            # 3: close paren
      (\s*)           # 4: space
      (=(?:&gt;|>))   # 5: fat arrow
    `,
    replacement: "#{1}#{2}#{3}#{4}#{5}",
    before: (r, context) => {
      r[2] = PARAMETERS.parse(r[2], context);
    }
  },

  'keyword keyword-new': {
    pattern: (/new(?=\s[A-Za-z_$])/)
  },

  'variable variable-declaration': {
    pattern: (/\b(var|let|const)(\s+)([A-Za-z_$][_$A-Z0-9a-z]*?)(?=\s|=|;|,)/),
    replacement: "<span class='storage'>#{1}</span>#{2}<span class='#{name}'>#{3}</span>"
  },

  'variable variable-assignment': {
    pattern: /(\s+|,)([A-Za-z_$][\w\d$]*?)(\s*)(?==)(?!=(?:>|&gt;))/,
    replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}",
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
      let pairs = { '{': '}', '[': ']' };
      let match = (/(let|var|const|)(\s+)(\{|\[)/).exec(text);
      let char = match[3], paired = pairs[char];
      let index = balance(text, paired, char);
      // Once we've balanced braces, find the next equals sign.
      let equals = text.indexOf('=', index);
      let subset = text.slice(0, equals + 1);
      return equals;
    },
    replacement: "<span class='storage'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
    before: (r, context) => {
      r[4] = DESTRUCTURING.parse(r[4], context);
      r[7] = wrap(r[7], 'operator');
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
    replacement: "<span class='keyword keyword-function'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
    before: function(r, context) {
      if (r[3]) r[3] = wrap(r[3], 'entity');
      r[6] = PARAMETERS.parse(r[6], context);
      return r;
    }
  },

  'function function-literal-shorthand-style': {
    pattern: VerboseRegExp`
      (^\s*)
      (get|set|static)? # 1: annotation
      (\s*)             # 2: space
      ([a-zA-Z_$][a-zA-Z0-9$_]*) # 3: function name
      (\s*)             # 4: space
      (\()              # 5: open parenthesis
      (.*?)             # 6: raw params
      (\))              # 7: close parenthesis
      (\s*)             # 8: space
      (\{)              # 9: opening brace
    `,
    captures: {
      '2': 'storage',
      '4': 'entity',
      '7': PARAMETERS
    },
  },

  'meta: function shorthand with computed property name': {
    pattern: VerboseRegExp`
      (]) # closing bracket signifying possible computed property name
      (\s*) # optional space
      (\() # open paren
      (.*?) # raw params
      (\)) # close paren
      (\s*) # optional space
      (\{) # opening brace
    `,
    replacement: compact(`
      #{1}#{2}#{3}#{4}#{5}#{6}#{7}
    `),
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
      ([a-zA-Z_?\.$]+\w*) # variable name
      (\s*)
      (=)
      (\s*)
      (function)
      (\s*)
      (\()
      (.*?)       # raw params
      (\))
    `,
    replacement: "#{1}#{2}#{3}#{4}#{5}#{6}#{7}#{8}#{9}",
    captures: {
      '1': 'variable',
      '5': 'keyword',
      '8': PARAMETERS
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
    index: (match) => {
      return balance(
        match, '}', '{',
        { startIndex: match.indexOf('{') + 1 }
      );
    },
    replacement: compact(`
      <span class="storage">#{1}</span>
      #{2}#{3}
      #{4}#{5}#{6}#{7}
      #{8}#{9}
    `),
    captures: {
      '1': 'storage',
      '3': 'entity entity-class',
      '5': 'storage',
      '7': 'entity entity-class entity-superclass'
    }
    // before (r) => {
    //   if (r[3]) r[3] = wrap(r[3], 'entity entity-class');
    //   if (r[5]) r[5] = wrap(r[5], 'storage');
    //   if (r[7]) r[7] = wrap(r[7], 'entity entity-class entity-superclass');
    // }
  },

  storage: {
    pattern: /\b(?:var|let|const|class|extends|async)\b/
  },

  keyword: {
    pattern: /\b(?:try|catch|finally|if|else|do|while|for|break|continue|case|switch|default|return|yield|throw|await)\b/
  }
}).extend(OPERATORS);

export default MAIN;
