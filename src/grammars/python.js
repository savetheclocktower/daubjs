import Grammar from '#internal/grammar';
import { balance, wrap, compact, VerboseRegExp } from '#internal/utils';

const STRINGS = new Grammar({
  interpolation: {
    pattern: /\{(\d*)\}/
  },

  'escape escape-hex': {
    pattern: /\\x[0-9a-fA-F]{2}/
  },

  'escape escape-octal': {
    pattern: /\\[0-7]{3}/
  },

  escape: {
    pattern: /\\./
  }
});

const VALUES = new Grammar({
  'lambda': {
    pattern: /(lambda)(\s+)(.*?)(:)/,
    captures: {
      '1': 'keyword storage',
      '3': () => PARAMETERS_WITHOUT_DEFAULT
    }
  },

  'string string-triple-quoted': {
    pattern: /"""[\s\S]*?"""/,
    before: (r, context) => {
      r[0] = STRINGS.parse(r[0], context);
    }
  },

  'string string-raw string-single-quoted': {
    pattern: /([urb]+)(')(.*?[^\\]|[^\\]*)(')/,
    replacement: "<span class='storage string'>#{1}</span><span class='#{name}'>#{2}#{3}#{4}</span>",
    captures: {
      '3': () => STRINGS
    }
  },

  'string string-single-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-apostrophes and non-backslashes OR
    // * a backslash plus exactly one of any character (including backslashes)
    pattern: /([ub])?(')((?:[^'\\]|\\.)*)(')/,
    replacement: "#{1}<span class='#{name}'>#{2}#{3}#{4}</span>",
    captures: {
      '1': 'storage string',
      '3': () => STRINGS
    }
  },

  'string string-double-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-quotes and non-backslashes OR
    // * a backslash plus exactly one of any character (including backslashes)
    pattern: /([ub])?(")((?:[^"\\]|\\.)*)(")/,
    replacement: "#{1}<span class='#{name}'>#{2}#{3}#{4}</span>",
    captures: {
      '1': 'storage string',
      '3': () => STRINGS
    }
  },

  constant: {
    pattern: /\b(self|None|True|False)\b/,
    before (m, context) {
      m[1] = wrap(m[1], `constant constant-${m[1].toLowerCase()}`);
    },
    replacement: "#{1}"
  },

  // Initial declaration of a constant.
  'constant constant-assignment': {
    pattern: /^([A-Z][A-Za-z\d_]*)(\s*)(?=\=)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}"
  },

  // Usage of a constant after assignment.
  'constant constant-named': {
    pattern: /\b([A-Z_]+)(?!\.)\b/
  },

  'variable variable-assignment': {
    pattern: /([a-z_][[A-Za-z\d_]*)(\s*)(?=\=)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}"
  },

  number: {
    pattern: /(\b|-)((0(x|X)[0-9a-fA-F]+)|([0-9]+(\.[0-9]+)?))\b/
  },

  'number number-binary': {
    pattern: /0b[01]+/
  },

  'number number-octal': {
    pattern: /0o[0-7]+/
  }
});

const ARGUMENTS = new Grammar({
  'meta: parameter with default': {
    pattern: /(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*?)(?=,|$)/,
    captures: {
      '2': 'variable variable-parameter',
      '3': 'keyword',
      '4': VALUES
    }
  }
}).extend(VALUES);

const PARAMETERS_WITHOUT_DEFAULT = new Grammar({
  'meta: parameter': {
    pattern: /(\s*)(\*\*?)?([A-Za-z0-9_]+)(?=,|$)/,
    captures: {
      '2': 'keyword operator',
      '3': 'variable variable-parameter'
    }
  }
});

const PARAMETERS = new Grammar({
  'meta: parameter with default': {
    pattern: /(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*?)(?=,|$)/,
    captures: {
      '2': 'variable variable-parameter',
      '3': 'keyword operator',
      '4': () => VALUES
    }
  }
}).extend(PARAMETERS_WITHOUT_DEFAULT);


