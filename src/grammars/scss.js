import { Utils, Grammar } from '../daub';
const { balance, compact, VerboseRegExp } = Utils;

let findFirstThatIsNotPrecededBy = (token, notToken, string, startIndex) => {
  let lastChar;
  for (let i = startIndex; i < string.length; i++) {
    let char = string.slice(i, i + token.length);
    if (lastChar !== notToken && char === token) {
      return i;
    }
    lastChar = char.slice(-1);
  }
};

const FUNCTIONS = new Grammar({
  'support support-function-call support-function-call-css-builtin': {
    pattern: /(attr|counter|rgb|rgba|hsl|hsla|calc)(\()(.*)(\))/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
    captures: {
      '2': 'punctuation',
      '3': () => VALUES,
      '4': 'punctuation'
    }
  },
  'support support-function-call support-function-call-sass': {
    pattern: /(red|green|blue|mix|hue|saturation|lightness|adjust-hue|lighten|darken|saturate|desaturate|grayscale|complement|invert|alpha|opacity|opacify|transparentize|fade-in|fade-out|selector-(?:nest|replace)|unquote|quote|str-(?:length|insert|index|slice)|to-(?:upper|lower)-case|percentage|round|ceil|floor|abs|min|max|random|(?:feature|variable|global-variable|mixin)-exists|inspect|type-of|unit|unitless|comparable|call|if|unique-id)(\()(.*)(\))/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
    captures: {
      '2': 'punctuation',
      '3': () => VALUES,
      '4': 'punctuation'
    }
  },

  'support support-function-call support-function-call-url': {
    pattern: /(url)(\()(.*)(\))/,
    index: (match) => {
      console.log('wtf');
      return balance(
        match, ')', '(',
        { startIndex: match.indexOf('(') }
      );
    },
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
    before: (r, context) => {
      // The sole argument to `url` can be a quoted string or an unquoted
      // string. Apply interpolations either way.
      let transformed = INSIDE_URL_FUNCTION.parse(r[3], context);
      if ( !(/^('|")/).test(r[3]) ) {
        transformed = INTERPOLATIONS.parse(r[3], context);
        transformed = `<span class='string string-unquoted'>${transformed}</span>`;
      }
      r[3] = transformed;
    }
  },

  'support support-function-call support-function-call-custom': {
    pattern: /([A-Za-z_-][A-Za-z0-9_-]*)(\()(.*)(\))/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
    captures: {
      '2': 'punctuation',
      '3': () => VALUES,
      '4': 'punctuation'
    }
  }
});

const INTERPOLATIONS = new Grammar({
  interpolation: {
    pattern: /(\#\{)(.*?)(})/,
    captures: {
      '1': 'punctuation interpolation-begin',
      '2': () => VALUES,
      '3': 'punctuation interpolation-end'
    },
    wrapReplacement: true
  }
});

function variableRuleNamed (name) {
  return new Grammar({
    [name]: { pattern: /\$[A-Za-z0-9_-]+/ }
  });
}

const VARIABLE = variableRuleNamed('variable');

const VARIABLES = new Grammar({
  'variable variable-assignment': {
    // NOTE: This is multiline. Will search until it finds a semicolon, even if it's not on the same line.
    pattern: /(\s*)(\$[A-Za-z][A-Za-z0-9_-]*)\b(\s*)(\:)([\s\S]*?)(;)/,
    captures: {
      '2': 'variable variable-assignment',
      '4': 'punctuation',
      '5': () => VALUES,
    },
  }
}).extend(VARIABLE);

const PARAMETERS = new Grammar({
  'meta: parameter with default': {
    pattern: VerboseRegExp`
      (\$[\w\-][\w\d\-]*) # 1: identifier
      (\s*)               # 2: space
      (:)                 # 3: colon
      (\s*)               # 4: space
      (.*?)               # 5: stuff
      (?=,|\),\n)         # lookahead: end of line or statement
    `,
    captures: {
      '1': 'variable variable-parameter',
      '3': 'punctuation',
      '5': () => VALUES
    }
    // pattern: /(\$[A-Za-z][A-Za-z0-9_-]*)(\s*:\s*)(.*?)(?=,|\)|\n)/,
    // replacement: compact(`
    //   <span class="parameter">
    //     #{1}#{2}#{3}
    //   </span>
    // `),
    // captures: {
    //   '1': 'variable',
    //   '2': 'punctuation',
    //   '3': () => VALUES
    // }
  }
}).extend( variableRuleNamed('variable variable-parameter') );

const SELECTORS = new Grammar({
  'selector selector-class selector-abstract-class': {
    pattern: /(%)[a-zA-Z0-9_-]+/
  },
  'selector selector-element-wildcard': {
    pattern: /\*/
  },
  'selector selector-element': {
    pattern: /\b(a|abbr|acronym|address|area|article|aside|applet|audio|b|base|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|keygen|kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|svg|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|u|ul|var|video)\b/
  },

  'selector selector-class': {
    pattern: /\.[a-zA-Z][a-zA-Z0-9_\-]*\b/
  },

  'selector selector-id': {
    pattern: /#[a-zA-Z][a-zA-Z0-9_-]*/
  },

  'selector selector-pseudo selector-pseudo-not': {
    pattern: /(:not\()(.*)(\))/,
    replacement: compact(`
      <span class='#{name}'>
        #{1}
        <span class='parameter'>#{2}</span>
        #{3}
      </span>
    `),
    captures: {
      '2': () => SELECTORS
    }
  },

  'meta: BEM self-reference pattern': {
    pattern: VerboseRegExp`
      (&amp;)  # 1: ampersand
      (        # 2: token
        (?:__|--)
        (?:[\w\d\-]+)? # optional because it could be followed by an interpolation, not text
      )
    `,
    captures: {
      '1': 'selector selector-self-reference-bem-style selector-element',
      '2': 'selector selector-class selector-self-reference-bem-style'
    }
    // pattern: /(?:&amp;|&)(?:__|--)(?:[A-Za-z0-9_-]+)?/,
  },

  'selector selector-interpolation embedded': {
    pattern: /(#\{)(.*)(\})/,
    index: (match) => {
      return balance(
        match, '}', '{', { startIndex: match.indexOf('{') }
      );
    },
    wrapReplacement: true,
    captures: {
      '2': () => VALUES
    }
  },

  'selector selector-self-reference': {
    pattern: /(?:&amp;|&)/
  },

  'selector selector-pseudo selector-pseudo-with-args': {
    pattern: /((?:\:+)\b(?:lang|nth-(?:last-)?child|nth-(?:last-)?of-type))(\()(.*)(\))/,
    wrapReplacement: true,
    captures: {
      '3': () => VALUES
    }
  },

  'selector selector-pseudo selector-pseudo-without-args': {
    pattern: /(:{1,2})(link|visited|hover|active|focus|targetdisabled|enabled|checked|indeterminate|root|first-child|last-child|first-of-type|last-of-type|only-child|only-of-type|empty|valid|invalid)/
  },

  'selector selector-pseudo selector-pseudo-element': {
    pattern: /(:{1,2})(-(?:webkit|moz|ms)-)?\b(after|before|first-letter|first-line|selection|any-link|local-link|(?:input-)?placeholder|focus-inner|matches|nth-match|column|nth-column)\b/
  },

  'selector selector-attribute': {
    pattern: VerboseRegExp`
      (\[)               # 1: opening bracket
      (                  # 2: attr name
       [A-Za-z_-]        # initial character
       [A-Za-z0-9_-]*
      )                  # end group 2
      (?:                # operator-and-value non-capturing group
        ([~\.$^]?=)      # 3: operator
        (                # 4: value
        (['"])(?:.*?)(?:\\5)| # 5: single/double quote, value, then same quote OR...
        [^\s\]]          # any value that doesn't need to be quoted
        )                # end group 4
      )?                 # end operator-and-value (optional)
      (\])               # 6: closing bracket
    `,
    wrapReplacement: true,
    captures: {
      '4': () => STRINGS
    }
  },

  'selector selector-combinator': {
    pattern: /(\s*)([>+~])(\s*)/,
    replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}"
  }
});

const MAPS = new Grammar({
  'meta: map pair': {
    // Property, then colon, then any value. Line terminates with a comma, a
    // newline, or the end of the string (but not a semicolon).
    pattern: /([a-zA-Z_-][a-zA-Z0-9_-]*)(\s*:\s*)(.*(?:,|\)|$))/,
    captures: {
      '1': 'entity',
      '2': 'punctuation',
      '3': () => VALUES
    }
  }
});

// Split out because it's the one operator that gets used in @media and
// @supports queries.
const OPERATOR_LOGICAL = new Grammar({
  'operator operator-logical': {
    pattern: /\b(and|or|not)\b/
  }
});

const OPERATORS = new Grammar({
  'operator operator-arithmetic': {
    // Only a minus sign when followed by a space, a parenthesis, or a
    // digit; otherwise it's a hyphen.
    pattern: /\*|\+|\-(?=\s|\(|\d|$)|\//
  },

  'operator operator-comparison': {
    // TODO: >? (it's also a combinator)
    pattern: /!=|==|</
  }
}).extend(OPERATOR_LOGICAL);

const VALUES = new Grammar({
  // An arbitrary grouping of parentheses could also be a list, among other
  // things. But we don't need to apply special highlighting to lists;
  // their values will get highlighted.
  'meta: possible map': {
    pattern: /(\()([\s\S]+)(\))/,
    replacement: "#{1}#{2}#{3}",
    before: (r, context) => {
      let mapPattern = (/[A-Za-z_-][A-Za-z0-9_-]*:.*(?:,|\)|$)/);
      let grammar = VALUES;
      if ( (mapPattern).test(r[2]) ) {
        grammar = MAPS;
      }
      r[2] = grammar.parse(r[2], context);
    }
  },

  'constant constant-boolean': {
    pattern: /\b(?:true|false)\b/
  },

  'constant': {
    pattern: /\b(?:null)\b/
  },

  'support support-property-value': {
    pattern: (/inherit|initial|unset|none|auto|inline-block|block|inline|absolute|relative|solid|dotted|dashed|nowrap|normal|bold|italic|underline|overline|double|uppercase|lowercase|(?:border|content)-box/)
  },

  'meta: value with unit': {
    pattern: VerboseRegExp`
      (             # 1: number
        [\+|\-]?    # optional sign
        (?:\s*)?    # optional space
        (?:         # EITHER
          [0-9]+(?:\.[0-9]+)? # digits with optional decimal point and more digits
          |           # OR
          \.[0-9]+ # decimal point plus digits
        )
      )            # end group 1
      (\s*)        # 2: any space btwn number and unit
      (            # 3: unit
        (?:ch|cm|deg|dpi|dpcm|dppx|em|ex|
        grad|in|mm|ms|pc|pt|px|rad|rem|
        turn|s|vh|vmin|vw)\b # EITHER a unit
        |          # OR
        %          # a percentage
      )
    `,
    captures: {
      '1': 'number',
      '3': 'unit'
    }
  }
}).extend(OPERATORS, VARIABLE);

const NUMBERS = new Grammar({
  'number': {
    pattern: /[\+|\-]?(\s*)?([0-9]+(\.[0-9]+)?|\.[0-9]+)/
  }
});


const STRINGS = new Grammar({
  'string single-quoted': {
    pattern: (/(')([^']*?)(')/),
    wrapReplacement: true,
    captures: {
      '2': INTERPOLATIONS
    }
  },

  'string double-quoted': {
    pattern: (/(")(.*?[^\\])(")/),
    wrapReplacement: true,
    captures: {
      '2': INTERPOLATIONS
    }
  },

  'string single-quoted string-empty': {
    pattern: /''/
  },

  'string double-quoted string-empty': {
    pattern: /""/
  }
});

const COLORS = new Grammar({
  'constant color-hex': {
    pattern: /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/
  },

  'constant color-named': {
    pattern: /\b(aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow)\b/
  }
});

const DIRECTIVES = new Grammar({
  'keyword directive': {
    pattern: /\s+!(?:default|important|optional)/
  }
});


VALUES.extend(
  FUNCTIONS,
  STRINGS,
  COLORS,
  NUMBERS,
  DIRECTIVES,
  {
    'support': {
      pattern: /\b([\w-]+)\b/
    }
  }
);

const COMMENTS = new Grammar({
  'comment comment-line': {
    pattern: (/(?:\s*)\/\/(?:.*?)(?=\n)/)
  },
  'comment comment-block': {
    pattern: (/(?:\s*)(\/\*)([\s\S]*)(\*\/)/)
  }
});

const PROPERTIES = new Grammar({
  'meta: property pair': {
    pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(;)/,
    captures: {
      '1': 'property',
      '3': () => VALUES
    }
  }
});


const INSIDE_AT_RULE_MEDIA = new Grammar({
  'support': {
    pattern: /\b(?:only|screen)\b/
  },

  'meta: property group': {
    pattern: /(\()(.*)(\))/,
    replacement: "#{1}#{2}#{3}",
    captures: {
      '2': () => MEDIA_AT_RULE_PROP_PAIR
    }
  }
}).extend(OPERATOR_LOGICAL);

const INSIDE_AT_RULE_IF = new Grammar({}).extend(
  FUNCTIONS, OPERATORS, VALUES);

const INSIDE_AT_RULE_INCLUDE = new Grammar({
}).extend(
  PARAMETERS,
  VALUES,
  {
    'string string-unquoted': {
      pattern: /\b\w+\b/
    }
  }
);

const INSIDE_AT_RULE_KEYFRAMES = new Grammar({
  'meta: from/to': {
    pattern: /\b(from|to)\b(\s*)(?={)/,
    captures: {
      '1': 'keyword'
    }
  },

  'meta: percentage': {
    pattern: /(\d+%)(\s*)(?={)/,
    captures: {
      '1': () => VALUES
    }
  }
}).extend(PROPERTIES);

const INSIDE_AT_RULE_SUPPORTS = new Grammar({
  'meta: property pair': {
    pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(?=\)|$)/,
    replacement: `<span class="property">#{1}</span>#{2}#{3}#{4}`,
    captures: {
      '1': 'property',
      '2': 'punctuation',
      '3': () => VALUES
    }
  }
}).extend(OPERATOR_LOGICAL);

const MEDIA_AT_RULE_PROP_PAIR = new Grammar({
  'meta: property pair': {
    pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(?=\)|$)/,
    captures: {
      '1': 'property',
      '3': () => VALUES
    }
  }
});

const INSIDE_URL_FUNCTION = new Grammar({}).extend(STRINGS, VARIABLES, FUNCTIONS);

const AT_RULES = new Grammar({
  'meta: at-rule': {
    pattern: /(@(?:elseif|if|else))(.*)({)/,
    captures: {
      '1': 'keyword keyword-at-rule keyword-at-rule-if',
      '2': INSIDE_AT_RULE_IF
    }
  },

  'keyword keyword-at-rule keyword-at-rule-keyframes': {
    pattern: /(@keyframes)(\s+)([a-z-]+)(\s*)({)([\s\S]*)(})/,
    index: (match) => {
      return balance(
        match, '}', '{',
        { startIndex: match.indexOf('{') }
      );
    },
    captures: {
      '1': 'keyword keyword-at-rule keyword-at-rule-keyframes',
      '3': 'entity',
      '6': INSIDE_AT_RULE_KEYFRAMES
    }
  },

  'keyword keyword-at-rule keyword-at-rule-log-directive': {
    pattern: /(@(?:error|warn|debug))(\s+|\()(.*)(\)?;)(\s*)(?=\n)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}",
    captures: {
      '3': STRINGS
    }
  },

  'keyword keyword-at-rule keyword-at-rule-each': {
    pattern: /(@each)(.*)\b(in)\b(.*)(\{)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}",
    captures: {
      '2': () => VARIABLES,
      '3': 'keyword',
      '4': () => VALUES
    }
  },

  'keyword keyword-at-rule keyword-at-rule-for': {
    pattern: /(@for)(.*)\b(from)\b(.*)(through)(.*)({)/,
    replacement: compact(`
      <span class='#{name}'>#{1}</span>
      #{2}#{3}#{4}#{5}#{6}#{7}
    `),
    captures: {
      '2': () => VARIABLES,
      '3': 'keyword',
      '4': () => VALUES,
      '5': 'keyword',
      '6': () => VALUES
    }
  },

  'keyword keyword-at-rule keyword-at-rule-mixin': {
    pattern: /(@mixin)(\s+)([A-Za-z-][A-Za-z0-9\-_]+)(?:(\s*\())?(.*)(?={)/,
    replacement: compact(`
      <span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}
    `),
    captures: {
      '3': 'function',
      '5': PARAMETERS
    }
  },

  'keyword keyword-at-rule keyword-at-rule-function': {
    pattern: /(@function)(\s+)([A-Za-z-][A-Za-z0-9\-_]+)(?:(\s*\())?(.*)(?={)/,
    replacement: compact(`
      <span class='#{name}'>#{1}</span>
      #{2}#{3}#{4}#{5}
    `),
    captures: {
      '3': 'function',
      '5': PARAMETERS
    }
  },

  'keyword keyword-at-rule keyword-at-rule-extend': {
    pattern: /(@extend)(\s+)(.*)(;)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
    before: (r, context) => {
      r[3] = SELECTORS.parse(r[3], context);
      r[3] = r[3].replace(/(class=)(["'])(?:selector)\b/g, '$1$2entity parameter');

      if ( (/!optional$/).test(r[3]) ) {
        r[3] = r[3].replace(
          /(!optional)$/,
          `<span class='keyword keyword-directive'>$1</span>`
        );
      }
    }
  },

  'keyword keyword-at-rule keyword-at-rule-include': {
    pattern: /(@include)(\s+)([A-Za-z][A-Za-z0-9\-_]+)(?:(\s*\())?([\s\S]*?)(;|\{)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}#{6}",
    captures: {
      '3': 'function',
      '5': INSIDE_AT_RULE_INCLUDE
    }
  },

  'keyword keyword-at-rule keyword-at-rule-media': {
    pattern: /(@media)(.*)({)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}",
    captures: {
      '2': INSIDE_AT_RULE_MEDIA
    }
  },

  'keyword keyword-at-rule keyword-at-rule-import': {
    pattern: /(@import)(.*)(;)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}",
    captures: {
      '2': STRINGS
    }
  },

  'keyword keyword-at-rule keyword-at-rule-content': {
    pattern: /(@content)(?=;)/
  },

  'keyword keyword-at-rule keyword-at-rule-charset': {
    pattern: /(@charset)(\s+)(.*)(;)(\s*)(?=\n|$)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}",
    captures: {
      '3': STRINGS
    }
  },

  'keyword keyword-at-rule keyword-at-rule-namespace': {
    pattern: /(@namespace)(\s+)(?:([a-zA-Z][a-zA-Z0-9]+)(\s+))?([^\s]*)(;)(?=\n|$)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}#{6}",
    captures: {
      '3': 'selector',
      '5': FUNCTIONS
    },
    before: (r, context) => {
      if (!r[3]) { r[4] = ''; }
    }
  },

  'keyword keyword-at-rule keyword-at-rule-supports': {
    pattern: /(@supports)(\s+)(.*)({)(\s*)(?=\n)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}",
    captures: {
      '3': INSIDE_AT_RULE_SUPPORTS
    }
  },

  'keyword keyword-at-rule keyword-at-rule-font-face': {
    pattern: /(@font-face)(\s*)({)(\s*)(?=\n)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}"
  },

  'keyword keyword-at-rule keyword-at-rule-return': {
    pattern: /(@return)(\s+)(.*)(;)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
    captures: {
      '3': () => VALUES
    }
  }
});

const MAIN = new Grammar('scss', {});

MAIN.extend(FUNCTIONS, VARIABLES, AT_RULES);

MAIN.extend({
  'meta: selector line': {
    pattern: VerboseRegExp`
      (^\s*)
      (
      (?:
        [>\+~]| # combinator (ugh)
        \.|     # class name
        \#|     # ID
        \[|     # attribute
        (?:&|&amp;)|      # self-reference
        %|      # abstract class name
        \*|     # wildcard

        # Otherwise, see if it matches a known tag name:
        (?:a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|eventsource|fieldset|figure|figcaption|footer|form|frame|frameset|(?:h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|svg|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\b
      )
      .*
      )
      # followed by a line ending with a comma or an opening brace.

      (,|\{)
    `,
    index: (match) => {
      let endIndex = findFirstThatIsNotPrecededBy('{', '#', match, 0);
      return endIndex;
    },
    // TODO: interpolations?
    captures: {
      '2': SELECTORS
    }
  }
});

MAIN.extend(PROPERTIES, COMMENTS);

export default MAIN;
