import Grammar from '#internal/grammar';
import {
  balance,
  balanceByLexer,
  balanceAndHighlightByLexer,
  compact,
  serializeLexerFragment,
  VerboseRegExp,
  wrap
} from '#internal/utils';
import Lexer from '#internal/lexer';

const LEXER_STRING = new Lexer([
  {
    name: 'string-escape',
    pattern: /\\./
  },
  {
    name: 'string-end',
    pattern: /('|")/g,
    test: (match, text, context) => {
      let char = context.get('string-begin');
      if (match[1] !== char) { return false; }
      return match;
    },
    win: (match, text, context) => {
      context.set('string-begin', null);
    },
    final: true
  }
], 'string', {
  scopes: 'string',
  highlight: (tokens, context) => {
    let last = tokens.pop();
    let serialized = serializeLexerFragment(tokens);
    let highlighted = HTML_STRINGS.parse(serialized, context);
    return [highlighted, last];
  }
});

const LEXER_ATTRIBUTE_VALUE = new Lexer([
  {
    name: 'string-begin',
    pattern: /^\s*('|")/,
    win: (match, text, context) => {
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
    name: 'punctuation',
    pattern: /^=/,
    after: {
      name: 'attribute-value',
      lexer: LEXER_ATTRIBUTE_VALUE
    }
  }
], 'attribute-separator');

const LEXER_TAG = new Lexer([
  {
    // Match custom elements (hyphen in name) before non-custom elements.
    name: 'tag tag-html tag-html-custom',
    pattern: /^[a-zA-Z][a-zA-Z-:]*(?=\s|>|&gt;)/
  },
  {
    name: 'tag tag-html',
    pattern: /^[a-zA-Z][a-zA-Z:]*(?=\s|>|&gt;)/
  },
  {
    name: 'attribute-name',
    pattern: /^\s*(?:\/)?[a-zA-Z][a-zA-Z-:]*(?=\=)/,
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
], 'tag');

const LEXER_TAG_START = new Lexer([
  {
    name: 'punctuation',
    pattern: /^(?:<|&lt;)/,
    after: {
      name: 'tag',
      lexer: LEXER_TAG
    },
    final: true
  }
], 'tag-start', { scopes: 'element element-opening' });

const PHP_DIRECTIVES = new Grammar({
  'meta: php directive': {
    name: 'embedded',
    pattern: /((?:<|&lt;)\?(?:php)?)([\s\S]*?)(\?(?:>|&gt;))/,
    captures: {
      '1': 'punctuation punctuation-start',
      '2': () => PHP,
      '3': 'punctuation punctuation-end'
    },
    wrapReplacement: true
  }
});

const HTML_STRINGS = new Grammar({
  escape: {
    pattern: /\\./
  }
});

HTML_STRINGS.extend(PHP_DIRECTIVES);

const ATTRIBUTES = new Grammar({
  'meta: empty single-quoted string': {
    name: 'string string-single-quoted',
    pattern: /(')(')/
  },
  'meta: empty double-quoted string': {
    name: 'string string-double-quoted',
    pattern: /(")(")/
  },

  'string string-double-quoted': {
    pattern: (/(")(.*?[^\\])(")/),
    wrapReplacement: true,
    captures: {
      '2': () => HTML_STRINGS
    }
  },

  'string string-single-quoted': {
    pattern: (/(')(.*?[^\\])(')/),
    wrapReplacement: true,
    captures: {
      '2': () => HTML_STRINGS
    }
  },

  attribute: {
    pattern: /\b([a-zA-Z][a-zA-Z-:]*)(=)/,
    captures: {
      '1': 'attribute-name',
      '2': 'punctuation'
    }
  }
});

const HTML_ENTITIES = new Grammar({
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

const MAIN = new Grammar('php', {}, { encode: true });

MAIN.extend(PHP_DIRECTIVES);

MAIN.extend({
  'embedded embedded-javascript': {
    pattern: VerboseRegExp`
      (&lt;|<)(script|SCRIPT) # 1, 2: opening script element
      (\s+.*?)?               # 3: space and optional attributes
      (&gt;|>)                # 4: end opening element
      ([\s\S]*?)              # 5: contents
      ((?:&lt;|<)\/)(script|SCRIPT)(&gt;|>) # 6, 7, 8: closing script element
    `,
    index (text, context) {
      return balanceByLexer(text, LEXER_TAG_START);
    },
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
      if (context.highlighter) {
        r[5] = context.highlighter.parse(r[5], 'javascript', context);
      }
    }
  },

  'element element-opening': {
    pattern: VerboseRegExp`
      (<|&lt;)       # 1: opening angle bracket
      ([a-zA-Z][a-zA-Z-:]*)   # 2: any tag name (hyphens are allowed in web component tag names)
      (?:
        (\s+)          # 3: space
        ([\s\S]*)      # 4: middle-of-tag content
      )?
      (.)            # 5: last character before closing bracket
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
    index (match, context) {
      // return balanceByLexer(match, LEXER_TAG_START);
      let { index, highlighted } = balanceAndHighlightByLexer(match, LEXER_TAG_START, context);
      context.set('lexer-highlighted', highlighted);
      return index;
    },
    // before (r, context) {
    //   // Find the first group before group 5 that has content.
    //   let i = 4;
    //   while (r[i] === undefined) { i--; }
    //   if (r[5]) {
    //     if (r[5] === '/') {
    //       // The slash should be punctuation.
    //       r.name = r.name.replace('element-opening', 'element-self');
    //       r[5] = wrap(r[5], 'punctuation');
    //     } else {
    //       // It isn't a slash, so join it with the group it would've otherwise
    //       // been a part of.
    //       r[i] += r[5];
    //       r[5] = '';
    //     }
    //   }
    //   if (r[4]) { r[4] = ATTRIBUTES.parse(r[4], context); }
    // },
    after (text, context) {
      let highlighted = context.get('lexer-highlighted');
      context.set('lexer-highlighted', false);
      return highlighted || text;
    }
  },

  'element element-closing element-closing-custom': {
    pattern: /((?:<|&lt;)\/)([a-zA-Z:\-]+)(>|&gt;)/,
    captures: {
      '1': 'punctuation',
      '2': 'tag tag-html tag-html-custom',
      '3': 'punctuation'
    },
    wrapReplacement: true
  },

  'element element-closing': {
    pattern: /((?:<|&lt;)\/)([a-zA-Z:]+)(>|&gt;)/,
    captures: {
      '1': 'punctuation',
      '2': 'tag tag-html',
      '3': 'punctuation'
    },
    wrapReplacement: true
  },

  //  /((?:<|&lt;)!)(DOCTYPE)(\s+)(html)([\s\S]*?)?(>|&gt;)/

  'element element-doctype': {
    pattern: VerboseRegExp`
      ((?:<|&lt;)!) # 1: opening punctuation
      (DOCTYPE)     # 2
      (\s+)         # 3
      (html)        # 4
      ([\s\S]*?)    # 5: optional stuff
      (>|&gt;)      # 6: closing punctuation
    `,
    captures: {
      '1': 'punctuation',
      '2': 'keyword special',
      '4': 'keyword special',
      '5': ATTRIBUTES,
      '6': 'punctuation'
    },
    wrapReplacement: true
  },

  comment: {
    pattern: /(?:<|&lt;)!\s*(--([^-]|[\r\n]|-[^-])*--\s*)(?:>|&gt;)/
  }
});

MAIN.extend(HTML_ENTITIES);

const PHP = new Grammar('php', {});

const REGEX_INTERNALS = new Grammar({
  escape: {
    pattern: /\\./
  },

  'meta: exclude from group begin': {
    pattern: /\\\(/,
    replacement: "#{0}"
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

const PHP_STRINGS = new Grammar({
  'constant constant-escape': {
    pattern: /\\./
  },

  'variable with braces': {
    name: 'variable variable-interpolation',
    pattern: /\$+\{\w+\}/
  },

  'variable without braces': {
    name: 'variable variable-interpolation',
    pattern: /\$+(?:\w+\b|(?=\{))/
  }
});

const VALUES = new Grammar({
  'constant constant-boolean': {
    pattern: /\b(?:false|true)\b/
  },

  'number': {
    pattern: /\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/
  },

  variable: {
    pattern: /\$+(?:\w+\b|(?=\{))/
  },

  'constant constant-named': {
    pattern: /\b[A-Z_]+\b/
  },

  'string string-double-quoted': {
    pattern: (/(")(.*?[^\\])(")/),
    wrapReplacement: true,
    captures: {
      '1': 'punctuation punctuation-start',
      '2': () => PHP_STRINGS,
      '3': 'punctuation punctuation-end'
    }
  },

  'string string-single-quoted': {
    pattern: /(')([^']*?)(')/
  }

});

const FUNCTION_PARAMS = new Grammar({
  'variable variable-parameter': {
    pattern: /\$+(?:\w+\b|(?=\{))/
  },

  'operator': {
    pattern: /=/
  }
});

FUNCTION_PARAMS.extend(VALUES);


PHP.extend({
  // 'embedded': {
  //   pattern: /<?(?:php)?(.*?)?>/
  // },

  // 'meta: embedded open': {
  //   name: 'xembedded',
  //   pattern: /(?:<|&lt;)\?(?:php)?/,
  //   replacement: `<b class="#{name}"><span class="embedded-start">#{0}</span>`
  // },
  //
  // 'meta: embedded end': {
  //   pattern: /\?(?:>|&gt;)/,
  //   replacement: `<span class="embedded-end">#{0}</span></b>`
  // },
  //
  'meta: preg_* regexps': {
    pattern: /\b(preg_[a-z_]+)(\s*)(\()(['"])([\s\S]+)(\4)/,
    index (text, context, allMatches) {
      let quote = allMatches[4];
      let delim = allMatches[5].substring(0, 1);
      let pairs = { '(': ')', '{': '}', '[': ']' };
      let pairedDelim = pairs[delim] || delim;

      // Find the index of the paired regexp delimiter…
      let delimEndIndex = balance(text, pairedDelim, delim, {
        startIndex: text.indexOf(quote) + 2,
        considerEscapes: false
      });

      // …then find the first quote character after that.
      return text.indexOf(quote, delimEndIndex);
    },

    before (m, context) {
      m[5] = wrap(m[5], 'regexp');
    },
    captures: {
      '3': 'punctuation punctuation-start',
      '4': 'string',
      '5': () => REGEX_INTERNALS,
      '6': 'string'
    }
  },

  'meta: function definition': {
    pattern: /\b(function)(\s+)([a-z_]\w*)(\s*)(\()([\s\S]*)(\))/,
    index (text, context) {
      return balance(text, ')', '(', { startIndex: text.indexOf('(') });
    },
    captures: {
      '1': 'keyword keyword-function',
      '3': 'entity entity-function',
      '5': 'punctuation punctuation-start',
      '6': () => FUNCTION_PARAMS,
      '7': 'punctuation punctuation-end'
    }
  },

  comment: {
    pattern: /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/
  }
});

PHP.extend(VALUES);

PHP.extend({
  'keyword': {
    pattern: /\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|never|new|or|parent|print|private|protected|public|readonly|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__halt_compiler)\b/
  },

  operator: {
    pattern: /(?:<|&lt;)?=(?:>|&gt;)|\?\?=?|\.{3}|\??-(?:>|&gt;)|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||(<<|&lt;&lt;)|(>>|&gt;&gt;)|[?~]|(?:<|&lt;)=?|(?:>|&gt;)=?|[/^|%*&.+-]=?/
  }
});

export default MAIN;
