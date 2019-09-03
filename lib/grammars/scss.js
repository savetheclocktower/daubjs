(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('../daub')) :
	typeof define === 'function' && define.amd ? define(['../daub'], factory) :
	(global.daub = global.daub || {}, global.daub.scss = factory(global.daub));
}(this, (function (daub) { 'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();


var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};


var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};

var _templateObject = taggedTemplateLiteral(['\n      ([)               # 1: opening bracket\n      (                  # 2: attr name\n       [A-Za-z_-]        # initial character\n       [A-Za-z0-9_-]*\n      )                  # end group 2\n      (?:                # operator-and-value non-capturing group\n        ([~.$^]?=)      # 3: operator\n        (                # 4: value\n        ([\'"])(?:.*?)(?:\\5)| # 5: single/double quote, value, then same quote OR...\n        [^s]]          # any value that doesn\'t need to be quoted\n        )                # end group 4\n      )?                 # end operator-and-value (optional)\n      (])               # 6: closing bracket\n    '], ['\n      (\\[)               # 1: opening bracket\n      (                  # 2: attr name\n       [A-Za-z_-]        # initial character\n       [A-Za-z0-9_-]*\n      )                  # end group 2\n      (?:                # operator-and-value non-capturing group\n        ([~\\.$^]?=)      # 3: operator\n        (                # 4: value\n        ([\'"])(?:.*?)(?:\\\\5)| # 5: single/double quote, value, then same quote OR...\n        [^\\s\\]]          # any value that doesn\'t need to be quoted\n        )                # end group 4\n      )?                 # end operator-and-value (optional)\n      (\\])               # 6: closing bracket\n    ']);
var _templateObject2 = taggedTemplateLiteral(['\n      (             # 1: number\n        [+|-]?    # optional sign\n        (?:s*)?    # optional space\n        (?:         # EITHER\n          [0-9]+(?:.[0-9]+)? # digits with optional decimal point and more digits\n          |           # OR\n          .[0-9]+ # decimal point plus digits\n        )\n      )            # end group 1\n      (s*)        # 2: any space btwn number and unit\n      (            # 3: unit\n        (?:ch|cm|deg|dpi|dpcm|dppx|em|ex|\n        grad|in|mm|ms|pc|pt|px|rad|rem|\n        turn|s|vh|vmin|vw)\b # EITHER a unit\n        |          # OR\n        %          # a percentage\n      )\n    '], ['\n      (             # 1: number\n        [\\+|\\-]?    # optional sign\n        (?:\\s*)?    # optional space\n        (?:         # EITHER\n          [0-9]+(?:\\.[0-9]+)? # digits with optional decimal point and more digits\n          |           # OR\n          \\.[0-9]+ # decimal point plus digits\n        )\n      )            # end group 1\n      (\\s*)        # 2: any space btwn number and unit\n      (            # 3: unit\n        (?:ch|cm|deg|dpi|dpcm|dppx|em|ex|\n        grad|in|mm|ms|pc|pt|px|rad|rem|\n        turn|s|vh|vmin|vw)\\b # EITHER a unit\n        |          # OR\n        %          # a percentage\n      )\n    ']);
var _templateObject3 = taggedTemplateLiteral(['\n      (^s*)\n      (\n      (?:\n        [>+~]| # combinator (ugh)\n        .|     # class name\n        #|     # ID\n        [|     # attribute\n        (?:&|&amp;)|      # self-reference\n        %|      # abstract class name\n        *|     # wildcard\n\n        # Otherwise, see if it matches a known tag name:\n        (?:a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|eventsource|fieldset|figure|figcaption|footer|form|frame|frameset|(?:h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|svg|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\b\n      )\n      .*\n      )\n      # followed by a line ending with a comma or an opening brace.\n\n      (,|{)\n    '], ['\n      (^\\s*)\n      (\n      (?:\n        [>\\+~]| # combinator (ugh)\n        \\.|     # class name\n        \\#|     # ID\n        \\[|     # attribute\n        (?:&|&amp;)|      # self-reference\n        %|      # abstract class name\n        \\*|     # wildcard\n\n        # Otherwise, see if it matches a known tag name:\n        (?:a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|eventsource|fieldset|figure|figcaption|footer|form|frame|frameset|(?:h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|svg|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b\n      )\n      .*\n      )\n      # followed by a line ending with a comma or an opening brace.\n\n      (,|\\{)\n    ']);

var balance = daub.Utils.balance;
var compact = daub.Utils.compact;
var VerboseRegExp = daub.Utils.VerboseRegExp;


var findFirstThatIsNotPrecededBy = function findFirstThatIsNotPrecededBy(token, notToken, string, startIndex) {
  var lastChar = void 0;
  for (var i = startIndex; i < string.length; i++) {
    var char = string.slice(i, i + token.length);
    if (lastChar !== notToken && char === token) {
      return i;
    }
    lastChar = char.slice(-1);
  }
};

var FUNCTIONS = new daub.Grammar({
  'support support-function-call support-function-call-css-builtin': {
    pattern: /(attr|counter|rgb|rgba|hsl|hsla|calc)(\()(.*)(\))/,
    replacement: "<span class='#{name}'>#{1}</span><span class='punctuation'>#{2}</span>#{3}<span class='punctuation'>#{4}</span>",
    before: function before(r, context) {
      r[3] = VALUES.parse(r[3], context);
    }
  },
  'support support-function-call support-function-call-sass': {
    pattern: /(red|green|blue|mix|hue|saturation|lightness|adjust-hue|lighten|darken|saturate|desaturate|grayscale|complement|invert|alpha|opacity|opacify|transparentize|fade-in|fade-out|selector-(?:nest|replace)|unquote|quote|str-(?:length|insert|index|slice)|to-(?:upper|lower)-case|percentage|round|ceil|floor|abs|min|max|random|(?:feature|variable|global-variable|mixin)-exists|inspect|type-of|unit|unitless|comparable|call|if|unique-id)(\()(.*)(\))/,
    replacement: "<span class='#{name}'>#{1}</span><span class='punctuation'>#{2}</span>#{3}<span class='punctuation'>#{4}</span>",
    before: function before(r, context) {
      r[3] = VALUES.parse(r[3], context);
    }
  },

  'support support-function-call support-function-call-url': {
    pattern: /(url)(\()(.*)(\))/,
    index: function index(match) {
      return balance(match, ')', '(', { startIndex: match.indexOf('(') });
    },
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
    before: function before(r, context) {
      // The sole argument to `url` can be a quoted string or an unquoted
      // string. Apply interpolations either way.
      var transformed = INSIDE_URL_FUNCTION.parse(r[3], context);
      if (!/^('|")/.test(r[3])) {
        transformed = INTERPOLATIONS.parse(r[3], context);
        transformed = '<span class=\'string string-unquoted\'>' + transformed + '</span>';
      }
      r[3] = transformed;
    }
  },

  'support support-function-call support-function-call-custom': {
    pattern: /([A-Za-z_-][A-Za-z0-9_-]*)(\()(.*)(\))/,
    replacement: "<span class='#{name}'>#{1}</span><span class='punctuation'>#{2}</span>#{3}<span class='punctuation'>#{4}</span>",
    before: function before(r, context) {
      r[3] = VALUES.parse(r[3], context);
    }
  }
});

var INTERPOLATIONS = new daub.Grammar({
  interpolation: {
    pattern: /(\#\{)(.*?)(})/,
    replacement: "<span class='interpolation'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = VALUES.parse(r[2], context);
    }
  }
});

function variableRuleNamed(name) {
  return new daub.Grammar(defineProperty({}, name, { pattern: /\$[A-Za-z0-9_-]+/ }));
}

var VARIABLE = new daub.Grammar({
  'variable': {
    pattern: /\$[A-Za-z0-9_-]+/
  }
});

var VARIABLES = new daub.Grammar({
  'variable variable-assignment': {
    // NOTE: This is multiline. Will search until it finds a semicolon, even if it's not on the same line.
    pattern: /(\s*)(\$[A-Za-z][A-Za-z0-9_-]*)\b(\s*)(\:)([\s\S]*?)(;)/,
    replacement: compact('\n      #{1}\n      <span class=\'#{name}\'>#{2}</span>#{3}\n      <span class=\'punctuation\'>#{4}</span>\n      #{5}#{6}\n    '),
    // replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}<span class='punctuation'>#{4}</span>#{5}#{6}",
    before: function before(r, context) {
      r[5] = VALUES.parse(r[5], context);
    }
  }
}).extend(VARIABLE);

var PARAMETERS = new daub.Grammar({
  'parameter parameter-with-default': {
    pattern: /(\$[A-Za-z][A-Za-z0-9_-]*)(\s*:\s*)(.*?)(?=,|\)|\n)/,
    replacement: compact('\n      <span class="parameter">\n        <span class="variable">#{1}</span>\n        <span class="punctuation">#{2}</span>\n      #{3}\n      </span>\n    '),
    before: function before(r, context) {
      r[3] = VALUES.parse(r[3], context);
    }
  }
}).extend(variableRuleNamed('variable parameter'));

var SELECTORS = new daub.Grammar({
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
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = SELECTORS.parse(r[2], context);
      r[2] = '<span class=\'parameter\'>' + r[2] + '</span>';
    }
  },

  'selector selector-self-reference-bem-style': {
    pattern: /(?:&amp;|&)(?:__|--)(?:[A-Za-z0-9_-]+)?/
  },

  'selector selector-with-interpolation': {
    pattern: /(#\{)(.*)(\})/,
    index: function index(match) {
      return balance(match, '}', '{', { startIndex: match.indexOf('{') });
    },
    replacement: "<span class='selector interpolation'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = VALUES.parse(r[2], context);
    }

  },

  'selector selector-self-reference': {
    pattern: /(?:&amp;|&)/
  },

  'selector selector-pseudo selector-pseudo-with-args': {
    pattern: /((?:\:+)\b(?:lang|nth-(?:last-)?child|nth-(?:last-)?of-type))(\()(.*)(\))/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}#{4}</span>",
    before: function before(r, context) {
      r[3] = VALUES.parse(r[3], context);
    }
  },

  'selector selector-pseudo selector-pseudo-without-args': {
    pattern: /(:{1,2})(link|visited|hover|active|focus|targetdisabled|enabled|checked|indeterminate|root|first-child|last-child|first-of-type|last-of-type|only-child|only-of-type|empty|valid|invalid)/
  },

  'selector selector-pseudo selector-pseudo-element': {
    pattern: /(:{1,2})(-(?:webkit|moz|ms)-)?\b(after|before|first-letter|first-line|selection|any-link|local-link|(?:input-)?placeholder|focus-inner|matches|nth-match|column|nth-column)\b/
  },

  'selector selector-attribute': {
    pattern: VerboseRegExp(_templateObject),
    // pattern: /(\[)([A-Za-z_-][A-Za-z0-9_-]*)(?:([~\.$^]?=)((['"])(?:.*?)(?:\5)|[^\s\]]))?(\])/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}#{4}#{6}</span>",
    before: function before(r, context) {
      r[4] = STRINGS.parse(r[4], context);
    }
  },

  'selector selector-combinator': {
    pattern: /(\s*)([>+~])(\s*)/,
    replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}"
  }
});

