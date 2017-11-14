import { Grammar, Utils } from '../daub';
const { balance, wrap, compact, VerboseRegExp } = Utils;

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
    replacement: "<span class='keyword storage'>#{1}</span>#{2}#{3}#{4}",
    before: (r, context) => {
      r[3] = PARAMETERS_WITHOUT_DEFAULT.parse(r[3], context);
    }
  },
  
  'string string-triple-quoted': {
    pattern: /"""[\s\S]*?"""/,
    before: (r, context) => {
      r[0] = STRINGS.parse(r[0], context);
    }
  },
  
  'string string-raw string-single-quoted': {
    pattern: (/([urb]+)(')(.*?[^\\]|[^\\]*)(')/),
    replacement: "<span class='storage string'>#{1}</span><span class='#{name}'>#{2}#{3}#{4}</span>",
    before: (r, context) => {
      r[3] = STRINGS.parse(r[3], context);
    }
  },

  'string string-single-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-apostrophes and non-backslashes OR
    // * a backslash plus exactly one of any character (including backslashes)
    pattern: /([ub])?(')((?:[^'\\]|\\.)*)(')/,
    replacement: "#{1}<span class='#{name}'>#{2}#{3}#{4}</span>",
    before: (r, context) => {
      if (r[1]) { r[1] = wrap(r[1], 'storage string'); }
      r[3] = STRINGS.parse(r[3], context);
    }
  },
  
  'string string-double-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-quotes and non-backslashes OR
    // * a backslash plus exactly one of any character (including backslashes)
    pattern: /([ub])?(")((?:[^"\\]|\\.)*)(")/,
    replacement: "#{1}<span class='#{name}'>#{2}#{3}#{4}</span>",
    before: (r, context) => {
      if (r[1]) { r[1] = wrap(r[1], 'storage string'); }
      r[3] = STRINGS.parse(r[3], context);
    }
  },

  constant: {
    pattern: /\b(self|None|True|False)\b/
  },

  // Initial declaration of a constant.
  'constant constant-assignment': {
    pattern: /^([A-Z][A-Za-z\d_]*)(\s*)(?=\=)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}"
  },
  
  // Usage of a constant after assignment.
  'constant constant-named': {
    pattern: /\b([A-Z_]+)(?!\.)\b/,
    replacement: "<span class='#{name}'>#{1}</span>"
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
    replacement: `#{1}<span class='variable parameter'>#{2}</span><span class='keyword punctuation'>#{3}</span>#{4}`,

    before: (r, context) => {
      r[4] = VALUES.parse(r[4], context);
    }
  }
}).extend(VALUES);

const PARAMETERS_WITHOUT_DEFAULT = new Grammar({
  'variable parameter': {
    pattern: /(\s*)(\*\*?)?([A-Za-z0-9_]+)(?=,|$)/,
    replacement: "#{1}#{2}<span class='#{name}'>#{3}</span>",
    before: (r) => {
      if (r[2]) { r[2] = wrap(r[2], 'keyword operator'); }
    }
  }
});

const PARAMETERS = new Grammar({
  'meta: parameter with default': {
    pattern: /(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*?)(?=,|$)/,
    replacement: `#{1}<span class='variable parameter'>#{2}</span><span class='keyword punctuation'>#{3}</span>#{4}`,

    before: (r, context) => {
      r[4] = VALUES.parse(r[4], context);
    }
  }
}).extend(PARAMETERS_WITHOUT_DEFAULT);


const MAIN = new Grammar('python', {
  'storage storage-type support': {
    pattern: /(int|float|bool|chr|str|bytes|list|dict|set)(?=\()/
  },
  
  'support support-builtin': {
    pattern: /(repr|round|print|input|len|min|max|sum|sorted|enumerate|zip|all|any|open)(?=\()/
  },
  
  'meta: from/import/as': {
    pattern: /(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(\s+)(as)(\s+)(.*?)(?=\n|$)/,
    replacement: compact(`
      <span class='keyword'>#{1}</span>#{2}
      #{3}#{4}
      <span class='keyword'>#{5}</span>#{6}
      #{7}#{8}
      <span class='keyword'>#{9}</span>#{10}#{11}
    `),
  },
  
  'meta: from/import': {
    pattern: /(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(?=\n|$)/,
    replacement: compact(`
      <span class='keyword'>#{1}</span>#{2}
      #{3}#{4}
      <span class='keyword'>#{5}</span>#{6}#{7}
    `)
  },
  
  'meta: subclass': {
    pattern: /(class)(\s+)([\w\d_]+)\(([\w\d_]*)\):/,
    replacement: compact(`
      <span class='keyword'>#{1}</span>#{2}
      <span class='entity entity-class'>#{3}</span>
      (<span class='entity entity-class entity-superclass'>#{4}</span>) :
    `),
  },

  'meta: class': {
    pattern: /(class)(\s+)([\w\d_]+):/,
    replacement: "<span class='keyword'>#{1}</span>#{2}<span class='entity entity-class class'>#{3}</span>:"
  },

  comment: {
    pattern: /#[^\n]*(?=\n)/
  },

  keyword: {
    pattern: VerboseRegExp`
    \b
    (?:if|else|elif|print|class|pass|from|import|raise|while|
      try|finally|except|return|global|nonlocal|for|in|del|with)
    \b
    `
  },

  'meta: method definition': {
    pattern: VerboseRegExp`
      (def)             # 1: keyword
      (\s+)             # 2: space
      ([A-Za-z0-9_!?]+) # 3: method name
      (\s*)             # 4: space
      (\()              # 5: open paren
      (.*?)?            # 6: parameters (optional)
      (\))              # 7: close paren
    `,
    replacement: compact(`
      <span class='keyword'>#{1}</span>#{2}
      <span class='entity'>#{3}</span>#{4}
      #{5}#{6}#{7}
    `),
    before: (r, context) => {
      if (r[6]) { r[6] = PARAMETERS.parse(r[6], context); }
    }
  },

  'meta: method invocation': {
    pattern: VerboseRegExp`
      ([A-Za-z0-9_!?]+)  # 1: method name
      (\s*)              # 2: optional space
      (\(\s*)            # 3: opening paren plus optional space
      ([\s\S]*)          # 4: inside parens (greedy)
      (\s*\))            # 5: closing paren
    `,
    index: (text) => {
      return balance(text, ')', '(', text.indexOf('('));
    },
    replacement: "#{1}#{2}#{3}#{4}#{5}",
    before: (r, context) => {
      if (r[4]) {
        r[4] = ARGUMENTS.parse(r[4], context);
      }
    }
  },

  'keyword operator operator-logical': {
    pattern: /\b(and|or|not)\b/
  },

  'keyword operator operator-bitwise': {
    pattern: /(?:&|\||~|\^|>>|<<)/
  },

  'keyword operator operator-assignment': {
    pattern: /=/
  },

  'keyword operator operator-comparison': {
    pattern: /(?:>=|<=|!=|==|>|<)/
  },

  'keyword operator operator-arithmetic': {
    pattern: /(?:\+=|\-=|=|\+|\-|%|\/\/|\/|\*\*|\*)/
  }
});

MAIN.extend(VALUES);

export default MAIN;
