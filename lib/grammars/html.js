(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('../daub')) :
	typeof define === 'function' && define.amd ? define(['../daub'], factory) :
	(global.daub = global.daub || {}, global.daub.html = factory(global.daub));
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

var _templateObject = taggedTemplateLiteral(['\n      (&lt;|<)(script|SCRIPT) # 1, 2: opening script element\n      (s+.*?)?               # 3: space and optional attributes\n      (&gt;|>)                # 4: end opening element\n      ([sS]*?)              # 5: contents\n      ((?:&lt;|<)/)(script|SCRIPT)(&gt;|>) # 6, 7, 8: closing script element\n    '], ['\n      (&lt;|<)(script|SCRIPT) # 1, 2: opening script element\n      (\\s+.*?)?               # 3: space and optional attributes\n      (&gt;|>)                # 4: end opening element\n      ([\\s\\S]*?)              # 5: contents\n      ((?:&lt;|<)\\/)(script|SCRIPT)(&gt;|>) # 6, 7, 8: closing script element\n    ']);

var compact = daub.Utils.compact;
var VerboseRegExp = daub.Utils.VerboseRegExp;


var ATTRIBUTES = new daub.Grammar({
  string: {
    pattern: /('[^']*[^\\]'|"[^"]*[^\\]")/
  },

  attribute: {
    pattern: /\b([a-zA-Z-:]+)(=)/,
    replacement: compact('\n      <span class=\'attribute\'>\n        <span class=\'#{name}\'>#{1}</span>\n        <span class=\'punctuation\'>#{2}</span>\n      </span>\n    ')
  }
});

var MAIN = new daub.Grammar('html', {
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

return MAIN;

})));
