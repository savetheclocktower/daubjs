import { Grammar, Utils } from '../daub';
const { balanceByLexer, compact, VerboseRegExp, wrap } = Utils;
import Lexer from '../lexer';

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
]);

const LEXER_ATTRIBUTE_VALUE = new Lexer([
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
]);

const LEXER_ATTRIBUTE_SEPARATOR = new Lexer([
  {
    name: `punctuation`,
    pattern: /^=/,
    after: {
      name: 'attribute-value',
      lexer: LEXER_ATTRIBUTE_VALUE
    }
  }
]);

const LEXER_TAG = new Lexer([
  {
    name: 'tag tag-html',
    pattern: /^[a-z]+(?=\s)/
  },
  {
    name: 'attribute-name',
    pattern: /^\s*(?:\/)?[a-z]+(?=\=)/,
    after: {
      name: 'attribute-separator',
      lexer: LEXER_ATTRIBUTE_SEPARATOR
    }
  },
  {
    // Self-closing tag.
    name: 'punctuation',
    pattern: /\/(?:>|&gt;)/,
    final: true
  },
  {
    // Opening tag end with middle-of-tag context.
    name: 'punctuation',
    pattern: /(>|&gt;)/,
    final: true
  }
]);

const LEXER_TAG_START = new Lexer([
  {
    name: 'punctuation',
    pattern: /^(?:<|&lt;)/,
    after: {
      name: 'tag',
      lexer: LEXER_TAG
    }
  }
]);

const ATTRIBUTES = new Grammar({
  string: {
    pattern: /('[^']*[^\\]'|"[^"]*[^\\]")/
  },

  attribute: {
    pattern: /\b([a-zA-Z-:]+)(=)/,
    captures: {
      '1': 'attribute-name',
      '2': 'punctuation'
    }
  }
});

const ENTITIES = new Grammar({
  'constant constant-html-entity constant-html-entity-named': {
    pattern: /(&amp;)[a-z]+;/
  },
  'constant constant-html-entity constant-html-entity-numeric': {
    pattern: VerboseRegExp`
      (&amp;)
      \#
      (
        [0-9]+|          # decimal OR
        [xX][0-9a-fA-F]+  # hexadecimal
      )
      ;
    `
  }
});

const MAIN = new Grammar('html', {
  doctype: {
    pattern: /(?:<|&lt;)!DOCTYPE([^&]|&[^g]|&g[^t])*(?:>|&gt;)/
  },

  'embedded embedded-javascript': {
    pattern: VerboseRegExp`
      (&lt;|<)(script|SCRIPT) # 1, 2: opening script element
      (\s+.*?)?               # 3: space and optional attributes
      (&gt;|>)                # 4: end opening element
      ([\s\S]*?)              # 5: contents
      ((?:&lt;|<)\/)(script|SCRIPT)(&gt;|>) # 6, 7, 8: closing script element
    `,
    replacement: compact(`
      <span class='element element-opening'>
        <span class='punctuation'>#{1}</span>
        <span class='tag'>#{2}</span>#{3}
        <span class='punctuation'>#{4}</span>
      </span>
        #{5}
      <span class='element element-closing'>
        <span class='punctuation'>#{6}</span>
        <span class='tag'>#{7}</span>
        <span class='punctuation'>#{8}</span>
      </span>
    `),
    captures: {
      '3': ATTRIBUTES
    },
    before: (r, context) => {
      r[5] = context.highlighter.parse(r[5], 'javascript', context);
    }
  },

  'element element-opening': {
    pattern: VerboseRegExp`
      (<|&lt;)       # 1: opening angle bracket
      ([a-zA-Z\-:]+)   # 2: any tag name (hyphens are allowed in web component tag names)
      (?:
        (\s+)          # 3: space
        ([\s\S]*)      # 4: middle-of-tag content
      )?
      (.)            # 5: lsat character before closing bracket
      (&gt;|>)       # 6: closing bracket
    `,
    replacement: compact(`
      <span class='#{name}'>
        <span class='punctuation'>#{1}</span>
        <span class='tag tag-html'>#{2}</span>
        #{3}#{4}#{5}
        <span class='punctuation'>#{6}</span>
      </span>
    `),
    index (match, ...args) {
      return balanceByLexer(match, LEXER_TAG_START);
    },
    before (r, context) {
      // Find the first group before group 5 that has content.
      let i = 4;
      while (r[i] === undefined) { i--; }
      if (r[5]) {
        if (r[5] === '/') {
          // The slash should be punctuation.
          r.name = r.name.replace('element-opening', 'element-self');
          r[5] = wrap(r[5], 'punctuation');
        } else {
          // It isn't a slash, so join it with the group it would've otherwise
          // been a part of.
          console.error('joining with group:', i, r[i]);
          r[i] += r[5];
          r[5] = '';
        }
      }
      if (r[4]) { r[4] = ATTRIBUTES.parse(r[4], context); }
    }
  },

  'element element-closing': {
    pattern: /((?:<|&lt;)\/)([a-zA-Z:\-]+)(>|&gt;)/,
    captures: {
      '1': 'punctuation',
      '2': 'tag tag-html',
      '3': 'punctuation'
    },
    wrapReplacement: true
  },

  comment: {
    pattern: /(?:<|&lt;)!\s*(--([^-]|[\r\n]|-[^-])*--\s*)(?:>|&gt;)/
  }
}, { encode: true });

MAIN.extend(ENTITIES);

export default MAIN;
