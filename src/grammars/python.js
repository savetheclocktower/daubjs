import { Grammar, Utils } from '../daub';
const { balance, wrap, compact, VerboseRegExp } = Utils;

// function wrapParameter (param) {
//   let className = 'variable parameter';
//   return `<span class='${className}'>${param}</span>`;
// }

function handleParameters(str, context) {
  let parts = str.split(/,[ \t]*/).map((part) => {
    return highlightParameters(part, MAIN, false, context);
  });
  return parts.join(', ');
}

function handleArguments(str, context) {
  console.log('handleArguments', str);
  let parts = str.split(/,[ \t]*/).map((part) => {
    return highlightParameters(part, MAIN, true, context);
  });
  return parts.join(', ');
}

const DEFAULT_VALUE_PATTERN = /(^|\s+)([A-Za-z0-9_]+)(\s*=\s*)(.*)/gm;
function highlightParameters(part, grammar, onlyHighlightKeywordArgs, context) {
  if (!grammar) { grammar = MAIN; }

  if ( DEFAULT_VALUE_PATTERN.test(part) ) {
    // This parameter has a default value set.
    part = part.replace(DEFAULT_VALUE_PATTERN, (match, ...m) => {
      let [space, name, eq, value] = m;
      name = wrap(name, 'variable parameter');
      eq   = wrap(eq, 'keyword punctuation');
      value = grammar.parse(value);
      return space + name + eq + value;
    });
  } else {
    part = onlyHighlightKeywordArgs ?
      grammar.parse(part, context) :
      wrap(part, 'variable parameter');
  }
  return part;
}

const STRINGS = new Grammar({
  interpolation: {
    pattern: /\{(\d*)\}/
  }
});

const MAIN = new Grammar('python', {
  'keyword keyword-import': {
    pattern: /(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(?=\n)/,
    replacement: compact(`
      <span class='#{name}'>#{1}</span>#{2}
      #{3}#{4}
      <span class='keyword'>#{5}</span>#{6}
      #{7}
    `)
  },

  'meta: subclass': {
    pattern: /(class)(\s+)([\w\d_]+)\(([\w\d_]*)\):/,
    replacement: compact(`
      <span class='keyword'>#{1}</span>#{2}
      <span class='entity entity-class class'>#{3}</span>
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
    (?:from|if|else|elif|print|import|class|pass|
      try|finally|except|return|global|nonlocal)
    \b
    `
  },

  'string string-triple-quoted': {
    pattern: /"""[\s\S]*?"""/,
    before: (r, context) => {
      console.log('match triple:', r[0]);
      r[0] = STRINGS.parse(r[0], context);
    }
  },

  // 'string string-single-quoted': {
  //   pattern: (/(')(.*?[^\\])(')/),
  //   replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
  //   // before: (r, context) => {
  //   //   r[2] = ESCAPES.parse(r[2], context);
  //   // }
  // },
  //
  // 'string string-double-quoted': {
  //   pattern: /(")(.*?[^\\])(")/,
  //   replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
  //   // before: (r, context) => {
  //   //   r[2] = ESCAPES.parse(r[2], context);
  //   // }
  // },


  string: {
    pattern: /('[^']*')|("[^"]*")/,
    before: (r) => {
      let name;
      if (r[1]) name = 'string-single-quoted';
      if (r[2]) name = 'string-double-quoted';
      r.name += ` ${name}`;
    }
  },

  constant: {
    pattern: /\b(self|None|True|False)\b/
  },

  // Usage of a constant after assignment.
  'constant constant-named': {
    pattern: /\b([A-Z_]+)(?!\.)\b/,
    replacement: "<span class='#{name}'>#{1}</span>"
  },

  // Initial declaration of a constant.
  'constant constant-assignment': {
    pattern: /^([A-Z][A-Za-z\d_]*)(\s*)(?=\=)/,
    replacement: "<span class='variable'>#{1}</span>"
  },

  number: {
    pattern: /(\b|-)((0(x|X)[0-9a-fA-F]+)|([0-9]+(\.[0-9]+)?))\b/
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
      if (r[6]) {
        r[6] = handleParameters(r[6], context);
      }
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
        r[4] = handleArguments(r[4], context);
      }
    }
  },

  'keyword operator operator-logical': {
    pattern: /\b(and|or|not)\b/
  },

  'keyword operator operator-bitwise': {
    pattern: /(?:&|\||~|\^|>>|<<)/
  },

  'keyword operator operator-comparison': {
    pattern: /(?:>=|<=|!=|==|>|<)/
  },

  'keyword operator operator-arithmetic': {
    pattern: /(?:\+=|\-=|=|\+|\-|%|\/\/|\/|\*\*|\*)/
  }
});

export default MAIN;