const MAIN = new Grammar('python', {
  'storage storage-type support': {
    pattern: /(int|float|bool|chr|str|bytes|list|dict|set)(?=\()/
  },

  'meta: exclude format method on strings': {
    pattern: /(\.)(format)\b/,
    captures: {}
  },

  'support support-builtin': {
    // https://docs.python.org/3/library/functions.html
    // minus the types described above
    pattern: VerboseRegExp`
      \b(?:
        abs|aiter|all|any|anext|ascii|bin|breakpoint|bytearray|
        callable|classmethod|compile|complex|delattr|dir|divmod|
        enumerate|eval|exec|filter|format|frozenset|getattr|globals|
        hasattr|hash|help|hex|id|input|isinstance|issubclass|iter|len|
        locals|map|max|memoryview|min|next|object|oct|open|ord|pow|
        print|property|range|repr|reversed|round|setattr|slice|sorted|
        staticmethod|sum|super|tuple|type|vars|zip|__import__
      )\b(?=\()
    `
    // pattern: /(repr|round|print|input|len|min|max|sum|sorted|enumerate|zip|all|any|open)(?=\()/
  },

  'meta: from/import/as': {
    pattern: /(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(\s+)(as)(\s+)(.*?)(?=\n|$)/,
    captures: {
      '1': 'keyword',
      '5': 'keyword',
      '9': 'keyword'
    }
  },

  'meta: from/import': {
    pattern: /(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(?=\n|$)/,
    captures: {
      '1': 'keyword',
      '5': 'keyword'
    }
  },

  'meta: subclass': {
    pattern: /(class)(\s+)([\w\d_]+)(\()([\w\d_]*)(\))(\s*)(:)/,
    captures: {
      '1': 'keyword',
      '3': 'entity entity-class',
      '4': 'punctuation',
      '5': 'entity entity-class entity-superclass',
      '6': 'punctuation',
      '8': 'punctuation'
    }
  },

  'meta: class': {
    pattern: /(class)(\s+)([\w\d_]+)(:)/,
    captures: {
      '1': 'keyword',
      '3': 'entity entity-class',
      '4': 'punctuation'
    }
  },

  comment: {
    pattern: /#[^\n]*(?=\n)/
  },

  'keyword storage': {
    pattern: /\b(?:global|nonlocal)\b/
  },

  keyword: {
    pattern: /\b(?:if|else|elif|print|class|pass|from|import|raise|while|try|finally|except|return|for|in|del|with)\b/
  },

  'meta: method definition': {
    pattern: VerboseRegExp`
      (def)             # 1: keyword
      (\s+)             # 2: space
      ([A-Za-z0-9_]+) # 3: method name
      (\s*)             # 4: space
      (\()              # 5: open paren
      ([\s\S]*?)?       # 6: parameters (optional)
      (\))              # 7: close paren
    `,
    captures: {
      '1': 'keyword',
      '3': 'entity',
      '5': 'punctuation',
      '6': PARAMETERS,
      '7': 'punctuation'
    }
  },

  'meta: method invocation': {
    pattern: VerboseRegExp`
      ([A-Za-z0-9_!?]+)  # 1: method name
      (\s*)              # 2: optional space
      (\()               # 3: opening paren
      (\s*)              # 4: optional space
      ([\s\S]*)          # 5: inside parens (greedy)
      (\s*\))            # 6: closing paren
    `,
    index: (text) => {
      return balance(text, ')', '(', text.indexOf('('));
    },
    captures: {
      '3': 'punctuation',
      '5': () => ARGUMENTS,
      '6': 'punctuation'
    }
  },

  'keyword operator operator-logical': {
    pattern: /\b(and|or|not)\b/
  },

  'keyword operator operator-bitwise': {
    pattern: /(?:&amp;|\||~|\^|>>|<<|&(?![a-z]+;))/
  },

  'keyword operator operator-assignment': {
    pattern: /=/
  },

  'keyword operator operator-comparison': {
    pattern: /(?:>=|<=|!=|==|>|<|&lt;|&gt;)/
  },

  'keyword operator operator-arithmetic': {
    pattern: /(?:\+=|\-=|=|\+|\-|%|\/\/|\/|\*\*|\*)/
  }
});

MAIN.extend(VALUES);

export default MAIN;
