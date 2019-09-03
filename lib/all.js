(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./daub')) :
	typeof define === 'function' && define.amd ? define(['./daub'], factory) :
	(global.daub = global.daub || {}, global.daub.all = factory(global.daub));
}(this, (function (Daub) { 'use strict';

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





















var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();



var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};

var _templateObject = taggedTemplateLiteral(['\n      (&lt;|<)(script|SCRIPT) # 1, 2: opening script element\n      (s+.*?)?               # 3: space and optional attributes\n      (&gt;|>)                # 4: end opening element\n      ([sS]*?)              # 5: contents\n      ((?:&lt;|<)/)(script|SCRIPT)(&gt;|>) # 6, 7, 8: closing script element\n    '], ['\n      (&lt;|<)(script|SCRIPT) # 1, 2: opening script element\n      (\\s+.*?)?               # 3: space and optional attributes\n      (&gt;|>)                # 4: end opening element\n      ([\\s\\S]*?)              # 5: contents\n      ((?:&lt;|<)\\/)(script|SCRIPT)(&gt;|>) # 6, 7, 8: closing script element\n    ']);

var compact = Daub.Utils.compact;
var VerboseRegExp = Daub.Utils.VerboseRegExp;


var ATTRIBUTES = new Daub.Grammar({
  string: {
    pattern: /('[^']*[^\\]'|"[^"]*[^\\]")/
  },

  attribute: {
    pattern: /\b([a-zA-Z-:]+)(=)/,
    replacement: compact('\n      <span class=\'attribute\'>\n        <span class=\'#{name}\'>#{1}</span>\n        <span class=\'punctuation\'>#{2}</span>\n      </span>\n    ')
  }
});

var MAIN = new Daub.Grammar('html', {
  doctype: {
    pattern: /&lt;!DOCTYPE([^&]|&[^g]|&g[^t])*&gt;/
  },

  'embedded embedded-javascript': {
    pattern: VerboseRegExp(_templateObject),
    replacement: compact('\n      <span class=\'element element-opening\'>\n        <span class=\'punctuation\'>#{1}</span>\n        <span class=\'tag\'>#{2}</span>#{3}\n        <span class=\'punctuation\'>#{4}</span>\n      </span>\n        #{5}\n      <span class=\'element element-closing\'>\n        <span class=\'punctuation\'>#{6}</span>\n        <span class=\'tag\'>#{7}</span>\n        <span class=\'punctuation\'>#{8}</span>\n      </span>\n    '),
    before: function before(r, context) {
      if (r[3]) {
        r[3] = ATTRIBUTES.parse(r[3], context);
      }
      r[5] = context.highlighter.parse(r[5], 'javascript', context);
    }
  },

  'tag tag-open': {
    pattern: /((?:<|&lt;))([a-zA-Z0-9:]+\s*)(.*?)(\/)?(&gt;|>)/,
    replacement: compact('\n      <span class=\'element element-opening\'>\n        <span class=\'punctuation\'>#{1}</span>\n        <span class=\'tag\'>#{2}</span>#{3}\n        <span class=\'punctuation\'>#{4}#{5}</span>\n      </span>\n    '),
    before: function before(r, context) {
      r[3] = ATTRIBUTES.parse(r[3], context);
    }
  },

  'tag tag-close': {
    pattern: /(&lt;\/)([a-zA-Z0-9:]+)(&gt;)/,
    replacement: compact('\n      <span class=\'element element-closing\'>\n        <span class=\'punctuation\'>#{1}</span>\n        <span class=\'tag\'>#{2}</span>\n        <span class=\'punctuation\'>#{3}</span>\n      </span>\n    ')
  },

  comment: {
    pattern: /&lt;!\s*(--([^-]|[\r\n]|-[^-])*--\s*)&gt;/
  }
}, { encode: true });

var _templateObject$1 = taggedTemplateLiteral(['\n      (()            # 1: open paren\n      ([^)]*?)       # 2: raw params\n      ())            # 3: close paren\n      (s*)           # 4: space\n      (=(?:&gt;|>))   # 5: fat arrow\n    '], ['\n      (\\()            # 1: open paren\n      ([^\\)]*?)       # 2: raw params\n      (\\))            # 3: close paren\n      (\\s*)           # 4: space\n      (=(?:&gt;|>))   # 5: fat arrow\n    ']);
var _templateObject2 = taggedTemplateLiteral(['\n      \b(function)\n      (s*)\n      ([a-zA-Z_$]w*)? # function name (optional)\n      (s*)\n      (()             # open parenthesis\n      (.*?)            # raw params\n      ())             # close parenthesis\n    '], ['\n      \\b(function)\n      (\\s*)\n      ([a-zA-Z_$]\\w*)? # function name (optional)\n      (\\s*)\n      (\\()             # open parenthesis\n      (.*?)            # raw params\n      (\\))             # close parenthesis\n    ']);
var _templateObject3 = taggedTemplateLiteral(['\n      (^s*)\n      (get|set|static)? # 1: annotation\n      (s*)             # 2: space\n      ([a-zA-Z_$][a-zA-Z0-9$_]*) # 3: function name\n      (s*)             # 4: space\n      (()              # 5: open parenthesis\n      (.*?)             # 6: raw params\n      ())              # 7: close parenthesis\n      (s*)             # 8: space\n      ({)              # 9: opening brace\n    '], ['\n      (^\\s*)\n      (get|set|static)? # 1: annotation\n      (\\s*)             # 2: space\n      ([a-zA-Z_$][a-zA-Z0-9$_]*) # 3: function name\n      (\\s*)             # 4: space\n      (\\()              # 5: open parenthesis\n      (.*?)             # 6: raw params\n      (\\))              # 7: close parenthesis\n      (\\s*)             # 8: space\n      (\\{)              # 9: opening brace\n    ']);
var _templateObject4 = taggedTemplateLiteral(['\n      \b\n      ([a-zA-Z_?.$]+w*) # variable name\n      (s*)\n      (=)\n      (s*)\n      (function)\n      (s*)\n      (()\n      (.*?)       # raw params\n      ())\n    '], ['\n      \\b\n      ([a-zA-Z_?\\.$]+\\w*) # variable name\n      (\\s*)\n      (=)\n      (\\s*)\n      (function)\n      (\\s*)\n      (\\()\n      (.*?)       # raw params\n      (\\))\n    ']);
var _templateObject5 = taggedTemplateLiteral(['\n      (class)                # 1: storage\n      (?:                    # begin optional class name\n        (s+)                # 2: space\n        ([A-Z][A-Za-z0-9_]*) # 3: class name\n      )?                     # end optional class name\n      (?:                    # begin optional \'extends\' keyword\n        (s+)                # 4: space\n        (extends)            # 5: storage\n        (s+)                # 6: space\n        ([A-Z][A-Za-z0-9_]*) # 7: superclass name\n      )?                     # end optional \'extends\' keyword\n      (s*)                  # 8: space\n      ({)                    # 9: opening brace\n    '], ['\n      (class)                # 1: storage\n      (?:                    # begin optional class name\n        (\\s+)                # 2: space\n        ([A-Z][A-Za-z0-9_]*) # 3: class name\n      )?                     # end optional class name\n      (?:                    # begin optional \'extends\' keyword\n        (\\s+)                # 4: space\n        (extends)            # 5: storage\n        (\\s+)                # 6: space\n        ([A-Z][A-Za-z0-9_]*) # 7: superclass name\n      )?                     # end optional \'extends\' keyword\n      (\\s*)                  # 8: space\n      ({)                    # 9: opening brace\n    ']);

/* eslint-disable no-useless-escape */
var balance = Daub.Utils.balance;
var compact$1 = Daub.Utils.compact;
var wrap = Daub.Utils.wrap;
var VerboseRegExp$1 = Daub.Utils.VerboseRegExp;

// TODO:
// * Generators

var ESCAPES = new Daub.Grammar({
  escape: {
    pattern: /\\./
  }
});

var REGEX_INTERNALS = new Daub.Grammar({
  escape: {
    pattern: /\\./
  },

  'exclude from group begin': {
    pattern: /(\\\()/,
    replacement: "#{1}"
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

function handleParams(text, context) {
  return PARAMETERS.parse(text, context);
}

var INSIDE_TEMPLATE_STRINGS = new Daub.Grammar({
  'interpolation': {
    pattern: /(\$\{)(.*?)(\})/,
    replacement: "<span class='#{name}'><span class='punctuation'>#{1}</span><span class='interpolation-contents'>#{2}</span><span class='punctuation'>#{3}</span></span>",
    before: function before(r, context) {
      r[2] = MAIN$1.parse(r[2], context);
    }
  }
}).extend(ESCAPES);

var PARAMETERS = new Daub.Grammar({
  'parameter parameter-with-default': {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,
    replacement: compact$1('\n      <span class="parameter">\n        <span class="variable">#{1}</span>\n        <span class="operator">#{2}</span>\n      #{3}\n      </span>\n    '),
    before: function before(r, context) {
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

var VALUES = new Daub.Grammar({
  constant: {
    pattern: /\b(?:arguments|this|false|true|super|null|undefined)\b/
  },

  'number number-binary-or-octal': {
    pattern: /0[bo]\d+/
  },

  number: {
    pattern: /(?:\d*\.?\d+)/
  },

  'string string-template embedded': {
    pattern: /(`)([^`]*)(`)/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
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
    before: function before(r, context) {
      // console.log('match:', r[2]);
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
    before: function before(r, context) {
      r[2] = ESCAPES.parse(r[2], context);
    }
  },

  comment: {
    pattern: /(\/\/[^\n]*\n)|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
  },

  regexp: {
    // No such thing as an empty regex, so we can get away with requiring at
    // least one not-backslash character before the end delimiter.
    pattern: /(\/)(.*?[^\\])(\/)([mgiy]*)/,
    replacement: "<span class='regexp'>#{1}#{2}#{3}#{4}</span>",
    before: function before(r, context) {
      r[2] = REGEX_INTERNALS.parse(r[2], context);
      if (r[4]) r[4] = wrap(r[4], 'keyword regexp-flags');
    }
  }
});

var DESTRUCTURING = new Daub.Grammar({
  alias: {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,
    replacement: "<span class='entity'>#{1}</span>#{2}#{3}#{4}"
  },

  variable: {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  }
});

var MAIN$1 = new Daub.Grammar('javascript', {}, { alias: ['js'] });
MAIN$1.extend(VALUES);
MAIN$1.extend({
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
    before: function before(r, context) {
      r[1] = handleParams(r[1], context);
    }
  },

  'meta: fat arrow function, args in parens': {
    pattern: VerboseRegExp$1(_templateObject$1),
    replacement: "#{1}#{2}#{3}#{4}#{5}",
    before: function before(r, context) {
      r[2] = handleParams(r[2], context);
    }
  },

  'keyword keyword-new': {
    pattern: /new(?=\s[A-Za-z_$])/
  },

  'variable variable-declaration': {
    pattern: /\b(var|let|const)(\s+)([A-Za-z_$][_$A-Z0-9a-z]*?)(?=\s|=|;|,)/,
    replacement: "<span class='storage'>#{1}</span>#{2}<span class='#{name}'>#{3}</span>"
  },

  'variable variable-assignment': {
    pattern: /(\s+|,)([A-Za-z_$][\w\d$]*?)(\s*)(?==)/,
    replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}"
  },

  'meta: destructuring assignment': {
    pattern: /(let|var|const)(\s+)(\{|\[)([\s\S]*)(\}|\])(\s*)(?==)/,
    index: function index(matchText) {
      var pairs = { '{': '}', '[': ']' };
      var match = /(let|var|const|)(\s+)(\{|\[)/.exec(matchText);
      var char = match[3],
          paired = pairs[char];
      return balance(matchText, char, paired, { startIndex: matchText.indexOf(char) + 1 });
    },
    replacement: "<span class='storage'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
    before: function before(r, context) {
      r[4] = DESTRUCTURING.parse(r[4], context);
    }
  },

  'function function-expression': {
    pattern: VerboseRegExp$1(_templateObject2),
    replacement: "<span class='keyword keyword-function'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
    before: function before(r, context) {
      if (r[3]) r[3] = '<span class=\'entity\'>' + r[3] + '</span>';
      r[6] = handleParams(r[6], context);
      return r;
    }
  },

  'function function-literal-shorthand-style': {
    pattern: VerboseRegExp$1(_templateObject3),

    replacement: "#{1}#{2}#{3}<span class='entity'>#{4}</span>#{5}#{6}#{7}#{8}#{9}#{10}",
    before: function before(r, context) {
      if (r[2]) r[2] = '<span class=\'storage\'>' + r[1] + '</span>';
      r[7] = handleParams(r[7], context);
    }
  },

  'function function-assigned-to-variable': {
    pattern: VerboseRegExp$1(_templateObject4),
    replacement: "<span class='variable'>#{1}</span>#{2}#{3}#{4} <span class='keyword'>#{5}</span>#{6}#{7}#{8}#{9}",
    before: function before(r, context) {
      r[8] = handleParams(r[8], context);
    }
  },

  'meta: property then function': {
    pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(:)(\s*)(?=function)/,
    replacement: "<span class='entity'>#{1}</span>#{2}#{3}"
  },

  'entity': {
    pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(?=:)/
  },

  'meta: class definition': {
    pattern: VerboseRegExp$1(_templateObject5),
    index: function index(match) {
      return balance(match, '}', '{', { startIndex: match.indexOf('{') + 1 });
      // return findBalancedToken('}', '{', match, match.indexOf('{') + 1);
    },
    replacement: compact$1('\n      <span class="storage">#{1}</span>\n      #{2}#{3}\n      #{4}#{5}#{6}#{7}\n      #{8}#{9}\n    '),
    before: function before(r) {
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

var _templateObject$2 = taggedTemplateLiteral(['\n    \b\n    (?:from|if|else|elif|print|import|class|pass|\n      try|finally|except|return|global|nonlocal)\n    \b\n    '], ['\n    \\b\n    (?:from|if|else|elif|print|import|class|pass|\n      try|finally|except|return|global|nonlocal)\n    \\b\n    ']);
var _templateObject2$1 = taggedTemplateLiteral(['\n      (def)             # 1: keyword\n      (s+)             # 2: space\n      ([A-Za-z0-9_!?]+) # 3: method name\n      (s*)             # 4: space\n      (()              # 5: open paren\n      (.*?)?            # 6: parameters (optional)\n      ())              # 7: close paren\n    '], ['\n      (def)             # 1: keyword\n      (\\s+)             # 2: space\n      ([A-Za-z0-9_!?]+) # 3: method name\n      (\\s*)             # 4: space\n      (\\()              # 5: open paren\n      (.*?)?            # 6: parameters (optional)\n      (\\))              # 7: close paren\n    ']);
var _templateObject3$1 = taggedTemplateLiteral(['\n      ([A-Za-z0-9_!?]+)  # 1: method name\n      (s*)              # 2: optional space\n      ((s*)            # 3: opening paren plus optional space\n      ([sS]*)          # 4: inside parens (greedy)\n      (s*))            # 5: closing paren\n    '], ['\n      ([A-Za-z0-9_!?]+)  # 1: method name\n      (\\s*)              # 2: optional space\n      (\\(\\s*)            # 3: opening paren plus optional space\n      ([\\s\\S]*)          # 4: inside parens (greedy)\n      (\\s*\\))            # 5: closing paren\n    ']);

var balance$1 = Daub.Utils.balance;
var wrap$1 = Daub.Utils.wrap;
var compact$2 = Daub.Utils.compact;
var VerboseRegExp$2 = Daub.Utils.VerboseRegExp;

// function wrapParameter (param) {
//   let className = 'variable parameter';
//   return `<span class='${className}'>${param}</span>`;
// }

function handleParameters(str, context) {
  var parts = str.split(/,[ \t]*/).map(function (part) {
    return highlightParameters(part, MAIN$2, false, context);
  });
  return parts.join(', ');
}

function handleArguments(str, context) {
  console.log('handleArguments', str);
  var parts = str.split(/,[ \t]*/).map(function (part) {
    return highlightParameters(part, MAIN$2, true, context);
  });
  return parts.join(', ');
}

var DEFAULT_VALUE_PATTERN = /(^|\s+)([A-Za-z0-9_]+)(\s*=\s*)(.*)/gm;
function highlightParameters(part, grammar, onlyHighlightKeywordArgs, context) {
  if (!grammar) {
    grammar = MAIN$2;
  }

  if (DEFAULT_VALUE_PATTERN.test(part)) {
    // This parameter has a default value set.
    part = part.replace(DEFAULT_VALUE_PATTERN, function (match) {
      for (var _len = arguments.length, m = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        m[_key - 1] = arguments[_key];
      }

      var space = m[0],
          name = m[1],
          eq = m[2],
          value = m[3];

      name = wrap$1(name, 'variable parameter');
      eq = wrap$1(eq, 'keyword punctuation');
      value = grammar.parse(value);
      return space + name + eq + value;
    });
  } else {
    part = onlyHighlightKeywordArgs ? grammar.parse(part, context) : wrap$1(part, 'variable parameter');
  }
  return part;
}

var STRINGS = new Daub.Grammar({
  interpolation: {
    pattern: /\{(\d*)\}/
  }
});

var MAIN$2 = new Daub.Grammar('python', {
  'keyword keyword-import': {
    pattern: /(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(?=\n)/,
    replacement: compact$2('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      #{3}#{4}\n      <span class=\'keyword\'>#{5}</span>#{6}\n      #{7}\n    ')
  },

  'meta: subclass': {
    pattern: /(class)(\s+)([\w\d_]+)\(([\w\d_]*)\):/,
    replacement: compact$2('\n      <span class=\'keyword\'>#{1}</span>#{2}\n      <span class=\'entity entity-class class\'>#{3}</span>\n      (<span class=\'entity entity-class entity-superclass\'>#{4}</span>) :\n    ')
  },

  'meta: class': {
    pattern: /(class)(\s+)([\w\d_]+):/,
    replacement: "<span class='keyword'>#{1}</span>#{2}<span class='entity entity-class class'>#{3}</span>:"
  },

  comment: {
    pattern: /#[^\n]*(?=\n)/
  },

  keyword: {
    pattern: VerboseRegExp$2(_templateObject$2)
  },

  'string string-triple-quoted': {
    pattern: /"""[\s\S]*?"""/,
    before: function before(r, context) {
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
    before: function before(r) {
      var name = void 0;
      if (r[1]) name = 'string-single-quoted';
      if (r[2]) name = 'string-double-quoted';
      r.name += ' ' + name;
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
    pattern: VerboseRegExp$2(_templateObject2$1),
    replacement: compact$2('\n      <span class=\'keyword\'>#{1}</span>#{2}\n      <span class=\'entity\'>#{3}</span>#{4}\n      #{5}#{6}#{7}\n    '),
    before: function before(r, context) {
      if (r[6]) {
        r[6] = handleParameters(r[6], context);
      }
    }
  },

  'meta: method invocation': {
    pattern: VerboseRegExp$2(_templateObject3$1),
    index: function index(text) {
      return balance$1(text, ')', '(', text.indexOf('('));
    },
    replacement: "#{1}#{2}#{3}#{4}#{5}",
    before: function before(r, context) {
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

var _templateObject$3 = taggedTemplateLiteral(['\n      (do)         # keyword\n      (s*)\n      (|)         # opening pipe\n      ([^|]*?)     # params\n      (|)         # closing pipe\n    '], ['\n      (do)         # keyword\n      (\\s*)\n      (\\|)         # opening pipe\n      ([^|]*?)     # params\n      (\\|)         # closing pipe\n    ']);
var _templateObject2$2 = taggedTemplateLiteral(['\n      (class)               # keyword\n      (s+)\n      ([A-Z][A-Za-z0-9_]*)  # class name\n      (s*(?:<|&lt;)s*)    # inheritance symbol, encoded or not\n      ([A-Z][A-Za-z0-9:_]*) # superclass\n    '], ['\n      (class)               # keyword\n      (\\s+)\n      ([A-Z][A-Za-z0-9_]*)  # class name\n      (\\s*(?:<|&lt;)\\s*)    # inheritance symbol, encoded or not\n      ([A-Z][A-Za-z0-9:_]*) # superclass\n    ']);

var balance$2 = Daub.Utils.balance;
var compact$3 = Daub.Utils.compact;
var VerboseRegExp$3 = Daub.Utils.VerboseRegExp;


function hasOnlyLeftBrace(part) {
  return part.includes('{') && !part.includes('}');
}

function findEndOfHash(allParts, startIndex) {
  var parts = allParts.slice(startIndex);

  // Join the parts together so we can search one string to find the balanced
  // brace.
  var str = parts.join('');
  var index = balance$2(str, '}', '{', { stackDepth: 1 });
  if (index === -1) {
    return;
  }

  // Loop through the parts until we figure out which part that balance brace
  // belongs to.
  var totalLength = 0;
  for (var i = startIndex; i < allParts.length; i++) {
    totalLength += allParts[i].length;
    if (totalLength >= index) {
      return i;
    }
  }
}

function rejoinHash(parts, startIndex, endIndex) {
  var result = [];
  for (var i = startIndex; i <= endIndex; i++) {
    result.push(parts[i]);
  }return result.join(',');
}

function parseParameters(str, grammar, context) {
  if (!grammar) grammar = PARAMETERS$1;

  var rawParts = str.split(/,/),
      parameters = [];
  for (var i = 0, rawPart; i < rawParts.length; i++) {
    rawPart = rawParts[i];
    if (hasOnlyLeftBrace(rawPart)) {
      // We've split in the middle of a hash. Find the end of the hash and
      // rejoin.
      var endIndex = findEndOfHash(rawParts, i + 1);
      var rejoined = rejoinHash(rawParts, i, endIndex);

      parameters.push(rejoined);
      i = endIndex;
    } else {
      parameters.push(rawPart);
    }
  }

  return parameters.map(function (p) {
    return grammar.parse(p, context);
  });
}

var PARAMETERS$1 = new Daub.Grammar({
  'meta: parameter with default': {
    pattern: /^(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*)/,
    replacement: '#{1}<span class=\'variable parameter\'>#{2}</span><span class=\'keyword punctuation\'>#{3}</span>#{4}',

    before: function before(r, context) {
      r[4] = VALUES$1.parse(r[4], context);
    }
  },

  'variable parameter': {
    pattern: /^(\s*)([A-Za-z0-9_]+)$/,
    replacement: "#{1}<span class='#{name}'>#{2}</span>"
  }
});

// Block parameters get a separate grammar because they can't have defaults.
var BLOCK_PARAMETERS = new Daub.Grammar({
  'variable parameter': {
    pattern: /^(\s*)([A-Za-z0-9_]+)$/,
    replacement: "#{1}<span class='#{name}'>#{2}</span>"
  }
});

// Values.
// In other words, (nearly) anything that's valid on the right hand side of
// an assignment operator.
var VALUES$1 = new Daub.Grammar({
  // Single-quoted strings are easy; they have no escapes _or_
  // interpolation.
  'single-quoted string': {
    pattern: /(')([^']*?)(')/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>"
  },

  'double-quoted string': {
    pattern: /(")(.*?[^\\])(")/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = STRINGS$1.parse(r[2], context);
    }
  },

  // Probably could rewrite the above pattern to catch this, but this is
  // good enough for now.
  'double-quoted string empty': {
    pattern: /\"\"/
  },

  'string percent-q percent-q-braces': {
    // Capture group 2 is greedy because we don't know how much of this
    // pattern is ours, so we ask for everything up until the last brace in
    // the text. Then we find the balanced closing brace and act upon that
    // instead.
    pattern: /(%Q\{)([\s\S]*)(\})/,

    index: function index(text) {
      return balance$2(text, '}', '{', { startIndex: text.indexOf('{') });
    },

    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",

    // When we receive matches here, they won't be against the entire string
    // that the pattern originally matched; they'll be against the segment of
    // the string that we later decided we cared about.
    before: function before(r, context) {
      r[2] = STRINGS$1.parse(r[2], context);
    }
  },

  'string percent-q percent-q-brackets': {
    pattern: /(%Q\[)(.*?[^\\])(\])/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = STRINGS$1.parse(r[2], context);
    }
  },

  'string embedded string-shell-command': {
    pattern: /(`)([^`]*?)(`)/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = STRINGS$1.parse(r[2], context);
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
    pattern: /:'([^']*?)'/
  },

  'symbol double-quoted': {
    pattern: /(:)(")(.*?[^\\])(")/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}#{4}</span>",
    before: function before(r, context) {
      r[3] = STRINGS$1.parse(r[3], context);
    }
  },

  regexp: {
    pattern: /(\/)(.*?)(\/)/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = REGEX_INTERNALS$1.parse(r[2], context);
    }
  },

  'variable variable-instance': {
    pattern: /(@)[a-zA-Z_]\w*/
  },

  keyword: {
    pattern: /\b(do|class|def|if|module|yield|then|else|for|until|unless|while|elsif|case|when|break|retry|redo|rescue|require|lambda)\b/
  }

});

var REGEX_INTERNALS$1 = new Daub.Grammar({
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

var STRINGS$1 = new Daub.Grammar({
  escape: {
    pattern: /\\./
  },

  interpolation: {
    pattern: /(#\{)(.*?)(\})/,
    replacement: "<span class='#{name}'><span class='punctuation'>#{1}</span>#{2}<span class='punctuation'>#{3}</span></span>",
    before: function before(r, context) {
      r[2] = MAIN$3.parse(r[2], context);
    }
    // TODO: Re-parse inside?
  }
});

var MAIN$3 = new Daub.Grammar('ruby', {
  'meta: method definition': {
    pattern: /(def)(\s+)([A-Za-z0-9_!?.]+)(?:\s*(\()(.*?)(\)))?/,
    replacement: "<span class='keyword'>#{1}</span>#{2}<span class='entity'>#{3}</span>#{4}#{5}#{6}",
    before: function before(r, context) {
      if (r[5]) r[5] = parseParameters(r[5], null, context);
    }
  },

  'block block-braces': {
    pattern: /(\{)(\s*)(\|)([^|]*?)(\|)/,
    replacement: compact$3('\n      <b class=\'#{name}\'>\n        <span class=\'punctuation brace\'>#{1}</span>#{2}\n        <span class=\'punctuation pipe\'>#{3}</span>\n        #{4}\n        <span class=\'punctuation pipe\'>#{5}</span>\n    '),
    before: function before(r, context) {
      // Keep a LIFO stack of block braces. When we encounter a brace that
      // we don't recognize later on, we'll pop the last scope off of the
      // stack and highlight it thusly.
      var stack = context.get('bracesStack', []);
      stack.push(r.name);
      r[4] = parseParameters(r[4], BLOCK_PARAMETERS, context);
    }
  },

  'block block-do-end': {
    pattern: VerboseRegExp$3(_templateObject$3),
    replacement: compact$3('\n      <b class=\'#{name}\'>\n        <span class=\'keyword\'>#{1}</span>#{2}\n        <span class=\'punctuation pipe\'>#{3}</span>\n        #{4}\n        <span class=\'punctuation pipe\'>#{5}</span>\n    '),
    before: function before(r, context) {
      // Keep a LIFO stack of block braces. When we encounter a brace that
      // we don't recognize later on, we'll pop the last scope off of the
      // stack and highlight it thusly.
      var stack = context.get('bracesStack', []);
      stack.push(r.name);
      r[4] = parseParameters(r[4], null, context);
      r[6] = MAIN$3.parse(r[6], context);
    }
  },

  'meta: class definition with superclass': {
    pattern: VerboseRegExp$3(_templateObject2$2),
    replacement: compact$3('\n      <span class=\'keyword\'>#{1}</span>#{2}\n      <span class=\'class-definition-signature\'>\n        <span class=\'class\'>#{3}</span>#{4}<span class=\'class superclass\'>#{5}</span>\n      </span>\n    ')
  },

  'meta: class or module definition': {
    pattern: /(class|module)(\s+)([A-Z][A-Za-z0-9_]*)\s*(?=$|\n)/,
    replacement: compact$3('\n      <span class=\'keyword\'>#{1}</span>#{2}\n      <span class=\'class-definition-signature\'>\n        <span class=\'class\'>#{3}</span>\n      </span>\n    ')
  },

  'string heredoc-indented': {
    pattern: /(&lt;&lt;-|<<-)([_\w]+?)\b([\s\S]+?)(\2)/,
    replacement: compact$3('\n      <span class=\'#{name}\'>\n        <span class=\'begin\'>#{1}#{2}</span>\n        #{3}\n        <span class=\'end\'>#{4}</span>\n      </span>\n    '),
    before: function before(r, context) {
      r[3] = STRINGS$1.parse(r[3], context);
    }
  },

  'keyword operator': {
    pattern: /(\+|-|\*|\/|>|&gt;|<|&lt;|=>|=&gt;|>>|&gt;&gt;|<<|&lt;&lt;|=~|\|\|=|==|=|\|\||&&|\+=|-=|\*=|\/=)/
  },

  'keyword special': {
    pattern: /\b(initialize|new|loop|extend|raise|attr|catch|throw|private|protected|public|module_function|attr_(?:reader|writer|accessor))\b/
  }
});

MAIN$3.extend(VALUES$1);

// These need to be lowest possible priority, so we put them in after the
// values grammar.
MAIN$3.extend({
  comment: {
    pattern: /#[^\n]+/
  },

  'bracket-block-end': {
    pattern: /\}/,
    replacement: "#{0}",
    after: function after(text, context) {
      var stack = context.get('bracesStack', []);
      var scope = stack.pop();
      if (!scope) return;
      return text + '<!-- close ' + scope + ' --></b>';
    }
  },

  'keyword keyword-block-end': {
    pattern: /\b(end)\b/,
    after: function after(text, context) {
      var stack = context.get('bracesStack', []);
      var scope = stack.pop();
      if (!scope) return;
      return text + '<!-- close ' + scope + ' --></b>';
    }
  }
});

var _templateObject$4 = taggedTemplateLiteral(['\n      ([)               # 1: opening bracket\n      (                  # 2: attr name\n       [A-Za-z_-]        # initial character\n       [A-Za-z0-9_-]*\n      )                  # end group 2\n      (?:                # operator-and-value non-capturing group\n        ([~.$^]?=)      # 3: operator\n        (                # 4: value\n        ([\'"])(?:.*?)(?:\\5)| # 5: single/double quote, value, then same quote OR...\n        [^s]]          # any value that doesn\'t need to be quoted\n        )                # end group 4\n      )?                 # end operator-and-value (optional)\n      (])               # 6: closing bracket\n    '], ['\n      (\\[)               # 1: opening bracket\n      (                  # 2: attr name\n       [A-Za-z_-]        # initial character\n       [A-Za-z0-9_-]*\n      )                  # end group 2\n      (?:                # operator-and-value non-capturing group\n        ([~\\.$^]?=)      # 3: operator\n        (                # 4: value\n        ([\'"])(?:.*?)(?:\\\\5)| # 5: single/double quote, value, then same quote OR...\n        [^\\s\\]]          # any value that doesn\'t need to be quoted\n        )                # end group 4\n      )?                 # end operator-and-value (optional)\n      (\\])               # 6: closing bracket\n    ']);
var _templateObject2$3 = taggedTemplateLiteral(['\n      (             # 1: number\n        [+|-]?    # optional sign\n        (?:s*)?    # optional space\n        (?:         # EITHER\n          [0-9]+(?:.[0-9]+)? # digits with optional decimal point and more digits\n          |           # OR\n          .[0-9]+ # decimal point plus digits\n        )\n      )            # end group 1\n      (s*)        # 2: any space btwn number and unit\n      (            # 3: unit\n        (?:ch|cm|deg|dpi|dpcm|dppx|em|ex|\n        grad|in|mm|ms|pc|pt|px|rad|rem|\n        turn|s|vh|vmin|vw)\b # EITHER a unit\n        |          # OR\n        %          # a percentage\n      )\n    '], ['\n      (             # 1: number\n        [\\+|\\-]?    # optional sign\n        (?:\\s*)?    # optional space\n        (?:         # EITHER\n          [0-9]+(?:\\.[0-9]+)? # digits with optional decimal point and more digits\n          |           # OR\n          \\.[0-9]+ # decimal point plus digits\n        )\n      )            # end group 1\n      (\\s*)        # 2: any space btwn number and unit\n      (            # 3: unit\n        (?:ch|cm|deg|dpi|dpcm|dppx|em|ex|\n        grad|in|mm|ms|pc|pt|px|rad|rem|\n        turn|s|vh|vmin|vw)\\b # EITHER a unit\n        |          # OR\n        %          # a percentage\n      )\n    ']);
var _templateObject3$2 = taggedTemplateLiteral(['\n      (^s*)\n      (\n      (?:\n        [>+~]| # combinator (ugh)\n        .|     # class name\n        #|     # ID\n        [|     # attribute\n        (?:&|&amp;)|      # self-reference\n        %|      # abstract class name\n        *|     # wildcard\n\n        # Otherwise, see if it matches a known tag name:\n        (?:a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|eventsource|fieldset|figure|figcaption|footer|form|frame|frameset|(?:h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|svg|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\b\n      )\n      .*\n      )\n      # followed by a line ending with a comma or an opening brace.\n\n      (,|{)\n    '], ['\n      (^\\s*)\n      (\n      (?:\n        [>\\+~]| # combinator (ugh)\n        \\.|     # class name\n        \\#|     # ID\n        \\[|     # attribute\n        (?:&|&amp;)|      # self-reference\n        %|      # abstract class name\n        \\*|     # wildcard\n\n        # Otherwise, see if it matches a known tag name:\n        (?:a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|eventsource|fieldset|figure|figcaption|footer|form|frame|frameset|(?:h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|svg|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b\n      )\n      .*\n      )\n      # followed by a line ending with a comma or an opening brace.\n\n      (,|\\{)\n    ']);

var balance$3 = Daub.Utils.balance;
var compact$4 = Daub.Utils.compact;
var VerboseRegExp$4 = Daub.Utils.VerboseRegExp;


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

var FUNCTIONS = new Daub.Grammar({
  'support support-function-call support-function-call-css-builtin': {
    pattern: /(attr|counter|rgb|rgba|hsl|hsla|calc)(\()(.*)(\))/,
    replacement: "<span class='#{name}'>#{1}</span><span class='punctuation'>#{2}</span>#{3}<span class='punctuation'>#{4}</span>",
    before: function before(r, context) {
      r[3] = VALUES$2.parse(r[3], context);
    }
  },
  'support support-function-call support-function-call-sass': {
    pattern: /(red|green|blue|mix|hue|saturation|lightness|adjust-hue|lighten|darken|saturate|desaturate|grayscale|complement|invert|alpha|opacity|opacify|transparentize|fade-in|fade-out|selector-(?:nest|replace)|unquote|quote|str-(?:length|insert|index|slice)|to-(?:upper|lower)-case|percentage|round|ceil|floor|abs|min|max|random|(?:feature|variable|global-variable|mixin)-exists|inspect|type-of|unit|unitless|comparable|call|if|unique-id)(\()(.*)(\))/,
    replacement: "<span class='#{name}'>#{1}</span><span class='punctuation'>#{2}</span>#{3}<span class='punctuation'>#{4}</span>",
    before: function before(r, context) {
      r[3] = VALUES$2.parse(r[3], context);
    }
  },

  'support support-function-call support-function-call-url': {
    pattern: /(url)(\()(.*)(\))/,
    index: function index(match) {
      return balance$3(match, ')', '(', { startIndex: match.indexOf('(') });
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
      r[3] = VALUES$2.parse(r[3], context);
    }
  }
});

var INTERPOLATIONS = new Daub.Grammar({
  interpolation: {
    pattern: /(\#\{)(.*?)(})/,
    replacement: "<span class='interpolation'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = VALUES$2.parse(r[2], context);
    }
  }
});

function variableRuleNamed(name) {
  return new Daub.Grammar(defineProperty({}, name, { pattern: /\$[A-Za-z0-9_-]+/ }));
}

var VARIABLE = new Daub.Grammar({
  'variable': {
    pattern: /\$[A-Za-z0-9_-]+/
  }
});

var VARIABLES = new Daub.Grammar({
  'variable variable-assignment': {
    // NOTE: This is multiline. Will search until it finds a semicolon, even if it's not on the same line.
    pattern: /(\s*)(\$[A-Za-z][A-Za-z0-9_-]*)\b(\s*)(\:)([\s\S]*?)(;)/,
    replacement: compact$4('\n      #{1}\n      <span class=\'#{name}\'>#{2}</span>#{3}\n      <span class=\'punctuation\'>#{4}</span>\n      #{5}#{6}\n    '),
    // replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}<span class='punctuation'>#{4}</span>#{5}#{6}",
    before: function before(r, context) {
      r[5] = VALUES$2.parse(r[5], context);
    }
  }
}).extend(VARIABLE);

var PARAMETERS$2 = new Daub.Grammar({
  'parameter parameter-with-default': {
    pattern: /(\$[A-Za-z][A-Za-z0-9_-]*)(\s*:\s*)(.*?)(?=,|\)|\n)/,
    replacement: compact$4('\n      <span class="parameter">\n        <span class="variable">#{1}</span>\n        <span class="punctuation">#{2}</span>\n      #{3}\n      </span>\n    '),
    before: function before(r, context) {
      r[3] = VALUES$2.parse(r[3], context);
    }
  }
}).extend(variableRuleNamed('variable parameter'));

var SELECTORS = new Daub.Grammar({
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
      return balance$3(match, '}', '{', { startIndex: match.indexOf('{') });
    },
    replacement: "<span class='selector interpolation'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = VALUES$2.parse(r[2], context);
    }

  },

  'selector selector-self-reference': {
    pattern: /(?:&amp;|&)/
  },

  'selector selector-pseudo selector-pseudo-with-args': {
    pattern: /((?:\:+)\b(?:lang|nth-(?:last-)?child|nth-(?:last-)?of-type))(\()(.*)(\))/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}#{4}</span>",
    before: function before(r, context) {
      r[3] = VALUES$2.parse(r[3], context);
    }
  },

  'selector selector-pseudo selector-pseudo-without-args': {
    pattern: /(:{1,2})(link|visited|hover|active|focus|targetdisabled|enabled|checked|indeterminate|root|first-child|last-child|first-of-type|last-of-type|only-child|only-of-type|empty|valid|invalid)/
  },

  'selector selector-pseudo selector-pseudo-element': {
    pattern: /(:{1,2})(-(?:webkit|moz|ms)-)?\b(after|before|first-letter|first-line|selection|any-link|local-link|(?:input-)?placeholder|focus-inner|matches|nth-match|column|nth-column)\b/
  },

  'selector selector-attribute': {
    pattern: VerboseRegExp$4(_templateObject$4),
    // pattern: /(\[)([A-Za-z_-][A-Za-z0-9_-]*)(?:([~\.$^]?=)((['"])(?:.*?)(?:\5)|[^\s\]]))?(\])/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}#{4}#{6}</span>",
    before: function before(r, context) {
      r[4] = STRINGS$2.parse(r[4], context);
    }
  },

  'selector selector-combinator': {
    pattern: /(\s*)([>+~])(\s*)/,
    replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}"
  }
});

var MAPS = new Daub.Grammar({
  'meta: map pair': {
    // Property, then colon, then any value. Line terminates with a comma,
    // a newline, or the end of the string (but not a semicolon).
    pattern: /([a-zA-Z_-][a-zA-Z0-9_-]*)(\s*:\s*)(.*(?:,|\)|$))/,
    replacement: "<span class='entity'>#{1}</span>#{2}#{3}",
    before: function before(r, context) {
      r[3] = VALUES$2.parse(r[3], context);
    }
  }
});

var OPERATOR_LOGICAL = new Daub.Grammar({
  'operator operator-logical': {
    pattern: /\b(and|or|not)\b/
  }
});

var OPERATORS = new Daub.Grammar({
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

var VALUES$2 = new Daub.Grammar({
  // An arbitrary grouping of parentheses could also be a list, among other
  // things. But we don't need to apply special highlighting to lists;
  // their values will get highlighted.
  'meta: possible map': {
    pattern: /(\()([\s\S]+)(\))/,
    replacement: "#{1}#{2}#{3}",
    before: function before(r, context) {
      var mapPattern = /[A-Za-z_-][A-Za-z0-9_-]*:.*(?:,|\)|$)/;
      var grammar = VALUES$2;
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
    pattern: VerboseRegExp$4(_templateObject2$3),
    replacement: "<span class='number'>#{1}</span>#{2}<span class='unit'>#{3}</span>"
  }
}).extend(OPERATORS, VARIABLE);

var NUMBERS = new Daub.Grammar({
  'number': {
    pattern: /[\+|\-]?(\s*)?([0-9]+(\.[0-9]+)?|\.[0-9]+)/
  }
});

var STRINGS$2 = new Daub.Grammar({
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

var COLORS = new Daub.Grammar({
  'constant color-hex': {
    pattern: /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/
  },

  'constant color-named': {
    pattern: /\b(aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow)\b/
  }
});

var DIRECTIVES = new Daub.Grammar({
  'keyword directive': {
    pattern: /\s+!(?:default|important|optional)/
  }
});

VALUES$2.extend(FUNCTIONS, STRINGS$2, COLORS, NUMBERS, DIRECTIVES);

VALUES$2.extend({
  'support': {
    pattern: /\b([\w-]+)\b/
  }
});

var COMMENTS = new Daub.Grammar({
  'comment comment-line': {
    pattern: /(?:\s*)\/\/(?:.*?)(?=\n)/
  },
  'comment comment-block': {
    pattern: /(?:\s*)(\/\*)([\s\S]*)(\*\/)/
  }
});

var PROPERTIES = new Daub.Grammar({
  'meta: property pair': {
    pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(;)/,
    replacement: '<span class="property">#{1}</span>#{2}#{3}#{4}',
    before: function before(r, context) {
      r[3] = VALUES$2.parse(r[3], context);
    }
  }
});

var INSIDE_AT_RULE_MEDIA = new Daub.Grammar({
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

var INSIDE_AT_RULE_IF = new Daub.Grammar({}).extend(FUNCTIONS, OPERATORS, VALUES$2);

var INSIDE_AT_RULE_INCLUDE = new Daub.Grammar({}).extend(PARAMETERS$2, VALUES$2);

INSIDE_AT_RULE_INCLUDE.extend({
  'string string-unquoted': {
    pattern: /\b\w+\b/
  }
});

var INSIDE_AT_RULE_KEYFRAMES = new Daub.Grammar({
  'meta: from/to': {
    pattern: /\b(from|to)\b(\s*)(?={)/,
    replacement: "<span class='keyword'>#{1}</span>#{2}"
  },

  'meta: percentage': {
    pattern: /(\d+%)(\s*)(?={)/,
    replacement: "#{1}#{2}",
    before: function before(r, context) {
      r[1] = VALUES$2.parse(r[1], context);
    }
  }
}).extend(PROPERTIES);

var INSIDE_AT_RULE_SUPPORTS = new Daub.Grammar({
  'meta: property pair': {
    pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(?=\)|$)/,
    replacement: '<span class="property">#{1}</span>#{2}#{3}#{4}',
    before: function before(r, context) {
      r[3] = VALUES$2.parse(r[3], context);
    }
  }
}).extend(OPERATOR_LOGICAL);

var MEDIA_AT_RULE_PROP_PAIR = new Daub.Grammar({
  'meta: property pair': {
    pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(?=\)|$)/,
    replacement: '<span class="property">#{1}</span>#{2}#{3}#{4}',
    before: function before(r, context) {
      r[3] = VALUES$2.parse(r[3], context);
    }
  }
});

var INSIDE_URL_FUNCTION = new Daub.Grammar({}).extend(STRINGS$2, VARIABLES, FUNCTIONS);

var AT_RULES = new Daub.Grammar({
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
      return balance$3(match, '}', '{', { startIndex: match.indexOf('{') });
    },
    before: function before(r, context) {
      r[6] = INSIDE_AT_RULE_KEYFRAMES.parse(r[6], context);
    },
    replacement: compact$4('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      <span class=\'entity\'>#{3}</span>\n      #{4}#{5}#{6}#{7}\n    ')
    // replacement: "<span class='#{name}'>#{1}</span>#{2}<span class='entity'>#{3}</span>#{4}#{5}#{6}#{7}"
  },

  'keyword keyword-at-rule keyword-at-rule-log-directive': {
    pattern: /(@(?:error|warn|debug))(\s+|\()(.*)(\)?;)(\s*)(?=\n)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}",
    before: function before(r, context) {
      r[3] = STRINGS$2.parse(r[3], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-each': {
    pattern: /(@each)(.*)\b(in)\b(.*)(\{)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}<span class='keyword'>#{3}</span>#{4}#{5}",
    before: function before(r, context) {
      r[2] = VARIABLES.parse(r[2], context);
      r[4] = VALUES$2.parse(r[4], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-for': {
    pattern: /(@for)(.*)\b(from)\b(.*)(through)(.*)({)/,
    replacement: compact$4('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      <span class=\'keyword\'>#{3}</span>#{4}\n      <span class=\'keyword\'>#{5}</span>#{6}#{7}\n    '),
    before: function before(r, context) {
      r[2] = VARIABLES.parse(r[2], context);
      r[4] = VALUES$2.parse(r[4], context);
      r[6] = VALUES$2.parse(r[6], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-mixin': {
    pattern: /(@mixin)(\s+)([A-Za-z-][A-Za-z0-9\-_]+)(?:(\s*\())?(.*)(?={)/,
    replacement: compact$4('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      <span class=\'function\'>#{3}</span>#{4}#{5}\n    '),
    before: function before(r, context) {
      if (r[5]) {
        r[5] = PARAMETERS$2.parse(r[5], context);
      }
    }
  },

  'keyword keyword-at-rule keyword-at-rule-function': {
    pattern: /(@function)(\s+)([A-Za-z-][A-Za-z0-9\-_]+)(?:(\s*\())?(.*)(?={)/,
    replacement: compact$4('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      <span class=\'function\'>#{3}</span>#{4}#{5}\n    '),
    before: function before(r, context) {
      if (r[5]) {
        r[5] = PARAMETERS$2.parse(r[5], context);
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
      r[2] = STRINGS$2.parse(r[2], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-content': {
    pattern: /(@content)(?=;)/
  },

  'keyword keyword-at-rule keyword-at-rule-charset': {
    pattern: /(@charset)(\s+)(.*)(;)(\s*)(?=\n|$)/,
    replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}",
    before: function before(r, context) {
      r[3] = STRINGS$2.parse(r[3], context);
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
      r[3] = VALUES$2.parse(r[3], context);
    }
  }
});

var MAIN$4 = new Daub.Grammar('scss', {});

MAIN$4.extend(FUNCTIONS, VARIABLES, AT_RULES);

MAIN$4.extend({
  'meta: selector line': {
    pattern: VerboseRegExp$4(_templateObject3$2),
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

MAIN$4.extend(PROPERTIES, COMMENTS);

var INSIDE_STRINGS = new Daub.Grammar({
  variable: {
    pattern: /(\$[\d\w_\-]+)\b|(\$\{[\d\w_\-]+\})/
  }
});

var INSIDE_SHELL_COMMANDS = new Daub.Grammar({
  variable: {
    pattern: /(\$[\w_\-]+)\b/
  }
});

var MAIN$5 = new Daub.Grammar('shell', {
  comment: {
    pattern: /#[^\n]*(?=\n|$)/
  },

  string: {
    pattern: /(?:'[^']*'|"[^"]*")/,
    before: function before(r, context) {
      r[0] = INSIDE_STRINGS.parse(r[0], context);
    }
  },

  function: {
    pattern: /(\w[\w\d_\-]+)(?=\()/
  },

  'shell-command shell-command-backticks': {
    pattern: /`[^`]*`/,
    before: function before(r, context) {
      r[0] = INSIDE_SHELL_COMMANDS.parse(r[0], context);
    }
  },

  'shell-command': {
    pattern: /\$\(.*?\)/,
    before: function before(r, context) {
      r[0] = INSIDE_SHELL_COMMANDS.parse(r[0], context);
    }
  },

  number: {
    pattern: /\b(?:[0-9]+(\.[0-9]+)?)\b/
  },

  constant: {
    pattern: /\b(?:false|true)\b/
  },

  keyword: {
    pattern: /\b(?:if|fi|case|esac|for|do|else|then|while|exit|done|shift)\b/
  },

  operator: {
    pattern: />|&gt;|&&|&amp;&amp;/
  },

  variable: {
    pattern: /(\$[\w_\-]+)\b/
  },

  'variable-assignment': {
    pattern: /([A-Za-z_][A-Za-z0-9_]*)(=)/,
    replacement: "<span class='variable'>#{1}</span><span class='operator'>#{2}</span>"
  },

  'variable variable-in-braces': {
    pattern: /\$\{.+?}(?=\n|\b)/
  }
}, { alias: ['bash'] });

// Given a document fragment, find the first text node in the tree,
// depth-first, or `null` if none is found.
function findFirstTextNode(fragment) {
  var nodes = fragment.childNodes;

  if (nodes.length === 0) {
    return null;
  }
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }
    var descendant = findFirstTextNode(node);
    if (descendant) {
      return descendant;
    }
  }
  return null;
}

function findLastTextNode(fragment) {
  var nodes = fragment.childNodes;

  if (nodes.length === 0) {
    return null;
  }
  for (var i = nodes.length - 1; i >= 0; i--) {
    var node = nodes[i];
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }
    var descendant = findFirstTextNode(node);
    if (descendant) {
      return descendant;
    }
  }

  return null;
}

document.addEventListener('daub-will-highlight', function (event) {
  var fragment = event.detail.fragment;


  var firstTextNode = findFirstTextNode(fragment);
  if (firstTextNode) {
    var value = firstTextNode.nodeValue;
    if (value && value.match(/^(\s*\n)/)) {
      value = value.replace(/^(\s*\n)/, '');
    }

    firstTextNode.parentNode.replaceChild(document.createTextNode(value), firstTextNode);
  }

  var lastTextNode = findLastTextNode(fragment);
  if (lastTextNode) {
    var _value = lastTextNode.nodeValue;
    if (_value && _value.match(/(\s*\n)+$/)) {
      _value = _value.replace(/(\s*\n)+$/, '');
    }

    lastTextNode.parentNode.replaceChild(document.createTextNode(_value), lastTextNode);
  }
});

// Some browsers round the line-height, others don't.
// We need to test for it to position the elements properly.
// let isLineHeightRounded = (function() {
//   let res;
//   return function() {
//     if (typeof res === 'undefined') {
//       var d = document.createElement('div');
//       d.style.fontSize = '13px';
//       d.style.lineHeight = '1.5';
//       d.style.padding = 0;
//       d.style.border = 0;
//       d.innerHTML = '&nbsp;<br />&nbsp;';
//       document.body.appendChild(d);
//       // Browsers that round the line-height should have offsetHeight === 38
//       // The others should have 39.
//       res = d.offsetHeight === 38;
//       document.body.removeChild(d);
//     }
//     return res;
//   };
// })();

function getLineHeight(el) {
  var style = window.getComputedStyle(el);
  return parseFloat(style.lineHeight);
}

function getTopOffset(code, pre) {
  var dummy = document.createElement('span');
  dummy.setAttribute('class', 'daub-line-highlight-dummy');
  dummy.setAttribute('aria-hidden', 'true');
  dummy.textContent = ' ';
  code.insertBefore(dummy, code.firstChild);

  var preRect = pre.getBoundingClientRect();
  var codeRect = dummy.getBoundingClientRect();
  var delta = preRect.top - codeRect.top;

  code.removeChild(dummy);

  return Math.abs(delta);
}

function handleAttribute(str) {
  if (!str) {
    return null;
  }
  function handleUnit(unit) {
    var result = {};
    if (unit.indexOf('-') > -1) {
      var _unit$split$map = unit.split('-').map(function (u) {
        return Number(u);
      }),
          _unit$split$map2 = slicedToArray(_unit$split$map, 2),
          start = _unit$split$map2[0],
          end = _unit$split$map2[1];

      result.start = start;
      result.lines = end + 1 - start;
    } else {
      result.start = Number(unit);
      result.lines = 1;
    }
    return result;
  }

  var units = str.split(/,\s*/).map(handleUnit);
  return units;
}

function makeLine(range, lh, topOffset) {
  var span = document.createElement('mark');
  span.setAttribute('class', 'daub-line-highlight');
  span.setAttribute('aria-hidden', 'true');

  span.textContent = new Array(range.lines).join('\n') + ' ';
  var top = topOffset + (range.start - 1) * lh - 2;

  Object.assign(span.style, {
    position: 'absolute',
    top: top + 'px',
    left: '0',
    right: '0',
    lineHeight: 'inherit'
  });
  return span;
}

document.addEventListener('daub-will-highlight', function (event) {
  var code = event.target,
      pre = event.target.parentNode;
  var fragment = event.detail.fragment;


  var lineAttr = code.getAttribute('data-lines') || pre.getAttribute('data-lines');
  if (!lineAttr) {
    return;
  }

  var ranges = handleAttribute(lineAttr);
  if (!ranges) return;

  pre.style.position = 'relative';

  var lh = getLineHeight(code);
  var to = getTopOffset(code, pre);

  ranges.forEach(function (r) {
    var span = makeLine(r, lh, to);
    fragment.appendChild(span);
  });
});

var highlighter = new Daub.Highlighter();

highlighter.addGrammar(MAIN$4);
highlighter.addGrammar(MAIN$1);
highlighter.addGrammar(MAIN);
highlighter.addGrammar(MAIN$2);
highlighter.addGrammar(MAIN$3);
highlighter.addGrammar(MAIN$5);

return highlighter;

})));
