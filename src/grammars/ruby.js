import { Utils, Grammar } from '../daub';

const { balance, compact, VerboseRegExp, wrap } = Utils;

function includes (str, pattern) {
  return str.indexOf(pattern) > -1;
}

function hasOnlyLeftBrace (part) {
  return includes(part, '{') && !includes(part, '}');
}

function findEndOfHash (allParts, startIndex) {
  let parts = allParts.slice(startIndex);

  // Join the parts together so we can search one string to find the balanced
  // brace.
  let str = parts.join('');
  let index = balance(
    str, '}', '{',
    { stackDepth: 1 }
  );
  if (index === -1) { return; }

  // Loop through the parts until we figure out which part that balance brace
  // belongs to.
  let totalLength = 0;
  for (let i = startIndex; i < allParts.length; i++) {
    totalLength += allParts[i].length;
    if (totalLength >= index) { return i; }
  }
}

function rejoinHash (parts, startIndex, endIndex) {
  let result = [];
  for (let i = startIndex; i <= endIndex; i++)
    result.push(parts[i]);
  return result.join(',');
}

// Syntax is permissive enough in Ruby that it's quite hard to parse parameters
// as a group. Much easier to try to split them and parse each one individually.
function parseParameters (str, grammar, context) {
  if (!grammar) grammar = PARAMETERS;

  let rawParts = str.split(/,/), parameters = [];
  for (let i = 0, rawPart; i < rawParts.length; i++) {
    rawPart = rawParts[i];
    if ( hasOnlyLeftBrace(rawPart) ) {
      // We've split in the middle of a hash. Find the end of the hash and
      // rejoin.
      let endIndex = findEndOfHash(rawParts, i + 1);
      let rejoined = rejoinHash(rawParts, i, endIndex);

      parameters.push(rejoined);
      i = endIndex;
    } else {
      parameters.push(rawPart);
    }
  }

  return parameters.map((p) => grammar.parse(p, context));
}


const PARAMETERS = new Grammar({
  'meta: parameter with default': {
    pattern: (/^(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*)/),
    captures: {
      '2': 'variable variable-parameter',
      '3': 'keyword operator',
      '4': () => VALUES
    }
  },

  'meta: variable': {
    pattern: (/^(\s*)([A-Za-z0-9_]+)$/),
    captures: {
      '2': 'variable variable-parameter'
    }
  }
});

// Block parameters get a separate grammar because they can't have defaults.
const BLOCK_PARAMETERS = new Grammar({
  'meta: block variable': {
    pattern: (/^(\s*)([A-Za-z0-9_]+)$/),
    captures: {
      '2': 'variable variable-parameter'
    }
  }
});

