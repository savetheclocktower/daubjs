import { Grammar, Utils } from '../daub';
const { balanceByLexer, compact, VerboseRegExp } = Utils;
import Lexer from '../lexer';

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
]);

const LEXER_ATTRIBUTE_VALUE = new Lexer([
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
    replacement: compact(`
      <span class='attribute'>
        <span class='#{name}'>#{1}</span>
        <span class='punctuation'>#{2}</span>
      </span>
    `)
  }
});

const MAIN = new Grammar('html', {
  doctype: {
    pattern: /&lt;!DOCTYPE([^&]|&[^g]|&g[^t])*&gt;/
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
    before: (r, context) => {
      if (r[3]) {
        r[3] = ATTRIBUTES.parse(r[3], context);
      }
      r[5] = context.highlighter.parse(r[5], 'javascript', context);
    }
  },

  'tag tag-open': {
    pattern: /((?:<|&lt;))([a-zA-Z0-9:]+\s*)([\s\S]*)(\/)?(&gt;|>)/,
    index: (match, ...args) => {
      return balanceByLexer(match, LEXER_TAG_START);
    },
    replacement: compact(`
      <span class='element element-opening'>
        <span class='punctuation'>#{1}</span>
        <span class='tag'>#{2}</span>#{3}
        <span class='punctuation'>#{4}#{5}</span>
      </span>#{6}
    `),
    before: (r, context) => {
      r[3] = ATTRIBUTES.parse(r[3], context);
    }
  },

  'tag tag-close': {
    pattern: /(&lt;\/)([a-zA-Z0-9:]+)(&gt;)/,
    replacement: compact(`
      <span class='element element-closing'>
        <span class='punctuation'>#{1}</span>
        <span class='tag'>#{2}</span>
        <span class='punctuation'>#{3}</span>
      </span>
    `)
  },

  comment: {
    pattern: /&lt;!\s*(--([^-]|[\r\n]|-[^-])*--\s*)&gt;/
  }
}, { encode: true });

export default MAIN;
