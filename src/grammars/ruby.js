import { Utils, Grammar } from '../daub';

const { balance, compact, VerboseRegExp } = Utils;

function hasOnlyLeftBrace (part) {
  return part.includes('{') && !part.includes('}');
}

function findEndOfHash (allParts, startIndex) {
  let parts = allParts.slice(startIndex);

  // Join the parts together so we can search one string to find the balanced
  // brace.
  let str = parts.join('');
  let index = balance(str, '}', '{', { stackDepth: 1 });
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

function parseParameters(str, grammar, context) {
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
    replacement: `#{1}<span class='variable parameter'>#{2}</span><span class='keyword punctuation'>#{3}</span>#{4}`,

    before: function(r, context) {
      r[4] = VALUES.parse(r[4], context);
    }
  },

  'variable parameter': {
    pattern: (/^(\s*)([A-Za-z0-9_]+)$/),
    replacement: "#{1}<span class='#{name}'>#{2}</span>"
  }
});

// Block parameters get a separate grammar because they can't have defaults.
const BLOCK_PARAMETERS = new Grammar({
  'variable parameter': {
    pattern: (/^(\s*)([A-Za-z0-9_]+)$/),
    replacement: "#{1}<span class='#{name}'>#{2}</span>"
  }
});

// Values.
// In other words, (nearly) anything that's valid on the right hand side of
// an assignment operator.
const VALUES = new Grammar({
  // Single-quoted strings are easy; they have no escapes _or_
  // interpolation.
  'single-quoted string': {
    pattern: (/(')([^']*?)(')/),
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>"
  },

  'double-quoted string': {
    pattern: (/(")(.*?[^\\])(")/),
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: function(r, context) {
      r[2] = STRINGS.parse(r[2], context);
    }
  },

  // Probably could rewrite the above pattern to catch this, but this is
  // good enough for now.
  'double-quoted string empty': {
    pattern: (/\"\"/)
  },

  'string percent-q percent-q-braces': {
    // Capture group 2 is greedy because we don't know how much of this
    // pattern is ours, so we ask for everything up until the last brace in
    // the text. Then we find the balanced closing brace and act upon that
    // instead.
    pattern: /(%Q\{)([\s\S]*)(\})/,

    index: (text) => {
      return balance(
        text, '}', '{', { startIndex: text.indexOf('{') }
      );
    },

    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",

    // When we receive matches here, they won't be against the entire string
    // that the pattern originally matched; they'll be against the segment of
    // the string that we later decided we cared about.
    before: (r, context) => {
      r[2] = STRINGS.parse(r[2], context);
    }
  },

  'string percent-q percent-q-brackets': {
    pattern: (/(%Q\[)(.*?[^\\])(\])/),
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      r[2] = STRINGS.parse(r[2], context);
    }
  },

  'string embedded string-shell-command': {
    pattern: (/(`)([^`]*?)(`)/),
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      r[2] = STRINGS.parse(r[2], context);
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
    pattern: (/(:)(")(.*?[^\\])(")/),
    replacement: "<span class='#{name}'>#{1}#{2}#{3}#{4}</span>",
    before: function(r, context) {
      r[3] = STRINGS.parse(r[3], context);
    }
  },

  regexp: {
    pattern: (/(\/)(.*?)(\/)/),
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: function(r, context) {
      r[2] = REGEX_INTERNALS.parse(r[2], context);
    }
  },

  'variable variable-instance': {
    pattern: /(@)[a-zA-Z_]\w*/
  },

  keyword: {
    pattern: (/\b(do|class|def|if|module|yield|then|else|for|until|unless|while|elsif|case|when|break|retry|redo|rescue|require|lambda)\b/)
  }

});

const REGEX_INTERNALS = new Grammar({
  escape: {
    pattern: (/\\./)
  },

  'meta: exclude from group begin': {
    pattern: (/\\\(/),
    replacement: "#{0}"
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

const STRINGS = new Grammar({
  escape: {
    pattern: /\\./
  },

  interpolation: {
    pattern: (/(#\{)(.*?)(\})/),
    replacement: "<span class='#{name}'><span class='punctuation'>#{1}</span>#{2}<span class='punctuation'>#{3}</span></span>",
    before: (r, context) => {
      r[2] = MAIN.parse(r[2], context);
    }
    // TODO: Re-parse inside?
  }
});

const MAIN = new Grammar('ruby', {
  'meta: method definition': {
    pattern: /(def)(\s+)([A-Za-z0-9_!?.]+)(?:\s*(\()(.*?)(\)))?/,
    replacement: "<span class='keyword'>#{1}</span>#{2}<span class='entity'>#{3}</span>#{4}#{5}#{6}",
    before: (r, context) => {
      if (r[5]) r[5] = parseParameters(r[5], null, context);
    }
  },

  'block block-braces': {
    pattern: /(\{)(\s*)(\|)([^|]*?)(\|)/,
    replacement: compact(`
      <b class='#{name}'>
        <span class='punctuation brace'>#{1}</span>#{2}
        <span class='punctuation pipe'>#{3}</span>
        #{4}
        <span class='punctuation pipe'>#{5}</span>
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
      (do)         # keyword
      (\s*)
      (\|)         # opening pipe
      ([^|]*?)     # params
      (\|)         # closing pipe
    `,
    replacement: compact(`
      <b class='#{name}'>
        <span class='keyword'>#{1}</span>#{2}
        <span class='punctuation pipe'>#{3}</span>
        #{4}
        <span class='punctuation pipe'>#{5}</span>
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
      (class)               # keyword
      (\s+)
      ([A-Z][A-Za-z0-9_]*)  # class name
      (\s*(?:<|&lt;)\s*)    # inheritance symbol, encoded or not
      ([A-Z][A-Za-z0-9:_]*) # superclass
    `,
    replacement: compact(`
      <span class='keyword'>#{1}</span>#{2}
      <span class='class-definition-signature'>
        <span class='class'>#{3}</span>#{4}<span class='class superclass'>#{5}</span>
      </span>
    `)
  },

  'meta: class or module definition': {
    pattern: /(class|module)(\s+)([A-Z][A-Za-z0-9_]*)\s*(?=$|\n)/,
    replacement: compact(`
      <span class='keyword'>#{1}</span>#{2}
      <span class='class-definition-signature'>
        <span class='class'>#{3}</span>
      </span>
    `)
  },

  'string heredoc-indented': {
    pattern: /(&lt;&lt;-|<<-)([_\w]+?)\b([\s\S]+?)(\2)/,
    replacement: compact(`
      <span class='#{name}'>
        <span class='begin'>#{1}#{2}</span>
        #{3}
        <span class='end'>#{4}</span>
      </span>
    `),
    before: (r, context) => {
      r[3] = STRINGS.parse(r[3], context);
    }
  },

  'keyword operator': {
    pattern: /(\+|-|\*|\/|>|&gt;|<|&lt;|=>|=&gt;|>>|&gt;&gt;|<<|&lt;&lt;|=~|\|\|=|==|=|\|\||&&|\+=|-=|\*=|\/=)/
  },

  'keyword special': {
    pattern: (/\b(initialize|new|loop|extend|raise|attr|catch|throw|private|protected|public|module_function|attr_(?:reader|writer|accessor))\b/)
  }
});

MAIN.extend(VALUES);

// These need to be lowest possible priority, so we put them in after the
// values grammar.
MAIN.extend({
  comment: {
    pattern: (/#[^\n]+/)
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