var MAPS = new daub.Grammar({
  'meta: map pair': {
    // Property, then colon, then any value. Line terminates with a comma,
    // a newline, or the end of the string (but not a semicolon).
    pattern: /([a-zA-Z_-][a-zA-Z0-9_-]*)(\s*:\s*)(.*(?:,|\)|$))/,
    replacement: "<span class='entity'>#{1}</span>#{2}#{3}",
    before: function before(r, context) {
      r[3] = VALUES.parse(r[3], context);
    }
  }
});

var OPERATOR_LOGICAL = new daub.Grammar({
  'operator operator-logical': {
    pattern: /\b(and|or|not)\b/
  }
});

var OPERATORS = new daub.Grammar({
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

var VALUES = new daub.Grammar({
  // An arbitrary grouping of parentheses could also be a list, among other
  // things. But we don't need to apply special highlighting to lists;
  // their values will get highlighted.
  'meta: possible map': {
    pattern: /(\()([\s\S]+)(\))/,
    replacement: "#{1}#{2}#{3}",
    before: function before(r, context) {
      var mapPattern = /[A-Za-z_-][A-Za-z0-9_-]*:.*(?:,|\)|$)/;
      var grammar = VALUES;
      if (mapPattern.test(r[2])) {
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
    pattern: /inherit|initial|unset|none|auto|inline-block|block|inline|absolute|relative|solid|dotted|dashed|nowrap|normal|bold|italic|underline|overline|double|uppercase|lowercase|(?:border|content)-box/
  },

  'meta: value with unit': {
    pattern: VerboseRegExp(_templateObject2),
    replacement: "<span class='number'>#{1}</span>#{2}<span class='unit'>#{3}</span>"
  }
}).extend(OPERATORS, VARIABLE);

var NUMBERS = new daub.Grammar({
  'number': {
    pattern: /[\+|\-]?(\s*)?([0-9]+(\.[0-9]+)?|\.[0-9]+)/
  }
});

var STRINGS = new daub.Grammar({
  'string single-quoted': {
    pattern: /(')([^']*?)(')/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = INTERPOLATIONS.parse(r[2], context);
    }
  },

  'string double-quoted': {
    pattern: /(")(.*?[^\\])(")/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = INTERPOLATIONS.parse(r[2], context);
    }
  },

  'string single-quoted string-empty': {
    pattern: /''/
  },

  'string double-quoted string-empty': {
    pattern: /""/
  }
});

var COLORS = new daub.Grammar({
  'constant color-hex': {
    pattern: /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/
  },

  'constant color-named': {
    pattern: /\b(aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow)\b/
  }
});

var DIRECTIVES = new daub.Grammar({
  'keyword directive': {
    pattern: /\s+!(?:default|important|optional)/
  }
});

VALUES.extend(FUNCTIONS, STRINGS, COLORS, NUMBERS, DIRECTIVES);

VALUES.extend({
  'support': {
    pattern: /\b([\w-]+)\b/
  }
});

var COMMENTS = new daub.Grammar({
  'comment comment-line': {
    pattern: /(?:\s*)\/\/(?:.*?)(?=\n)/
  },
  'comment comment-block': {
    pattern: /(?:\s*)(\/\*)([\s\S]*)(\*\/)/
  }
});

var PROPERTIES = new daub.Grammar({
  'meta: property pair': {
    pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(;)/,
    replacement: '<span class="property">#{1}</span>#{2}#{3}#{4}',
    before: function before(r, context) {
      r[3] = VALUES.parse(r[3], context);
    }
  }
});

var INSIDE_AT_RULE_MEDIA = new daub.Grammar({
  'support': {
    pattern: /\b(?:only|screen)\b/
  },

  'meta: property group': {
    pattern: /(\()(.*)(\))/,
    replacement: "#{1}#{2}#{3}",
    before: function before(r, context) {
      r[2] = MEDIA_AT_RULE_PROP_PAIR.parse(r[2], context);
    }
  }
}).extend(OPERATOR_LOGICAL);

var INSIDE_AT_RULE_IF = new daub.Grammar({}).extend(FUNCTIONS, OPERATORS, VALUES);

var INSIDE_AT_RULE_INCLUDE = new daub.Grammar({}).extend(PARAMETERS, VALUES);

INSIDE_AT_RULE_INCLUDE.extend({
  'string string-unquoted': {
    pattern: /\b\w+\b/
  }
});

var INSIDE_AT_RULE_KEYFRAMES = new daub.Grammar({
  'meta: from/to': {
    pattern: /\b(from|to)\b(\s*)(?={)/,
    replacement: "<span class='keyword'>#{1}</span>#{2}"
  },

  'meta: percentage': {
    pattern: /(\d+%)(\s*)(?={)/,
    replacement: "#{1}#{2}",
    before: function before(r, context) {
      r[1] = VALUES.parse(r[1], context);
    }
  }
}).extend(PROPERTIES);

var INSIDE_AT_RULE_SUPPORTS = new daub.Grammar({
  'meta: property pair': {
    pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(?=\)|$)/,
    replacement: '<span class="property">#{1}</span>#{2}#{3}#{4}',
    before: function before(r, context) {
      r[3] = VALUES.parse(r[3], context);
    }
  }
}).extend(OPERATOR_LOGICAL);

var MEDIA_AT_RULE_PROP_PAIR = new daub.Grammar({
  'meta: property pair': {
    pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(?=\)|$)/,
    replacement: '<span class="property">#{1}</span>#{2}#{3}#{4}',
    before: function before(r, context) {
      r[3] = VALUES.parse(r[3], context);
    }
  }
});

var INSIDE_URL_FUNCTION = new daub.Grammar({}).extend(STRINGS, VARIABLES, FUNCTIONS);

var AT_RULES = new daub.Grammar({
  'keyword keyword-at-rule keyword-at-rule-if': {
    pattern: /(@(?:elseif|if|else))(.*)({)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}",
    before: function before(r, context) {
      r[2] = INSIDE_AT_RULE_IF.parse(r[2], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-keyframes': {
    pattern: /(@keyframes)(\s+)([a-z-]+)(\s*)({)([\s\S]*)(})/,
    index: function index(match) {
      return balance(match, '}', '{', { startIndex: match.indexOf('{') });
    },
    before: function before(r, context) {
      r[6] = INSIDE_AT_RULE_KEYFRAMES.parse(r[6], context);
    },
    replacement: compact('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      <span class=\'entity\'>#{3}</span>\n      #{4}#{5}#{6}#{7}\n    ')
    // replacement: "<span class='#{name}'>#{1}</span>#{2}<span class='entity'>#{3}</span>#{4}#{5}#{6}#{7}"
  },

  'keyword keyword-at-rule keyword-at-rule-log-directive': {
    pattern: /(@(?:error|warn|debug))(\s+|\()(.*)(\)?;)(\s*)(?=\n)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}",
    before: function before(r, context) {
      r[3] = STRINGS.parse(r[3], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-each': {
    pattern: /(@each)(.*)\b(in)\b(.*)(\{)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}<span class='keyword'>#{3}</span>#{4}#{5}",
    before: function before(r, context) {
      r[2] = VARIABLES.parse(r[2], context);
      r[4] = VALUES.parse(r[4], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-for': {
    pattern: /(@for)(.*)\b(from)\b(.*)(through)(.*)({)/,
    replacement: compact('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      <span class=\'keyword\'>#{3}</span>#{4}\n      <span class=\'keyword\'>#{5}</span>#{6}#{7}\n    '),
    before: function before(r, context) {
      r[2] = VARIABLES.parse(r[2], context);
      r[4] = VALUES.parse(r[4], context);
      r[6] = VALUES.parse(r[6], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-mixin': {
    pattern: /(@mixin)(\s+)([A-Za-z-][A-Za-z0-9\-_]+)(?:(\s*\())?(.*)(?={)/,
    replacement: compact('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      <span class=\'function\'>#{3}</span>#{4}#{5}\n    '),
    before: function before(r, context) {
      if (r[5]) {
        r[5] = PARAMETERS.parse(r[5], context);
      }
    }
  },

  'keyword keyword-at-rule keyword-at-rule-function': {
    pattern: /(@function)(\s+)([A-Za-z-][A-Za-z0-9\-_]+)(?:(\s*\())?(.*)(?={)/,
    replacement: compact('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      <span class=\'function\'>#{3}</span>#{4}#{5}\n    '),
    before: function before(r, context) {
      if (r[5]) {
        r[5] = PARAMETERS.parse(r[5], context);
      }
    }
  },

  'keyword keyword-at-rule keyword-at-rule-extend': {
    pattern: /(@extend)(\s+)(.*)(;)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
    before: function before(r, context) {
      r[3] = SELECTORS.parse(r[3], context);
      r[3] = r[3].replace(/(class=)(["'])(?:selector)\b/g, '$1$2entity parameter');

      if (/!optional$/.test(r[3])) {
        r[3] = r[3].replace(/(!optional)$/, '<span class=\'keyword keyword-directive\'>$1</span>');
      }
    }
  },

  'keyword keyword-at-rule keyword-at-rule-include': {
    pattern: /(@include)(\s+)([A-Za-z][A-Za-z0-9\-_]+)(?:(\s*\())?([\s\S]*?)(;|\{)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}<span class='function'>#{3}</span>#{4}#{5}#{6}",
    before: function before(r, context) {
      if (r[5]) {
        r[5] = INSIDE_AT_RULE_INCLUDE.parse(r[5], context);
      }
    }
  },

  'keyword keyword-at-rule keyword-at-rule-media': {
    pattern: /(@media)(.*)({)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}",
    before: function before(r, context) {
      r[2] = INSIDE_AT_RULE_MEDIA.parse(r[2], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-import': {
    pattern: /(@import)(.*)(;)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}",
    before: function before(r, context) {
      r[2] = STRINGS.parse(r[2], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-content': {
    pattern: /(@content)(?=;)/
  },

  'keyword keyword-at-rule keyword-at-rule-charset': {
    pattern: /(@charset)(\s+)(.*)(;)(\s*)(?=\n|$)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}",
    before: function before(r, context) {
      r[3] = STRINGS.parse(r[3], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-namespace': {
    pattern: /(@namespace)(\s+)(?:([a-zA-Z][a-zA-Z0-9]+)(\s+))?([^\s]*)(;)(?=\n|$)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}<span class='selector'>#{3}</span>#{4}#{5}#{6}",
    before: function before(r, context) {
      if (!r[3]) {
        r[4] = '';
      }
      r[5] = FUNCTIONS.parse(r[5], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-supports': {
    pattern: /(@supports)(\s+)(.*)({)(\s*)(?=\n)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}",
    before: function before(r, context) {
      r[3] = INSIDE_AT_RULE_SUPPORTS.parse(r[3], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-font-face': {
    pattern: /(@font-face)(\s*)({)(\s*)(?=\n)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}"
  },

  'keyword keyword-at-rule keyword-at-rule-return': {
    pattern: /(@return)(\s+)(.*)(;)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
    before: function before(r, context) {
      r[3] = VALUES.parse(r[3], context);
    }
  }
});

var MAIN = new daub.Grammar('scss', {});

MAIN.extend(FUNCTIONS, VARIABLES, AT_RULES);

MAIN.extend({
  'meta: selector line': {
    pattern: VerboseRegExp(_templateObject3),
    index: function index(match) {
      var endIndex = findFirstThatIsNotPrecededBy('{', '#', match, 0);
      return endIndex;
    },
    replacement: "#{1}#{2}#{3}",
    before: function before(r, context) {
      // TODO: interpolations?
      r[2] = SELECTORS.parse(r[2], context);
    }
  }
});

MAIN.extend(PROPERTIES, COMMENTS);

return MAIN;

})));
