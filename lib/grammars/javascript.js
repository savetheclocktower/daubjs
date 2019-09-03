(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('../daub')) :
	typeof define === 'function' && define.amd ? define(['../daub'], factory) :
	(global.daub = global.daub || {}, global.daub.javascript = factory(global.daub));
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







































var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};

var _templateObject = taggedTemplateLiteral(['\n      (()            # 1: open paren\n      ([^)]*?)       # 2: raw params\n      ())            # 3: close paren\n      (s*)           # 4: space\n      (=(?:&gt;|>))   # 5: fat arrow\n    '], ['\n      (\\()            # 1: open paren\n      ([^\\)]*?)       # 2: raw params\n      (\\))            # 3: close paren\n      (\\s*)           # 4: space\n      (=(?:&gt;|>))   # 5: fat arrow\n    ']);
var _templateObject2 = taggedTemplateLiteral(['\n      \b(function)\n      (s*)\n      ([a-zA-Z_$]w*)? # function name (optional)\n      (s*)\n      (()             # open parenthesis\n      (.*?)            # raw params\n      ())             # close parenthesis\n    '], ['\n      \\b(function)\n      (\\s*)\n      ([a-zA-Z_$]\\w*)? # function name (optional)\n      (\\s*)\n      (\\()             # open parenthesis\n      (.*?)            # raw params\n      (\\))             # close parenthesis\n    ']);
var _templateObject3 = taggedTemplateLiteral(['\n      (^s*)\n      (get|set|static)? # 1: annotation\n      (s*)             # 2: space\n      ([a-zA-Z_$][a-zA-Z0-9$_]*) # 3: function name\n      (s*)             # 4: space\n      (()              # 5: open parenthesis\n      (.*?)             # 6: raw params\n      ())              # 7: close parenthesis\n      (s*)             # 8: space\n      ({)              # 9: opening brace\n    '], ['\n      (^\\s*)\n      (get|set|static)? # 1: annotation\n      (\\s*)             # 2: space\n      ([a-zA-Z_$][a-zA-Z0-9$_]*) # 3: function name\n      (\\s*)             # 4: space\n      (\\()              # 5: open parenthesis\n      (.*?)             # 6: raw params\n      (\\))              # 7: close parenthesis\n      (\\s*)             # 8: space\n      (\\{)              # 9: opening brace\n    ']);
var _templateObject4 = taggedTemplateLiteral(['\n      \b\n      ([a-zA-Z_?.$]+w*) # variable name\n      (s*)\n      (=)\n      (s*)\n      (function)\n      (s*)\n      (()\n      (.*?)       # raw params\n      ())\n    '], ['\n      \\b\n      ([a-zA-Z_?\\.$]+\\w*) # variable name\n      (\\s*)\n      (=)\n      (\\s*)\n      (function)\n      (\\s*)\n      (\\()\n      (.*?)       # raw params\n      (\\))\n    ']);
var _templateObject5 = taggedTemplateLiteral(['\n      (class)                # 1: storage\n      (?:                    # begin optional class name\n        (s+)                # 2: space\n        ([A-Z][A-Za-z0-9_]*) # 3: class name\n      )?                     # end optional class name\n      (?:                    # begin optional \'extends\' keyword\n        (s+)                # 4: space\n        (extends)            # 5: storage\n        (s+)                # 6: space\n        ([A-Z][A-Za-z0-9_]*) # 7: superclass name\n      )?                     # end optional \'extends\' keyword\n      (s*)                  # 8: space\n      ({)                    # 9: opening brace\n    '], ['\n      (class)                # 1: storage\n      (?:                    # begin optional class name\n        (\\s+)                # 2: space\n        ([A-Z][A-Za-z0-9_]*) # 3: class name\n      )?                     # end optional class name\n      (?:                    # begin optional \'extends\' keyword\n        (\\s+)                # 4: space\n        (extends)            # 5: storage\n        (\\s+)                # 6: space\n        ([A-Z][A-Za-z0-9_]*) # 7: superclass name\n      )?                     # end optional \'extends\' keyword\n      (\\s*)                  # 8: space\n      ({)                    # 9: opening brace\n    ']);

/* eslint-disable no-useless-escape */
var balance = daub.Utils.balance;
var compact = daub.Utils.compact;
var wrap = daub.Utils.wrap;
var VerboseRegExp = daub.Utils.VerboseRegExp;

// TODO:
// * Generators

var ESCAPES = new daub.Grammar({
  escape: {
    pattern: /\\./
  }
});

var REGEX_INTERNALS = new daub.Grammar({
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

var INSIDE_TEMPLATE_STRINGS = new daub.Grammar({
  'interpolation': {
    pattern: /(\$\{)(.*?)(\})/,
    replacement: "<span class='#{name}'><span class='punctuation'>#{1}</span><span class='interpolation-contents'>#{2}</span><span class='punctuation'>#{3}</span></span>",
    before: function before(r, context) {
      r[2] = MAIN.parse(r[2], context);
    }
  }
}).extend(ESCAPES);

var PARAMETERS = new daub.Grammar({
  'parameter parameter-with-default': {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,
    replacement: compact('\n      <span class="parameter">\n        <span class="variable">#{1}</span>\n        <span class="operator">#{2}</span>\n      #{3}\n      </span>\n    '),
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

var VALUES = new daub.Grammar({
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

var DESTRUCTURING = new daub.Grammar({
  alias: {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,
    replacement: "<span class='entity'>#{1}</span>#{2}#{3}#{4}"
  },

  variable: {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  }
});

var MAIN = new daub.Grammar('javascript', {}, { alias: ['js'] });
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
    before: function before(r, context) {
      r[1] = handleParams(r[1], context);
    }
  },

  'meta: fat arrow function, args in parens': {
    pattern: VerboseRegExp(_templateObject),
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
    pattern: VerboseRegExp(_templateObject2),
    replacement: "<span class='keyword keyword-function'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
    before: function before(r, context) {
      if (r[3]) r[3] = '<span class=\'entity\'>' + r[3] + '</span>';
      r[6] = handleParams(r[6], context);
      return r;
    }
  },

  'function function-literal-shorthand-style': {
    pattern: VerboseRegExp(_templateObject3),

    replacement: "#{1}#{2}#{3}<span class='entity'>#{4}</span>#{5}#{6}#{7}#{8}#{9}#{10}",
    before: function before(r, context) {
      if (r[2]) r[2] = '<span class=\'storage\'>' + r[1] + '</span>';
      r[7] = handleParams(r[7], context);
    }
  },

  'function function-assigned-to-variable': {
    pattern: VerboseRegExp(_templateObject4),
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
    pattern: VerboseRegExp(_templateObject5),
    index: function index(match) {
      return balance(match, '}', '{', { startIndex: match.indexOf('{') + 1 });
      // return findBalancedToken('}', '{', match, match.indexOf('{') + 1);
    },
    replacement: compact('\n      <span class="storage">#{1}</span>\n      #{2}#{3}\n      #{4}#{5}#{6}#{7}\n      #{8}#{9}\n    '),
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

return MAIN;

})));
