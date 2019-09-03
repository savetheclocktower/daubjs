(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('../daub')) :
	typeof define === 'function' && define.amd ? define(['../daub'], factory) :
	(global.daub = global.daub || {}, global.daub.python = factory(global.daub));
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

var _templateObject = taggedTemplateLiteral(['\n    \b\n    (?:from|if|else|elif|print|import|class|pass|\n      try|finally|except|return|global|nonlocal)\n    \b\n    '], ['\n    \\b\n    (?:from|if|else|elif|print|import|class|pass|\n      try|finally|except|return|global|nonlocal)\n    \\b\n    ']);
var _templateObject2 = taggedTemplateLiteral(['\n      (def)             # 1: keyword\n      (s+)             # 2: space\n      ([A-Za-z0-9_!?]+) # 3: method name\n      (s*)             # 4: space\n      (()              # 5: open paren\n      (.*?)?            # 6: parameters (optional)\n      ())              # 7: close paren\n    '], ['\n      (def)             # 1: keyword\n      (\\s+)             # 2: space\n      ([A-Za-z0-9_!?]+) # 3: method name\n      (\\s*)             # 4: space\n      (\\()              # 5: open paren\n      (.*?)?            # 6: parameters (optional)\n      (\\))              # 7: close paren\n    ']);
var _templateObject3 = taggedTemplateLiteral(['\n      ([A-Za-z0-9_!?]+)  # 1: method name\n      (s*)              # 2: optional space\n      ((s*)            # 3: opening paren plus optional space\n      ([sS]*)          # 4: inside parens (greedy)\n      (s*))            # 5: closing paren\n    '], ['\n      ([A-Za-z0-9_!?]+)  # 1: method name\n      (\\s*)              # 2: optional space\n      (\\(\\s*)            # 3: opening paren plus optional space\n      ([\\s\\S]*)          # 4: inside parens (greedy)\n      (\\s*\\))            # 5: closing paren\n    ']);

var balance = daub.Utils.balance;
var wrap = daub.Utils.wrap;
var compact = daub.Utils.compact;
var VerboseRegExp = daub.Utils.VerboseRegExp;

// function wrapParameter (param) {
//   let className = 'variable parameter';
//   return `<span class='${className}'>${param}</span>`;
// }

function handleParameters(str, context) {
  var parts = str.split(/,[ \t]*/).map(function (part) {
    return highlightParameters(part, MAIN, false, context);
  });
  return parts.join(', ');
}

function handleArguments(str, context) {
  console.log('handleArguments', str);
  var parts = str.split(/,[ \t]*/).map(function (part) {
    return highlightParameters(part, MAIN, true, context);
  });
  return parts.join(', ');
}

var DEFAULT_VALUE_PATTERN = /(^|\s+)([A-Za-z0-9_]+)(\s*=\s*)(.*)/gm;
function highlightParameters(part, grammar, onlyHighlightKeywordArgs, context) {
  if (!grammar) {
    grammar = MAIN;
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

      name = wrap(name, 'variable parameter');
      eq = wrap(eq, 'keyword punctuation');
      value = grammar.parse(value);
      return space + name + eq + value;
    });
  } else {
    part = onlyHighlightKeywordArgs ? grammar.parse(part, context) : wrap(part, 'variable parameter');
  }
  return part;
}

var STRINGS = new daub.Grammar({
  interpolation: {
    pattern: /\{(\d*)\}/
  }
});

var MAIN = new daub.Grammar('python', {
  'keyword keyword-import': {
    pattern: /(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(?=\n)/,
    replacement: compact('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      #{3}#{4}\n      <span class=\'keyword\'>#{5}</span>#{6}\n      #{7}\n    ')
  },

  'meta: subclass': {
    pattern: /(class)(\s+)([\w\d_]+)\(([\w\d_]*)\):/,
    replacement: compact('\n      <span class=\'keyword\'>#{1}</span>#{2}\n      <span class=\'entity entity-class class\'>#{3}</span>\n      (<span class=\'entity entity-class entity-superclass\'>#{4}</span>) :\n    ')
  },

  'meta: class': {
    pattern: /(class)(\s+)([\w\d_]+):/,
    replacement: "<span class='keyword'>#{1}</span>#{2}<span class='entity entity-class class'>#{3}</span>:"
  },

  comment: {
    pattern: /#[^\n]*(?=\n)/
  },

  keyword: {
    pattern: VerboseRegExp(_templateObject)
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
    pattern: VerboseRegExp(_templateObject2),
    replacement: compact('\n      <span class=\'keyword\'>#{1}</span>#{2}\n      <span class=\'entity\'>#{3}</span>#{4}\n      #{5}#{6}#{7}\n    '),
    before: function before(r, context) {
      if (r[6]) {
        r[6] = handleParameters(r[6], context);
      }
    }
  },

  'meta: method invocation': {
    pattern: VerboseRegExp(_templateObject3),
    index: function index(text) {
      return balance(text, ')', '(', text.indexOf('('));
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

return MAIN;

})));