// Values.
// In other words, (nearly) anything that's valid on the right hand side of
// an assignment operator.
const VALUES = new Grammar({
  // Single-quoted strings are easy; they have no escapes _or_
  // interpolation.
  'string string-single-quoted': {
    pattern: /(')([^']*?)(')/
  },

  'string string-double-quoted': {
    pattern: (/(")(.*?[^\\])(")/),
    wrapReplacement: true,
    captures: {
      '2': () => STRINGS
    }
  },

  // Probably could rewrite the above pattern to catch this, but this is
  // good enough for now.
  'string string-double-quoted empty': {
    pattern: /\"\"/
  },

  'string string-percent-q string-percent-q-braces': {
    pattern: /(%Q\{)([\s\S]*)(\})/,

    index: (text) => {
      return balance(
        text, '}', '{',
        { startIndex: text.indexOf('{') }
      );
    },
    wrapReplacement: true,
    captures: {
      '2': () => STRINGS
    }
  },

  'string string-percent-q string-percent-q-brackets': {
    pattern: /(%Q\[)(.*?[^\\])(\])/,
    wrapReplacement: true,
    captures: {
      '2': () => STRINGS
    }
  },

  'string embedded string-shell-command': {
    pattern: /(`)([^`]*?)(`)/,
    wrapReplacement: true,
    captures: {
      '2': () => STRINGS
    }
  },

  constant: {
    pattern: /\b(self|true|false|nil(?!\?))\b/
  },

  'number binary': {
    pattern: /\b0b[01](?:_[01]|[01])*\b/
  },

  number: {
    pattern: /\b(\d(?:[_.]\d|\d)*)\b/
  },

  // Namespace operator. We capture this so that it won't get matched by
  // the symbol rule.
  'punctuation punctuation-namespace': {
    pattern: /(::)/
  },

  symbol: {
    pattern: /:[A-Za-z0-9_!?]+/
  },

  'symbol single-quoted': {
    pattern: /:'([^']*?)'/,
  },

  'symbol double-quoted': {
    pattern: /(:)(")(.*?[^\\])(")/,
    wrapReplacement: true,
    captures: {
      '3': () => STRINGS
    }
  },

  regexp: {
    pattern: /(\/)(.*?)(\/)/,
    wrapReplacement: true,
    captures: {
      '2': () => REGEX_INTERNALS
    }
  },

  'variable variable-instance': {
    pattern: /(@)[a-zA-Z_][\w\d]*/
  },

  'variable variable-global': {
    pattern: /(\$)[a-zA-Z_][\w\d]*/
  },

  keyword: {
    pattern: /\b(do|class|def|if|module|yield|then|else|for|until|unless|while|elsif|case|when|break|retry|redo|rescue|require|lambda)\b/
  }

});

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

const STRINGS = new Grammar({
  escape: {
    pattern: /\\./
  },

  interpolation: {
    pattern: /(#\{)(.*?)(\})/,
    captures: {
      '1': 'punctuation',
      '2': () => MAIN,
      '3': 'punctuation'
    },
    wrapReplacement: true
  }
});

const MAIN = new Grammar('ruby', {
  'meta: method definition': {
    pattern: /(def)(\s+)([A-Za-z0-9_!?.]+)(?:\s*(\()(.*?)(\)))?/,
    captures: {
      '1': 'keyword',
      '3': 'entity'
    },
    before: (r, context) => {
      if (r[5]) r[5] = parseParameters(r[5], null, context);
    }
  },

  // For blocks, we don't try to capture the entire contents of the block in a
  // rule. But we mark where it starts and then push onto a stack in context so
  // we can keep track of where the block must end later on.
  'block block-braces': {
    pattern: VerboseRegExp`
      (\{)     # 1: opening brace
      (\s*)    # 2: space
      (\|)     # 3: begin parameters
      ([^|]*?) # 4: contents of parameters
      (\|)     # 5: end parameters
    `,
    // pattern: /(\{)(\s*)(\|)([^|]*?)(\|)/,
    replacement: compact(`
      <b class='#{name}'>
        <span class='punctuation'>#{1}</span>#{2}
        <span class='punctuation'>#{3}</span>
        #{4}
        <span class='punctuation'>#{5}</span>
    `),
    before: (r, context) => {
      // Keep a LIFO stack of block braces. When we encounter a brace that
      // we don't recognize later on, we'll pop the last scope off of the
      // stack and highlight it thusly.
      let stack = context.get('bracesStack', []);
      stack.push(r.name);
      r[4] = parseParameters(r[4], BLOCK_PARAMETERS, context);
    }
  },

  'block block-do-end': {
    pattern: VerboseRegExp`
      (do)         # 1: keyword
      (\s*)        # 2: space
      (\|)         # 3: begin parameters
      ([^|]*?)     # 4: parameters
      (\|)         # 5: end parameters
    `,
    replacement: compact(`
      <b class='#{name}'>
        <span class='keyword keyword-do'>#{1}</span>#{2}
        <span class='punctuation'>#{3}</span>
        #{4}
        <span class='punctuation'>#{5}</span>
    `),
    before: (r, context) => {
      // Keep a LIFO stack of block braces. When we encounter a brace that
      // we don't recognize later on, we'll pop the last scope off of the
      // stack and highlight it thusly.
      let stack = context.get('bracesStack', []);
      stack.push(r.name);
      r[4] = parseParameters(r[4], null, context);
      r[6] = MAIN.parse(r[6], context);
    }
  },

  'meta: class definition with superclass': {
    pattern: VerboseRegExp`
      (class)               # 1: keyword
      (\s+)                 # 2: space
      ([A-Z][A-Za-z0-9_]*)  # 3: class name
      (\s*(?:<|&lt;)\s*)    # 4: inheritance symbol, encoded or not
      ([A-Z][A-Za-z0-9:_]*) # 5: superclass
    `,
    replacement: compact(`
      <span class='keyword keyword-class'>#{1}</span>#{2}
      <span class='entity entity-class'>#{3}</span>
      <span class='punctuation'>#{4}</span>
      <span class='entity entity-class entity-superclass'>#{5}</span>
    `)
  },

  'meta: class or module definition': {
    pattern: VerboseRegExp`
      (class|module) # 1: keyword
      (\s+)          # 2: space
      ([A-Z][\w\d]*) # 3: name
      (\s*)          # 4: space
      (?=$|\n)       # lookahead: end of line or end of string
    `,
    // pattern: /(class|module)(\s+)([A-Z][A-Za-z0-9_]*)\s*(?=$|\n)/,
    replacement: compact(`
      #{1}#{2}#{3}#{4}
    `),
    before (m, context) {
      let classOrModule = m[1];
      m[1] = wrap(m[1], `keyword keyword-${classOrModule}`);
      m[3] = wrap(m[3], `entity entity-${classOrModule}`);
    }
  },

  'string heredoc-indented': {
    pattern: /(&lt;&lt;-|<<-)([_\w]+?)\b([\s\S]+?)(\2)/,
    replacement: compact(`
      <span class='#{name}'>
        <span class='heredoc-begin'>#{1}#{2}</span>
        #{3}
        <span class='heredoc-end'>#{4}</span>
      </span>
    `),
    captures: {
      '2': () => STRINGS
    }
  },

  'keyword operator': {
    pattern: /(\+|-|\*|\/|>|&gt;|<|&lt;|=>|=&gt;|>>|&gt;&gt;|<<|&lt;&lt;|=~|\|\|=|==|=|\|\||&&|\+=|-=|\*=|\/=)/
  },

  'keyword keyword-special': {
    pattern: /\b(initialize|new|loop|extend|raise|attr|catch|throw|private|protected|public|module_function|attr_(?:reader|writer|accessor))\b/
  }
});

MAIN.extend(VALUES);

// These need to be lowest possible priority, so we put them in after the
// values grammar.
MAIN.extend({
  comment: {
    pattern: /#[^\n]+/
  },

  'bracket-block-end': {
    pattern: /\}/,
    replacement: "#{0}",
    after: (text, context) => {
      let stack = context.get('bracesStack', []);
      let scope = stack.pop();
      if (!scope) return;
      return `${text}<!-- close ${scope} --></b>`;
    }
  },

  'keyword keyword-block-end': {
    pattern: /\b(end)\b/,
    after: (text, context) => {
      let stack = context.get('bracesStack', []);
      let scope = stack.pop();
      if (!scope) return;
      return `${text}<!-- close ${scope} --></b>`;
    }
  }
});

export default MAIN;
