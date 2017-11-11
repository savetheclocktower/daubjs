(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ruby = factory());
}(this, (function () { 'use strict';

// Find the next "balanced" occurrence of the token. Searches through the
// string unit by unit. Whenever the `paired` token is encountered, the
// stack size increases by 1. When `token` is encountered, the stack size
// decreases by 1, and if the stack size is already 0, that's our desired
// token.
function balance$1(source, token, paired) {
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
function compact$1(str) {
  str = str.replace(/^[\s\t]*/mg, '');
  str = str.replace(/\n/g, '');
  return str;
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
function VerboseRegExp$1(str) {
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

var _templateObject = taggedTemplateLiteral(['\n      (do)         # keyword\n      (s*)\n      (|)         # opening pipe\n      ([^|]*?)     # params\n      (|)         # closing pipe\n    '], ['\n      (do)         # keyword\n      (\\s*)\n      (\\|)         # opening pipe\n      ([^|]*?)     # params\n      (\\|)         # closing pipe\n    ']);
var _templateObject2 = taggedTemplateLiteral(['\n      (class)               # keyword\n      (s+)\n      ([A-Z][A-Za-z0-9_]*)  # class name\n      (s*(?:<|&lt;)s*)    # inheritance symbol, encoded or not\n      ([A-Z][A-Za-z0-9:_]*) # superclass\n    '], ['\n      (class)               # keyword\n      (\\s+)\n      ([A-Z][A-Za-z0-9_]*)  # class name\n      (\\s*(?:<|&lt;)\\s*)    # inheritance symbol, encoded or not\n      ([A-Z][A-Za-z0-9:_]*) # superclass\n    ']);

var balance = balance$1;
var compact = compact$1;
var VerboseRegExp = VerboseRegExp$1;


function hasOnlyLeftBrace(part) {
  return part.includes('{') && !part.includes('}');
}

function findEndOfHash(allParts, startIndex) {
  var parts = allParts.slice(startIndex);

  // Join the parts together so we can search one string to find the balanced
  // brace.
  var str = parts.join('');
  var index = balance(str, '}', '{', { stackDepth: 1 });
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
  if (!grammar) grammar = PARAMETERS;

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

var PARAMETERS = new Grammar({
  'meta: parameter with default': {
    pattern: /^(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*)/,
    replacement: '#{1}<span class=\'variable parameter\'>#{2}</span><span class=\'keyword punctuation\'>#{3}</span>#{4}',

    before: function before(r, context) {
      r[4] = VALUES.parse(r[4], context);
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
var VALUES = new Grammar({
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
      r[2] = STRINGS.parse(r[2], context);
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
      return balance(text, '}', '{', { startIndex: text.indexOf('{') });
    },

    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",

    // When we receive matches here, they won't be against the entire string
    // that the pattern originally matched; they'll be against the segment of
    // the string that we later decided we cared about.
    before: function before(r, context) {
      r[2] = STRINGS.parse(r[2], context);
    }
  },

  'string percent-q percent-q-brackets': {
    pattern: /(%Q\[)(.*?[^\\])(\])/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = STRINGS.parse(r[2], context);
    }
  },

  'string embedded string-shell-command': {
    pattern: /(`)([^`]*?)(`)/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = STRINGS.parse(r[2], context);
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
      r[3] = STRINGS.parse(r[3], context);
    }
  },

  regexp: {
    pattern: /(\/)(.*?)(\/)/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: function before(r, context) {
      r[2] = REGEX_INTERNALS.parse(r[2], context);
    }
  },

  'variable variable-instance': {
    pattern: /(@)[a-zA-Z_]\w*/
  },

  keyword: {
    pattern: /\b(do|class|def|if|module|yield|then|else|for|until|unless|while|elsif|case|when|break|retry|redo|rescue|require|lambda)\b/
  }

});

var REGEX_INTERNALS = new Grammar({
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

var STRINGS = new Grammar({
  escape: {
    pattern: /\\./
  },

  interpolation: {
    pattern: /(#\{)(.*?)(\})/,
    replacement: "<span class='#{name}'><span class='punctuation'>#{1}</span>#{2}<span class='punctuation'>#{3}</span></span>",
    before: function before(r, context) {
      r[2] = MAIN.parse(r[2], context);
    }
    // TODO: Re-parse inside?
  }
});

var MAIN = new Grammar('ruby', {
  'meta: method definition': {
    pattern: /(def)(\s+)([A-Za-z0-9_!?.]+)(?:\s*(\()(.*?)(\)))?/,
    replacement: "<span class='keyword'>#{1}</span>#{2}<span class='entity'>#{3}</span>#{4}#{5}#{6}",
    before: function before(r, context) {
      if (r[5]) r[5] = parseParameters(r[5], null, context);
    }
  },

  'block block-braces': {
    pattern: /(\{)(\s*)(\|)([^|]*?)(\|)/,
    replacement: compact('\n      <b class=\'#{name}\'>\n        <span class=\'punctuation brace\'>#{1}</span>#{2}\n        <span class=\'punctuation pipe\'>#{3}</span>\n        #{4}\n        <span class=\'punctuation pipe\'>#{5}</span>\n    '),
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
    pattern: VerboseRegExp(_templateObject),
    replacement: compact('\n      <b class=\'#{name}\'>\n        <span class=\'keyword\'>#{1}</span>#{2}\n        <span class=\'punctuation pipe\'>#{3}</span>\n        #{4}\n        <span class=\'punctuation pipe\'>#{5}</span>\n    '),
    before: function before(r, context) {
      // Keep a LIFO stack of block braces. When we encounter a brace that
      // we don't recognize later on, we'll pop the last scope off of the
      // stack and highlight it thusly.
      var stack = context.get('bracesStack', []);
      stack.push(r.name);
      r[4] = parseParameters(r[4], null, context);
      r[6] = MAIN.parse(r[6], context);
    }
  },

  'meta: class definition with superclass': {
    pattern: VerboseRegExp(_templateObject2),
    replacement: compact('\n      <span class=\'keyword\'>#{1}</span>#{2}\n      <span class=\'class-definition-signature\'>\n        <span class=\'class\'>#{3}</span>#{4}<span class=\'class superclass\'>#{5}</span>\n      </span>\n    ')
  },

  'meta: class or module definition': {
    pattern: /(class|module)(\s+)([A-Z][A-Za-z0-9_]*)\s*(?=$|\n)/,
    replacement: compact('\n      <span class=\'keyword\'>#{1}</span>#{2}\n      <span class=\'class-definition-signature\'>\n        <span class=\'class\'>#{3}</span>\n      </span>\n    ')
  },

  'string heredoc-indented': {
    pattern: /(&lt;&lt;-|<<-)([_\w]+?)\b([\s\S]+?)(\2)/,
    replacement: compact('\n      <span class=\'#{name}\'>\n        <span class=\'begin\'>#{1}#{2}</span>\n        #{3}\n        <span class=\'end\'>#{4}</span>\n      </span>\n    '),
    before: function before(r, context) {
      r[3] = STRINGS.parse(r[3], context);
    }
  },

  'keyword operator': {
    pattern: /(\+|-|\*|\/|>|&gt;|<|&lt;|=>|=&gt;|>>|&gt;&gt;|<<|&lt;&lt;|=~|\|\|=|==|=|\|\||&&|\+=|-=|\*=|\/=)/
  },

  'keyword special': {
    pattern: /\b(initialize|new|loop|extend|raise|attr|catch|throw|private|protected|public|module_function|attr_(?:reader|writer|accessor))\b/
  }
});

MAIN.extend(VALUES);

// These need to be lowest possible priority, so we put them in after the
// values grammar.
MAIN.extend({
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

return MAIN;

})));
