(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

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

})));
