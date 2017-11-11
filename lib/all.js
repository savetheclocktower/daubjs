(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.all = factory());
}(this, (function () { 'use strict';

// Find the next "balanced" occurrence of the token. Searches through the
// string unit by unit. Whenever the `paired` token is encountered, the
// stack size increases by 1. When `token` is encountered, the stack size
// decreases by 1, and if the stack size is already 0, that's our desired
// token.
function balance(source, token, paired) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  options = Object.assign({ startIndex: 0, stackDepth: 0, considerEscapes: true }, options);

  var lastChar = void 0;
  var _options = options,
      startIndex = _options.startIndex,
      stackDepth = _options.stackDepth,
      considerEscapes = _options.considerEscapes;

  var tl = token.length;
  var pl = paired.length;
  var length = source.length;

  for (var i = startIndex; i < length; i++) {
    if (i > 0) {
      lastChar = source.slice(i - 1, i);
    }
    var escaped = considerEscapes ? lastChar === '\\' : false;
    var candidate = source.slice(i, i + tl);
    var pairCandidate = source.slice(i, i + pl);

    if (pairCandidate === paired && !escaped) {
      stackDepth++;
    }

    if (candidate === token && !escaped) {
      stackDepth--;
      if (stackDepth === 0) {
        return i;
      }
    }
  }

  return -1;
}

// Given a multiline string, removes all space at the beginnings of lines.
// Lets us define replacement strings with indentation, yet have all that
// extraneous space stripped out before it gets into the replacement.
function compact(str) {
  str = str.replace(/^[\s\t]*/mg, '');
  str = str.replace(/\n/g, '');
  return str;
}

// Wrap a string in a `span` with the given class name.
function wrap(str, className) {
  return '<span class="' + className + '">' + str + '</span>';
}

function _isEscapedHash(line, index) {
  return index === 0 ? false : line.charAt(index - 1) === '\\';
}

function _trimCommentsFromLine(line) {
  var hashIndex = -1;
  do {
    hashIndex = line.indexOf('#', hashIndex + 1);
  } while (hashIndex > -1 && _isEscapedHash(line, hashIndex));

  if (hashIndex > -1) {
    line = line.substring(0, hashIndex);
  }
  line = line.trim();
  return line;
}

// A tagged template literal that allows you to define a verbose regular
// expression using backticks. Literal whitespace is ignored, and you can use
// `#` to mark comments. This makes long regular expressions way easier for
// humans to read and write.
//
// Escape sequences _do not_ need to be double-escaped, with one exception:
// capture group backreferences like \5 need to be written as \\5, because JS
// doesn't understand that syntax outside of a literal RegExp.
function VerboseRegExp(str) {
  var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var raw = str.raw[0];

  var pattern = raw.split(/\n/).map(_trimCommentsFromLine).join('').replace(/\s/g, '');

  // Take (e.g.) `\\5` and turn it into `\5`. For some reason we can't do
  // this with raw strings.
  pattern = pattern.replace(/(\\)(\\)(\d+)/g, function (m, _, bs, d) {
    return '' + bs + d;
  });

  var result = new RegExp(pattern, flags);
  return result;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





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





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
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









var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function _regexToString(re) {
  var str = re.toString();
  str = str.replace(/^\//, '');
  str = str.replace(/\/[mgiy]*$/, '');
  return str;
}

// Coerces `null` and `undefined` to empty strings; uses default coercion on
// everything else.
function _interpretString(value) {
  return value == null ? '' : String(value);
}

function _escapeRegex(str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

function _regexWithoutGlobalFlag(re) {
  var flags = re.flags.replace('g', '');
  return new RegExp(_regexToString(re), flags);
}

// Like String#replace, but with some enhancements:
//
// * Understands Templates and Template-style strings.
// * Allows the handler to retroactively match _less_ than what it was
//   given, tossing the rest back into the queue for matching.
//
function gsub(source, pattern, replacement) {
  var result = '';

  if (typeof replacement !== 'function') {
    var template = new Template(replacement);
    replacement = function replacement(match) {
      return template.evaluate(match);
    };
  }

  if (pattern.flags && pattern.flags.indexOf('g') > -1) {
    pattern = _regexWithoutGlobalFlag(pattern);
  } else if (typeof pattern === 'string') {
    pattern = _escapeRegex(pattern);
  }

  if (!pattern) {
    replacement = replacement('');
    return replacement + source.split('').join(replacement) + replacement;
  }

  // The original string is the 'inbox'; the result string is the 'outbox.'
  // While the inbox still has stuff in it, keep applying the pattern against
  // the source.
  while (source.length > 0) {
    var origLength = source.length;
    var match = source.match(pattern);
    if (match) {
      var replaced = replacement(match, source);

      var newLength = void 0;
      if (Array.isArray(replaced)) {
        var _replaced = replaced;
        // The replacement function can optionally return _two_ values: the
        // replacement string and an index representing the length of the
        // string it actually acted on. In other words, it decided it wanted
        // to claim only some of the string we gave it, and we should
        // consider _only_ that substring to have been matched in the first
        // place.
        //
        // The index returned represents the last character of the _matched_
        // string that the handler cared about. So later on we'll have to
        // account for the length of the portion _before_ the match.

        var _replaced2 = slicedToArray(_replaced, 2);

        replaced = _replaced2[0];
        newLength = _replaced2[1];
      }

      // Copy over the part that comes before the match.
      result += source.slice(0, match.index);
      // Copy over the string that is meant to replace the matched string.
      result += _interpretString(replaced);

      // Now we can remove everything from `source` up to the end of what was
      // matched.
      if (typeof newLength !== 'undefined') {
        // Remove only the portion that the replacement function actually
        // consumed.
        source = source.slice(match.index + newLength);
      } else {
        source = source.slice(match.index + match[0].length);
      }

      if (source.length === origLength) {
        throw new Error('Infinite loop detected; none of the string was consumed.');
      }
    } else {
      // No more matches. The rest of the string gets moved to the outbox.
      // We're done.
      result += source;
      source = '';
    }
  }

  return result;
}

var Context = function () {
  function Context(options) {
    classCallCheck(this, Context);

    if (options.highlighter) {
      this.highlighter = options.highlighter;
    }
    this.storage = new Map();
  }

  createClass(Context, [{
    key: 'set',
    value: function set$$1(key, value) {
      this.storage.set(key, value);
    }
  }, {
    key: 'get',
    value: function get$$1(key, defaultValue) {
      if (!this.storage.has(key)) {
        this.storage.set(key, defaultValue);
        return defaultValue;
      }
      return this.storage.get(key);
    }
  }]);
  return Context;
}();

var Template = function () {
  function Template(template, pattern) {
    classCallCheck(this, Template);

    this.template = String(template);
    this.pattern = pattern || Template.DEFAULT_PATTERN;
  }

  createClass(Template, [{
    key: 'evaluate',
    value: function evaluate(object) {
      return gsub(this.template, this.pattern, function (match) {
        if (object == null) return '';

        var before = match[1] || '';
        if (before == '\\') return match[2];

        var ctx = object,
            expr = match[3];

        var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;

        match = pattern.exec(expr);
        if (match == null) return before;

        while (match != null) {
          var comp = match[1].startsWith('[') ? match[2].gsub('\\\\]', ']') : match[1];
          ctx = ctx[comp];
          if (null == ctx || '' == match[3]) break;
          expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
          match = pattern.exec(expr);
        }

        return before + _interpretString(ctx);
      });
    }
  }]);
  return Template;
}();

Template.DEFAULT_PATTERN = /(^|.|\r|\n)(#\{(.*?)\})/;

Template.interpolate = function (string, object) {
  return new Template(string).evaluate(object);
};

var Highlighter = function () {
  function Highlighter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Highlighter);

    this.grammars = [];
    this._grammarTable = {};
    this.elements = [];
    this.options = Object.assign({}, Highlighter.DEFAULT_OPTIONS, options);
  }

  createClass(Highlighter, [{
    key: 'addElement',
    value: function addElement(element) {
      if (this.elements.indexOf(element) > -1) {
        return;
      }
      this.elements.push(element);
    }
  }, {
    key: 'addGrammar',
    value: function addGrammar(grammar) {
      if (!grammar.name) {
        throw new Error('Can\'t register a grammar without a name.\'');
      }
      if (this.grammars.indexOf(grammar) > -1) {
        return;
      }
      this.grammars.push(grammar);
      if (grammar.name) {
        this._grammarTable[grammar.name] = grammar;
      }
    }
  }, {
    key: 'scan',
    value: function scan(node) {
      var _this = this;

      this.grammars.forEach(function (grammar) {
        var selector = grammar.names.map(function (n) {
          var cls = _this.options.classPrefix + n;
          return 'code.' + cls + ':not([data-highlighted])';
        }).join(', ');

        var nodes = node.querySelectorAll(selector);
        nodes = Array.from(nodes);
        if (!nodes || !nodes.length) {
          return;
        }
        nodes.forEach(function (el) {
          if (el.hasAttribute('data-daub-highlighted')) {
            return;
          }
          var context = new Context({ highlighter: _this });
          var source = el.innerHTML;
          if (grammar.options.encode) {
            source = source.replace(/</g, '&lt;');
          }
          var parsed = _this.parse(source, grammar, context);

          _this._updateElement(el, parsed, grammar);
          el.setAttribute('data-daub-highlighted', 'true');

          var meta = { element: el, grammar: grammar };
          _this._fire('highlighted', el, meta, { cancelable: false });
        });
      });
    }
  }, {
    key: 'highlight',
    value: function highlight() {
      var _this2 = this;

      this.elements.forEach(function (el) {
        return _this2.scan(el);
      });
    }
  }, {
    key: '_updateElement',
    value: function _updateElement(element, text, grammar) {
      var doc = element.ownerDocument,
          range = doc.createRange();

      // Turn the string into a DOM fragment so that it can more easily be
      // acted on by plugins.
      var fragment = range.createContextualFragment(text);

      var meta = { element: element, grammar: grammar, fragment: fragment };
      var event = this._fire('will-highlight', element, meta);

      // Allow event handlers to cancel the highlight.
      if (event.defaultPrevented) {
        return;
      }

      // Allow event handlers to mutate the fragment.
      if (event.detail.fragment) {
        fragment = event.detail.fragment;
      }

      element.innerHTML = '';
      element.appendChild(fragment);
    }
  }, {
    key: '_fire',
    value: function _fire(name, element, detail) {
      var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      Object.assign(detail, { highlighter: this });

      var options = Object.assign({ bubbles: true, cancelable: true }, opts, { detail: detail });

      var event = new CustomEvent('daub-' + name, options);

      element.dispatchEvent(event);
      return event;
    }
  }, {
    key: 'parse',
    value: function parse(text) {
      var grammar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (typeof grammar === 'string') {
        // If the user passes a string and we can't find the grammar, we should
        // fail silently instead of throwing an error.
        grammar = this._grammarTable[grammar];
        if (!grammar) {
          return text;
        }
      } else if (!grammar) {
        throw new Error('Must specify a grammar!');
      }
      if (!context) {
        context = new Context({ highlighter: this });
      }

      var parsed = grammar.parse(text, context);

      return parsed;
    }
  }]);
  return Highlighter;
}();

Highlighter.DEFAULT_OPTIONS = { classPrefix: '' };

var Grammar = function () {
  function Grammar(name, rules) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Grammar);

    if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' && !rules) {
      // Anonymous grammar.
      this.name = null;
      options = rules || options;
      rules = name;
    } else {
      this.name = name;
      this.names = [name].concat(toConsumableArray(options.alias || []));
      this._classNamePattern = new RegExp('\\b(?:' + this.names.join('|') + ')\\b');
    }

    this.options = options;
    this.rules = [];

    this.extend(rules);
  }

  createClass(Grammar, [{
    key: 'parse',
    value: function parse(text) {
      var _this3 = this;

      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var pattern = this.pattern;
      pattern.lastIndex = 0;

      // eslint-disable-next-line

      if (!pattern.test(text)) {
        return text;
      }
      var parsed = gsub(text, pattern, function (match, source) {
        var i = 0,
            j = 1,
            rule = void 0,
            index = void 0,
            actualLength = void 0;
        // Find the rule that matched.
        while (rule = _this3.rules[i++]) {
          if (!match[j]) {
            j += rule.length;
            continue;
          }

          if (rule.debug) {
            console.log('DEBUG MATCH:', text.slice(0, 100));
          }

          if (rule.index) {
            // The rule is saying that it might decide that it wants to parse
            // less than what it was given. In that case it'll return an index
            // representing the last character it's actually interested in.
            //
            // We'll return this index as a second return parameter from this
            // handler in order to let gsub know what's up.
            actualLength = rule.index(match[0], context);
            if (actualLength <= 0) {
              // -1 is your standard "string not found" index, and 0 is invalid
              // because we need to consume at least some of the string to
              // avoid an infinite loop. In both cases, ignore the result.
              actualLength = undefined;
            }
            if (typeof actualLength !== 'undefined') {
              // Trim the string down to the portion that we retroactively
              // decided we care about.
              index = actualLength + 1;
              source = source.slice(0, match.index + index);
              match = pattern.exec(source);
              if (!match || !match[j]) {
                var err = new Error('Bad "index" callback; requested substring did not match original rule.');
                Object.assign(err, { rule: rule, source: source, match: match, index: actualLength });
                throw err;
              }
            }
          }

          var replacements = [];
          for (var k = 0; k <= rule.length; k++) {
            replacements.push(match[j + k]);
          }

          replacements.name = rule.name;

          if (rule.before) {
            var beforeResult = rule.before(replacements, context);
            if (typeof beforeResult !== 'undefined') {
              replacements = beforeResult;
            }
          }

          var replacer = rule.replacement;
          if (!replacements.name) {
            // Only assign the name if it isn't already there. The `before`
            // callback might have changed the name.
            replacements.name = rule.name;
          }
          replacements.index = match.index;

          var result = replacer.evaluate(replacements);

          if (rule.after) {
            var afterResult = rule.after(result, context);
            if (typeof afterResult !== 'undefined') {
              result = afterResult;
            }
          }

          if (typeof actualLength !== 'undefined') {
            return [result, index];
          }

          return result;
        }

        // No matches, so let's return an empty string.
        return '';
      });

      return parsed;
    }
  }, {
    key: '_makeRules',
    value: function _makeRules(rules) {
      var prevCaptures = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var results = [];
      for (var ruleName in rules) {
        var rule = new Rule(ruleName, rules[ruleName], prevCaptures);
        results.push(rule);
        prevCaptures += rule.length;
      }

      return results;
    }
  }, {
    key: 'match',
    value: function match(className) {
      return this._classNamePattern.test(className);
    }
  }, {
    key: 'extend',
    value: function extend() {
      var _this4 = this,
          _rules;

      var grammar = void 0;

      for (var _len = arguments.length, grammars = Array(_len), _key = 0; _key < _len; _key++) {
        grammars[_key] = arguments[_key];
      }

      if (grammars.length === 1) {
        grammar = grammars[0];
      } else {
        grammars.forEach(function (g) {
          return _this4.extend(g);
        });
        return this;
      }

      if (grammar instanceof Grammar) {
        grammar = grammar.toObject();
      }
      if (!grammar) {
        throw new Error('Nonexistent grammar!');
      }

      var prevCaptures = 0;
      if (this.rules.length) {
        prevCaptures = this.rules.map(function (r) {
          return r.length;
        }).reduce(function (a, b) {
          return a + b;
        });
      }

      var rules = grammar;

      var instances = this._makeRules(rules, prevCaptures);
      (_rules = this.rules).push.apply(_rules, toConsumableArray(instances));

      this.pattern = new RegExp(this.rules.map(function (r) {
        return r.pattern;
      }).join('|'), this.options.ignoreCase ? 'mi' : 'm');

      return this;
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      var result = {};
      this.rules.forEach(function (r) {
        result[r.name] = r.toObject();
      });
      return result;
    }
  }]);
  return Grammar;
}();

var Rule = function () {
  function Rule(name, rule, prevCaptures) {
    classCallCheck(this, Rule);

    this.name = name;

    var r = rule.replacement;
    if (r) {
      this.replacement = r instanceof Template ? r : new Template(r);
    } else {
      this.replacement = Rule.DEFAULT_TEMPLATE;
    }

    this.debug = rule.debug;
    this.before = rule.before;
    this.after = rule.after;
    this.index = rule.index;

    var pattern = rule.pattern;
    if (typeof pattern !== 'string') {
      pattern = _regexToString(pattern);
    }

    // Alter backreferences so that they point to the right thing. Yes,
    // this is ridiculous.
    pattern = pattern.replace(/\\(\d+)/g, function (m, d) {
      var group = Number(d);
      // Adjust for the number of groups that already exist, plus the
      // surrounding set of parentheses.
      return '\\' + (prevCaptures + group + 1);
    });

    // Count all open parentheses.
    var parens = (pattern.match(/\(/g) || '').length;
    // Subtract the ones that begin non-capturing groups.
    var nonCapturing = (pattern.match(/\(\?[:!=]/g) || '').length;
    // Subtract the ones that are literal open-parens.
    var escaped = (pattern.match(/\\\(/g) || '').length;
    // Add back the ones that match the literal pattern `\(?`, because they
    // were counted twice instead of once.
    var nonCapturingEscaped = (pattern.match(/\\\(\?[:!=]/g) || '').length;

    var exceptions = nonCapturing + escaped - nonCapturingEscaped;

    // Add one because we're about to surround the whole thing in a
    // capturing group.
    this.length = parens + 1 - exceptions;
    this.pattern = '(' + pattern + ')';
  }

  createClass(Rule, [{
    key: 'toObject',
    value: function toObject() {
      // Trim the enclosing parentheses from the pattern.
      var pattern = this.pattern.substring(1, this.pattern.length - 1);
      return {
        pattern: pattern,
        replacement: this.replacement,
        before: this.before,
        after: this.after,
        index: this.index
      };
    }
  }]);
  return Rule;
}();

Rule.DEFAULT_TEMPLATE = new Template('<span class="#{name}">#{0}</span>');

var _templateObject = taggedTemplateLiteral(['\n      (&lt;|<)(script|SCRIPT) # 1, 2: opening script element\n      (s+.*?)?               # 3: space and optional attributes\n      (&gt;|>)                # 4: end opening element\n      ([sS]*?)              # 5: contents\n      ((?:&lt;|<)/)(script|SCRIPT)(&gt;|>) # 6, 7, 8: closing script element\n    '], ['\n      (&lt;|<)(script|SCRIPT) # 1, 2: opening script element\n      (\\s+.*?)?               # 3: space and optional attributes\n      (&gt;|>)                # 4: end opening element\n      ([\\s\\S]*?)              # 5: contents\n      ((?:&lt;|<)\\/)(script|SCRIPT)(&gt;|>) # 6, 7, 8: closing script element\n    ']);

var compact$1 = compact;
var VerboseRegExp$1 = VerboseRegExp;


var ATTRIBUTES = new Grammar({
  string: {
    pattern: /('[^']*[^\\]'|"[^"]*[^\\]")/
  },

  attribute: {
    pattern: /\b([a-zA-Z-:]+)(=)/,
    replacement: compact$1('\n      <span class=\'attribute\'>\n        <span class=\'#{name}\'>#{1}</span>\n        <span class=\'punctuation\'>#{2}</span>\n      </span>\n    ')
  }
});

var MAIN = new Grammar('html', {
  doctype: {
    pattern: /&lt;!DOCTYPE([^&]|&[^g]|&g[^t])*&gt;/
  },

  'embedded embedded-javascript': {
    pattern: VerboseRegExp$1(_templateObject),
    replacement: compact$1('\n      <span class=\'element element-opening\'>\n        <span class=\'punctuation\'>#{1}</span>\n        <span class=\'tag\'>#{2}</span>#{3}\n        <span class=\'punctuation\'>#{4}</span>\n      </span>\n        #{5}\n      <span class=\'element element-closing\'>\n        <span class=\'punctuation\'>#{6}</span>\n        <span class=\'tag\'>#{7}</span>\n        <span class=\'punctuation\'>#{8}</span>\n      </span>\n    '),
    before: function before(r, context) {
      if (r[3]) {
        r[3] = ATTRIBUTES.parse(r[3], context);
      }
      r[5] = context.highlighter.parse(r[5], 'javascript', context);
    }
  },

  'tag tag-open': {
    pattern: /((?:<|&lt;))([a-zA-Z0-9:]+\s*)(.*?)(\/)?(&gt;|>)/,
    replacement: compact$1('\n      <span class=\'element element-opening\'>\n        <span class=\'punctuation\'>#{1}</span>\n        <span class=\'tag\'>#{2}</span>#{3}\n        <span class=\'punctuation\'>#{4}#{5}</span>\n      </span>\n    '),
    before: function before(r, context) {
      r[3] = ATTRIBUTES.parse(r[3], context);
    }
  },

  'tag tag-close': {
    pattern: /(&lt;\/)([a-zA-Z0-9:]+)(&gt;)/,
    replacement: compact$1('\n      <span class=\'element element-closing\'>\n        <span class=\'punctuation\'>#{1}</span>\n        <span class=\'tag\'>#{2}</span>\n        <span class=\'punctuation\'>#{3}</span>\n      </span>\n    ')
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
var balance$1 = balance;
var compact$2 = compact;
var wrap$1 = wrap;
var VerboseRegExp$2 = VerboseRegExp;

// TODO:
// * Generators

var ESCAPES = new Grammar({
  escape: {
    pattern: /\\./
  }
});

var REGEX_INTERNALS = new Grammar({
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

var INSIDE_TEMPLATE_STRINGS = new Grammar({
  'interpolation': {
    pattern: /(\$\{)(.*?)(\})/,
    replacement: "<span class='#{name}'><span class='punctuation'>#{1}</span><span class='interpolation-contents'>#{2}</span><span class='punctuation'>#{3}</span></span>",
    before: function before(r, context) {
      r[2] = MAIN$1.parse(r[2], context);
    }
  }
}).extend(ESCAPES);

var PARAMETERS = new Grammar({
  'parameter parameter-with-default': {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,
    replacement: compact$2('\n      <span class="parameter">\n        <span class="variable">#{1}</span>\n        <span class="operator">#{2}</span>\n      #{3}\n      </span>\n    '),
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

var VALUES = new Grammar({
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
      if (r[4]) r[4] = wrap$1(r[4], 'keyword regexp-flags');
    }
  }
});

var DESTRUCTURING = new Grammar({
  alias: {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,
    replacement: "<span class='entity'>#{1}</span>#{2}#{3}#{4}"
  },

  variable: {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  }
});

var MAIN$1 = new Grammar('javascript', {}, { alias: ['js'] });
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
    pattern: VerboseRegExp$2(_templateObject$1),
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
      return balance$1(matchText, char, paired, { startIndex: matchText.indexOf(char) + 1 });
    },
    replacement: "<span class='storage'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
    before: function before(r, context) {
      r[4] = DESTRUCTURING.parse(r[4], context);
    }
  },

  'function function-expression': {
    pattern: VerboseRegExp$2(_templateObject2),
    replacement: "<span class='keyword keyword-function'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
    before: function before(r, context) {
      if (r[3]) r[3] = '<span class=\'entity\'>' + r[3] + '</span>';
      r[6] = handleParams(r[6], context);
      return r;
    }
  },

  'function function-literal-shorthand-style': {
    pattern: VerboseRegExp$2(_templateObject3),

    replacement: "#{1}#{2}#{3}<span class='entity'>#{4}</span>#{5}#{6}#{7}#{8}#{9}#{10}",
    before: function before(r, context) {
      if (r[2]) r[2] = '<span class=\'storage\'>' + r[1] + '</span>';
      r[7] = handleParams(r[7], context);
    }
  },

  'function function-assigned-to-variable': {
    pattern: VerboseRegExp$2(_templateObject4),
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
    pattern: VerboseRegExp$2(_templateObject5),
    index: function index(match) {
      return balance$1(match, '}', '{', { startIndex: match.indexOf('{') + 1 });
      // return findBalancedToken('}', '{', match, match.indexOf('{') + 1);
    },
    replacement: compact$2('\n      <span class="storage">#{1}</span>\n      #{2}#{3}\n      #{4}#{5}#{6}#{7}\n      #{8}#{9}\n    '),
    before: function before(r) {
      if (r[3]) r[3] = wrap$1(r[3], 'entity entity-class');
      if (r[5]) r[5] = wrap$1(r[5], 'storage');
      if (r[7]) r[7] = wrap$1(r[7], 'entity entity-class entity-superclass');
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

var balance$2 = balance;
var wrap$2 = wrap;
var compact$3 = compact;
var VerboseRegExp$3 = VerboseRegExp;

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

      name = wrap$2(name, 'variable parameter');
      eq = wrap$2(eq, 'keyword punctuation');
      value = grammar.parse(value);
      return space + name + eq + value;
    });
  } else {
    part = onlyHighlightKeywordArgs ? grammar.parse(part, context) : wrap$2(part, 'variable parameter');
  }
  return part;
}

var STRINGS = new Grammar({
  interpolation: {
    pattern: /\{(\d*)\}/
  }
});

var MAIN$2 = new Grammar('python', {
  'keyword keyword-import': {
    pattern: /(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(?=\n)/,
    replacement: compact$3('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      #{3}#{4}\n      <span class=\'keyword\'>#{5}</span>#{6}\n      #{7}\n    ')
  },

  'meta: subclass': {
    pattern: /(class)(\s+)([\w\d_]+)\(([\w\d_]*)\):/,
    replacement: compact$3('\n      <span class=\'keyword\'>#{1}</span>#{2}\n      <span class=\'entity entity-class class\'>#{3}</span>\n      (<span class=\'entity entity-class entity-superclass\'>#{4}</span>) :\n    ')
  },

  'meta: class': {
    pattern: /(class)(\s+)([\w\d_]+):/,
    replacement: "<span class='keyword'>#{1}</span>#{2}<span class='entity entity-class class'>#{3}</span>:"
  },

  comment: {
    pattern: /#[^\n]*(?=\n)/
  },

  keyword: {
    pattern: VerboseRegExp$3(_templateObject$2)
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
    pattern: VerboseRegExp$3(_templateObject2$1),
    replacement: compact$3('\n      <span class=\'keyword\'>#{1}</span>#{2}\n      <span class=\'entity\'>#{3}</span>#{4}\n      #{5}#{6}#{7}\n    '),
    before: function before(r, context) {
      if (r[6]) {
        r[6] = handleParameters(r[6], context);
      }
    }
  },

  'meta: method invocation': {
    pattern: VerboseRegExp$3(_templateObject3$1),
    index: function index(text) {
      return balance$2(text, ')', '(', text.indexOf('('));
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

var balance$3 = balance;
var compact$4 = compact;
var VerboseRegExp$4 = VerboseRegExp;


function hasOnlyLeftBrace(part) {
  return part.includes('{') && !part.includes('}');
}

function findEndOfHash(allParts, startIndex) {
  var parts = allParts.slice(startIndex);

  // Join the parts together so we can search one string to find the balanced
  // brace.
  var str = parts.join('');
  var index = balance$3(str, '}', '{', { stackDepth: 1 });
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

var PARAMETERS$1 = new Grammar({
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
var BLOCK_PARAMETERS = new Grammar({
  'variable parameter': {
    pattern: /^(\s*)([A-Za-z0-9_]+)$/,
    replacement: "#{1}<span class='#{name}'>#{2}</span>"
  }
});

// Values.
// In other words, (nearly) anything that's valid on the right hand side of
// an assignment operator.
var VALUES$1 = new Grammar({
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
      return balance$3(text, '}', '{', { startIndex: text.indexOf('{') });
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

var REGEX_INTERNALS$1 = new Grammar({
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

var STRINGS$1 = new Grammar({
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

var MAIN$3 = new Grammar('ruby', {
  'meta: method definition': {
    pattern: /(def)(\s+)([A-Za-z0-9_!?.]+)(?:\s*(\()(.*?)(\)))?/,
    replacement: "<span class='keyword'>#{1}</span>#{2}<span class='entity'>#{3}</span>#{4}#{5}#{6}",
    before: function before(r, context) {
      if (r[5]) r[5] = parseParameters(r[5], null, context);
    }
  },

  'block block-braces': {
    pattern: /(\{)(\s*)(\|)([^|]*?)(\|)/,
    replacement: compact$4('\n      <b class=\'#{name}\'>\n        <span class=\'punctuation brace\'>#{1}</span>#{2}\n        <span class=\'punctuation pipe\'>#{3}</span>\n        #{4}\n        <span class=\'punctuation pipe\'>#{5}</span>\n    '),
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
    pattern: VerboseRegExp$4(_templateObject$3),
    replacement: compact$4('\n      <b class=\'#{name}\'>\n        <span class=\'keyword\'>#{1}</span>#{2}\n        <span class=\'punctuation pipe\'>#{3}</span>\n        #{4}\n        <span class=\'punctuation pipe\'>#{5}</span>\n    '),
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
    pattern: VerboseRegExp$4(_templateObject2$2),
    replacement: compact$4('\n      <span class=\'keyword\'>#{1}</span>#{2}\n      <span class=\'class-definition-signature\'>\n        <span class=\'class\'>#{3}</span>#{4}<span class=\'class superclass\'>#{5}</span>\n      </span>\n    ')
  },

  'meta: class or module definition': {
    pattern: /(class|module)(\s+)([A-Z][A-Za-z0-9_]*)\s*(?=$|\n)/,
    replacement: compact$4('\n      <span class=\'keyword\'>#{1}</span>#{2}\n      <span class=\'class-definition-signature\'>\n        <span class=\'class\'>#{3}</span>\n      </span>\n    ')
  },

  'string heredoc-indented': {
    pattern: /(&lt;&lt;-|<<-)([_\w]+?)\b([\s\S]+?)(\2)/,
    replacement: compact$4('\n      <span class=\'#{name}\'>\n        <span class=\'begin\'>#{1}#{2}</span>\n        #{3}\n        <span class=\'end\'>#{4}</span>\n      </span>\n    '),
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

var balance$4 = balance;
var compact$5 = compact;
var VerboseRegExp$5 = VerboseRegExp;


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

var FUNCTIONS = new Grammar({
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
      return balance$4(match, ')', '(', { startIndex: match.indexOf('(') });
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

var INTERPOLATIONS = new Grammar({
  interpolation: {
    pattern: /(\#\{)(.*?)(})/,
    replacement: "<span class='interpolation'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = VALUES$2.parse(r[2], context);
    }
  }
});

function variableRuleNamed(name) {
  return new Grammar(defineProperty({}, name, { pattern: /\$[A-Za-z0-9_-]+/ }));
}

var VARIABLE = new Grammar({
  'variable': {
    pattern: /\$[A-Za-z0-9_-]+/
  }
});

var VARIABLES = new Grammar({
  'variable variable-assignment': {
    // NOTE: This is multiline. Will search until it finds a semicolon, even if it's not on the same line.
    pattern: /(\s*)(\$[A-Za-z][A-Za-z0-9_-]*)\b(\s*)(\:)([\s\S]*?)(;)/,
    replacement: compact$5('\n      #{1}\n      <span class=\'#{name}\'>#{2}</span>#{3}\n      <span class=\'punctuation\'>#{4}</span>\n      #{5}#{6}\n    '),
    // replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}<span class='punctuation'>#{4}</span>#{5}#{6}",
    before: function before(r, context) {
      r[5] = VALUES$2.parse(r[5], context);
    }
  }
}).extend(VARIABLE);

var PARAMETERS$2 = new Grammar({
  'parameter parameter-with-default': {
    pattern: /(\$[A-Za-z][A-Za-z0-9_-]*)(\s*:\s*)(.*?)(?=,|\)|\n)/,
    replacement: compact$5('\n      <span class="parameter">\n        <span class="variable">#{1}</span>\n        <span class="punctuation">#{2}</span>\n      #{3}\n      </span>\n    '),
    before: function before(r, context) {
      r[3] = VALUES$2.parse(r[3], context);
    }
  }
}).extend(variableRuleNamed('variable parameter'));

var SELECTORS = new Grammar({
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
      return balance$4(match, '}', '{', { startIndex: match.indexOf('{') });
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
    pattern: VerboseRegExp$5(_templateObject$4),
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

var MAPS = new Grammar({
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

var OPERATOR_LOGICAL = new Grammar({
  'operator operator-logical': {
    pattern: /\b(and|or|not)\b/
  }
});

var OPERATORS = new Grammar({
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

var VALUES$2 = new Grammar({
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
    pattern: VerboseRegExp$5(_templateObject2$3),
    replacement: "<span class='number'>#{1}</span>#{2}<span class='unit'>#{3}</span>"
  }
}).extend(OPERATORS, VARIABLE);

var NUMBERS = new Grammar({
  'number': {
    pattern: /[\+|\-]?(\s*)?([0-9]+(\.[0-9]+)?|\.[0-9]+)/
  }
});

var STRINGS$2 = new Grammar({
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

var COLORS = new Grammar({
  'constant color-hex': {
    pattern: /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/
  },

  'constant color-named': {
    pattern: /\b(aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow)\b/
  }
});

var DIRECTIVES = new Grammar({
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

var COMMENTS = new Grammar({
  'comment comment-line': {
    pattern: /(?:\s*)\/\/(?:.*?)(?=\n)/
  },
  'comment comment-block': {
    pattern: /(?:\s*)(\/\*)([\s\S]*)(\*\/)/
  }
});

var PROPERTIES = new Grammar({
  'meta: property pair': {
    pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(;)/,
    replacement: '<span class="property">#{1}</span>#{2}#{3}#{4}',
    before: function before(r, context) {
      r[3] = VALUES$2.parse(r[3], context);
    }
  }
});

var INSIDE_AT_RULE_MEDIA = new Grammar({
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

var INSIDE_AT_RULE_IF = new Grammar({}).extend(FUNCTIONS, OPERATORS, VALUES$2);

var INSIDE_AT_RULE_INCLUDE = new Grammar({}).extend(PARAMETERS$2, VALUES$2);

INSIDE_AT_RULE_INCLUDE.extend({
  'string string-unquoted': {
    pattern: /\b\w+\b/
  }
});

var INSIDE_AT_RULE_KEYFRAMES = new Grammar({
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

var INSIDE_AT_RULE_SUPPORTS = new Grammar({
  'meta: property pair': {
    pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(?=\)|$)/,
    replacement: '<span class="property">#{1}</span>#{2}#{3}#{4}',
    before: function before(r, context) {
      r[3] = VALUES$2.parse(r[3], context);
    }
  }
}).extend(OPERATOR_LOGICAL);

var MEDIA_AT_RULE_PROP_PAIR = new Grammar({
  'meta: property pair': {
    pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(?=\)|$)/,
    replacement: '<span class="property">#{1}</span>#{2}#{3}#{4}',
    before: function before(r, context) {
      r[3] = VALUES$2.parse(r[3], context);
    }
  }
});

var INSIDE_URL_FUNCTION = new Grammar({}).extend(STRINGS$2, VARIABLES, FUNCTIONS);

var AT_RULES = new Grammar({
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
      return balance$4(match, '}', '{', { startIndex: match.indexOf('{') });
    },
    before: function before(r, context) {
      r[6] = INSIDE_AT_RULE_KEYFRAMES.parse(r[6], context);
    },
    replacement: compact$5('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      <span class=\'entity\'>#{3}</span>\n      #{4}#{5}#{6}#{7}\n    ')
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
    replacement: compact$5('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      <span class=\'keyword\'>#{3}</span>#{4}\n      <span class=\'keyword\'>#{5}</span>#{6}#{7}\n    '),
    before: function before(r, context) {
      r[2] = VARIABLES.parse(r[2], context);
      r[4] = VALUES$2.parse(r[4], context);
      r[6] = VALUES$2.parse(r[6], context);
    }
  },

  'keyword keyword-at-rule keyword-at-rule-mixin': {
    pattern: /(@mixin)(\s+)([A-Za-z-][A-Za-z0-9\-_]+)(?:(\s*\())?(.*)(?={)/,
    replacement: compact$5('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      <span class=\'function\'>#{3}</span>#{4}#{5}\n    '),
    before: function before(r, context) {
      if (r[5]) {
        r[5] = PARAMETERS$2.parse(r[5], context);
      }
    }
  },

  'keyword keyword-at-rule keyword-at-rule-function': {
    pattern: /(@function)(\s+)([A-Za-z-][A-Za-z0-9\-_]+)(?:(\s*\())?(.*)(?={)/,
    replacement: compact$5('\n      <span class=\'#{name}\'>#{1}</span>#{2}\n      <span class=\'function\'>#{3}</span>#{4}#{5}\n    '),
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

var MAIN$4 = new Grammar('scss', {});

MAIN$4.extend(FUNCTIONS, VARIABLES, AT_RULES);

MAIN$4.extend({
  'meta: selector line': {
    pattern: VerboseRegExp$5(_templateObject3$2),
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

var INSIDE_STRINGS = new Grammar({
  variable: {
    pattern: /(\$[\d\w_\-]+)\b|(\$\{[\d\w_\-]+\})/
  }
});

var INSIDE_SHELL_COMMANDS = new Grammar({
  variable: {
    pattern: /(\$[\w_\-]+)\b/
  }
});

var MAIN$5 = new Grammar('shell', {
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

var highlighter = new Highlighter();

highlighter.addGrammar(MAIN$4);
highlighter.addGrammar(MAIN$1);
highlighter.addGrammar(MAIN);
highlighter.addGrammar(MAIN$2);
highlighter.addGrammar(MAIN$3);
highlighter.addGrammar(MAIN$5);

return highlighter;

})));
