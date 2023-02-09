import Grammar from '../grammar.js';
import { c as compact } from '../utils-8b837a1b.js';
import { VerboseRegExp } from '../utils/verbose-regexp.js';
import '../template.js';
import '../context.js';

const INSIDE_STRINGS = new Grammar({
  variable: {
    pattern: /(\$[\d\w_\-]+)\b/
  }
});

const VALUES = new Grammar({
  'meta: unquoted IP address string': {
    pattern: /(\s|^)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\:\d+)?)/,
    captures: {
      '2': 'string string-unquoted string-ip-address'
    }
  },
  'string string-unquoted string-url': {
    pattern: /\bhttps?:\/\/.*?(?=;|\s|$)/
  },
  'meta: unquoted path string': {
    pattern: VerboseRegExp`
      (\s+|^) # preceding space or beginning of line
      (
        (?:[A-Za-z0-9_\-]+)? # possible name before first slash, if a relative path
        \/            # leading path separator
        (?:\\\s|.)+?    # any characters other than spaces, but allowing escaped spaces
        (?=\s|$)      # space or end of string
      )
    `,
    captures: {
      '2': 'string string-unquoted string-path'
    }
  },
  'meta: number': {
    pattern: /(\s|^)(\d[\d\.]*)/,
    captures: {
      '2': 'number number-integer'
    }
  },
  'meta: string': {
    pattern: VerboseRegExp`
      (                 # group 1: whitespace or control characters
        (?:^|[^\\])
        (?:\\\\)*
      )
      (                 # group 2: entire string
        "            # group 3: leading punctuation
        (?:[^"\\]|\\.|\n)*
        "            # group 4: trailing punctuation
        |
        '            # group 5: leading punctuation
        (?:[^'\\]|\\.|\n)*
        '             # group 6: trailing punctuation
      )
    `,
    before (r) {
      r[2] = handleString(r[2]);
    },
    replacement: "#{1}#{2}"
  },
  'variable': {
    pattern: /\$[A-Za-z_][A-Za-z0-9_]*/
  },
  'meta: boolean': {
    pattern: /(\s)(off|on)(?!\S)/,
    captures: {
      '2': 'constant constant-boolean'
    }
  }
});

function handleString (str) {
  let punct = str.charAt(0);
  let contents = INSIDE_STRINGS.parse(str.slice(1, -1));
  return compact(`
    <span class="string string-quoted">
      <span class="punctuation">${punct}</span>
      ${contents}
      <span class="punctuation">${punct}</span>
    </span>
  `);
}

const INSIDE_DIRECTIVES = new Grammar({})
  .extend(VALUES)
  .extend({
    'entity entity-function-with-block': {
      pattern: /^(?:server|location|events|http|upstream|types)(?!\S)/
    },
    'support support-function': {
      pattern: /^\S+/
    }
  });

const MAIN = new Grammar('nginx', {
  'comment comment-line': {
    pattern: /(^|[\s{};])#.*$/
  },

  'meta: directive': {
    pattern: VerboseRegExp`
      (^|\s)
      (
        \w(?:
          [^;{}"'\\\s]|
          \\.|
          "(?:
            [^"\\]|
            \\.
          )*"|
          '(?:
            [^'\\]|
            \\.
          )*'|
          \s+(?:
            \#.*(?!.)|
            (?![\#\s])
          )
        )*?
      )
      (?=\s*[;{])
    `,
    captures: {
      '2': INSIDE_DIRECTIVES
    }
  }
});

export { MAIN as default };
