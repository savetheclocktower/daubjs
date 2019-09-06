/* eslint-disable no-useless-escape */
import { Utils, Grammar } from '../daub';
const { balance, compact, wrap, VerboseRegExp } = Utils;


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

function handleParams (text, context) {
  return PARAMETERS.parse(text, context);
}

let INSIDE_TEMPLATE_STRINGS = new Grammar({
  'interpolation': {
    pattern: /(\$\{)(.*?)(\})/,
    replacement: "<span class='#{name}'><span class='punctuation'>#{1}</span><span class='interpolation-contents'>#{2}</span><span class='punctuation'>#{3}</span></span>",
    before: (r, context) => {
      r[2] = MAIN.parse(r[2], context);
    }
  }
}).extend(ESCAPES);

const PARAMETERS = new Grammar({
  'parameter parameter-with-default': {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,
    replacement: compact(`
      <span class="parameter">
        <span class="variable">#{1}</span>
        <span class="operator">#{2}</span>
      #{3}
      </span>
    `),
    before: (r, context) => {
      r[3] = VALUES.parse(r[3], context);
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
    pattern: /(`)([^`]*)(`)/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      r[2] = INSIDE_TEMPLATE_STRINGS.parse(r[2], context);
    }
  },

  'string string-single-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-apostrophes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-non-apostrophe pair.
    pattern: /(')((?:[^'\\]|\\\\|\\[^'])*)(')/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      r[2] = ESCAPES.parse(r[2], context);
    }
  },

  'string string-double-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-quotes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-non-quote pair.
    pattern: /(")((?:[^"\\]|\\\\|\\[^"])*)(")/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      r[2] = ESCAPES.parse(r[2], context);
    }
  }
});

let VALUES = new Grammar({
  constant: {
    pattern: /\b(?:arguments|this|false|true|super|null|undefined)\b/
  },

  'number number-binary-or-octal': {
    pattern: /0[bo]\d+/
  },

  number: {
    pattern: /(?:\d*\.?\d+)/,
  },

  ...STRINGS.toObject(),

  comment: {
    pattern: /(\/\/[^\n]*\n)|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
  },

  regexp: {
    // No such thing as an empty regex, so we can get away with requiring at
    // least one not-backslash character before the end delimiter.
    pattern: /(\/)(.*?[^\\])(\/)([mgiy]*)/,
    replacement: "<span class='regexp'>#{1}#{2}#{3}#{4}</span>",
    before: (r, context) => {
      r[2] = REGEX_INTERNALS.parse(r[2], context);
      if (r[4]) r[4] = wrap(r[4], 'keyword regexp-flags');
    }
  }
});

let DESTRUCTURING = new Grammar({
  alias: {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,
    replacement: "<span class='entity'>#{1}</span>#{2}#{3}#{4}"
  },

  variable: {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  }
});

let MAIN = new Grammar('javascript', {}, { alias: ['js'] });
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
      r[1] = handleParams(r[1], context);
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
      r[2] = handleParams(r[2], context);
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
    pattern: /(\s+|,)([A-Za-z_$][\w\d$]*?)(\s*)(?==)/,
    replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}"
  },

  'meta: destructuring assignment': {
    pattern: /(let|var|const)(\s+)(\{|\[)([\s\S]*)(\}|\])(\s*)(?==)/,
    index: (matchText) => {
      let pairs = { '{': '}', '[': ']' };
      let match = (/(let|var|const|)(\s+)(\{|\[)/).exec(matchText);
      let char = match[3], paired = pairs[char];
      return balance(
        matchText, char, paired, { startIndex: matchText.indexOf(char) + 1 }
      );
    },
    replacement: "<span class='storage'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
    before: (r, context) => {
      r[4] = DESTRUCTURING.parse(r[4], context);
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
      if (r[3]) r[3] = `<span class='entity'>${r[3]}</span>`;
      r[6] = handleParams(r[6], context);
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

    replacement: "#{1}#{2}#{3}<span class='entity'>#{4}</span>#{5}#{6}#{7}#{8}#{9}#{10}",
    before: (r, context) => {
      if (r[2]) r[2] = `<span class='storage'>${r[1]}</span>`;
      r[7] = handleParams(r[7], context);
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
    replacement: "<span class='variable'>#{1}</span>#{2}#{3}#{4} <span class='keyword'>#{5}</span>#{6}#{7}#{8}#{9}",
    before: (r, context) => {
      r[8] = handleParams(r[8], context);
    }
  },

  'meta: property then function': {
    pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(:)(\s*)(?=function)/,
    replacement: "<span class='entity'>#{1}</span>#{2}#{3}"
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
      // return findBalancedToken('}', '{', match, match.indexOf('{') + 1);
    },
    replacement: compact(`
      <span class="storage">#{1}</span>
      #{2}#{3}
      #{4}#{5}#{6}#{7}
      #{8}#{9}
    `),
    before: (r) => {
      if (r[3]) r[3] = wrap(r[3], 'entity entity-class');
      if (r[5]) r[5] = wrap(r[5], 'storage');
      if (r[7]) r[7] = wrap(r[7], 'entity entity-class entity-superclass');
    }
  },

  storage: {
    pattern: /\b(?:var|let|const|class|extends|async)\b/
  },

  keyword: {
    pattern: /\b(?:try|catch|finally|if|else|do|while|for|break|continue|case|switch|default|return|yield|throw|await)\b/
  },

  'keyword operator': {
    pattern: /!==?|={1,3}|>=?|<=?|\+\+|\+|--|-|\*|[\*\+-\/]=|\?|\.{3}|\b(?:instanceof|in|of)\b/
  }
});

export default MAIN;
