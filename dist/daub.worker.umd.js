(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
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
  }

  // Coerces `null` and `undefined` to empty strings; uses default coercion on
  // everything else.
  function _interpretString(value) {
    return value == null ? '' : String(value);
  }

  function _regexpWithoutGlobalFlag(re) {
    let flags = re.flags.replace('g', '');
    return new RegExp(regExpToString(re), flags);
  }

  function regExpToString(re) {
    let str = re.toString();
    str = str.replace(/^\//, '');
    str = str.replace(/\/[mgiy]*$/, '');
    return str;
  }

  function escapeRegExp(str) {
    return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  } // Like String#replace, but with some enhancements:
  //
  // * Understands Templates and Template-style strings.
  // * Allows the handler to retroactively match _less_ than what it was
  //   given, tossing the rest back into the queue for matching.
  //


  function gsub(source, pattern, replacement) {
    let result = '';

    if (typeof replacement !== 'function') {
      let template = new Template(replacement);

      replacement = match => template.evaluate(match);
    }

    if (pattern.flags && pattern.flags.indexOf('g') > -1) {
      pattern = _regexpWithoutGlobalFlag(pattern);
    } else if (typeof pattern === 'string') {
      pattern = escapeRegExp(pattern);
    }

    if (!pattern) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    } // The original string is the 'inbox'; the result string is the 'outbox.'
    // While the inbox still has stuff in it, keep applying the pattern against
    // the source.


    while (source.length > 0) {
      let origLength = source.length;
      let match = source.match(pattern);

      if (match) {
        let replaced = replacement(match, source);
        let newLength;

        if (Array.isArray(replaced)) {
          // The replacement function can optionally return _two_ values: the
          // replacement string and an index representing the length of the
          // string it actually acted on. In other words, it decided it wanted to
          // claim only some of the string we gave it, and we should consider
          // _only_ that substring to have been matched in the first place.
          //
          // The index returned represents the last character of the _matched_
          // string that the handler cared about. So later on we'll have to
          // account for the length of the portion _before_ the match.
          [replaced, newLength] = replaced;
        } // Copy over the part that comes before the match.


        result += source.slice(0, match.index); // Copy over the string that is meant to replace the matched string.

        result += _interpretString(replaced); // Now we can remove everything from `source` up to the end of what was
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
  /**
   * A class describing an abstract interpolation. Can later be supplied with data
   * to produce a string.
   *
   * @param {String} template A string describing an interpolation.
   */


  class Template {
    constructor(template) {
      this.template = String(template); // Prototype's version allowed for this pattern to be customized, but that
      // makes no sense in Daub.

      this.pattern = Template.DEFAULT_PATTERN;
    }
    /**
     * Apply data to a template to produce a string.
     *
     * @param   {Object|Array} object Any object — but usually a plain object or
     *   an array — whose properties you want to make available by name for the
     *   interpolation
     * @returns {string} The interpolated string.
     */


    evaluate(object) {
      return gsub(this.template, this.pattern, match => {
        if (object == null) return '';
        let before = match[1] || '';
        if (before == '\\') return match[2];
        let ctx = object,
            expr = match[3];
        let pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
        match = pattern.exec(expr);
        if (match == null) return before;

        while (match != null) {
          let comp = match[1].charAt(0) === '[' ? match[2].replace(/\\]/, ']') : match[1];
          ctx = ctx[comp];

          if (ctx == null || match[3] === '') {
            break;
          }

          expr = expr.substring('[' === match[3] ? match[1].length : match[0].length);
          match = pattern.exec(expr);
        }

        return before + _interpretString(ctx);
      });
    }

  }

  Template.DEFAULT_PATTERN = /(^|.|\r|\n)(#\{(.*?)\})/;

  Template.interpolate = function (string, object) {
    return new Template(string).evaluate(object);
  };

  /* eslint-env commonjs */
  // get transpiled to regular expression literals during builds in the interests
  // of file size.
  // Rollup should still do the right thing so that VerboseRegExp is available to
  // custom grammars as a runtime import.

  function isEscapedHash(line, index) {
    return index === 0 ? false : line.charAt(index - 1) === '\\';
  }

  function trimCommentsFromLine(line) {
    let hashIndex = -1;

    do {
      hashIndex = line.indexOf('#', hashIndex + 1);
    } while (hashIndex > -1 && isEscapedHash(line, hashIndex));

    if (hashIndex > -1) {
      line = line.substring(0, hashIndex);
    }

    line = line.trim();
    return line;
  } // A tagged template literal that allows you to define a verbose regular
  // expression using backticks. Literal whitespace is ignored, and you can use
  // `#` to mark comments. This makes long regular expressions way easier for
  // humans to read and write.
  //
  // Escape sequences _do not_ need to be double-escaped, with one exception:
  // capture group backreferences like \5 need to be written as \\5, because JS
  // doesn't understand that syntax outside of a literal RegExp.


  function VerboseRegExp$7(str) {
    let raw = str.raw[0];
    let pattern = raw.split(/\n/).map(trimCommentsFromLine).join('').replace(/\s/g, ''); // Take (e.g.) `\\5` and turn it into `\5`. Because of a spec bug, we can't
    // do this with raw strings.

    pattern = pattern.replace(/(\\)(\\)(\d+)/g, (m, _, bs, d) => {
      return "".concat(bs).concat(d);
    });
    let result = new RegExp(pattern);
    return result;
  }

  var verboseRegexp = {
    VerboseRegExp: VerboseRegExp$7
  };

  function inWebWorker() {
    // eslint-disable-next-line no-undef
    return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
  } // So that I don't have to pull in an `Array#flat` polyfill.

  function isString(obj) {
    return typeof obj === 'string';
  }

  function wrapArray(obj) {
    return Array.isArray(obj) ? obj : [obj];
  }
  /**
   * Find the next “balanced” occurrence of the token. Searches through the string
   * unit by unit. Whenever the `paired` token is encountered, the stack depth
   * increases by one. Whenever `token` is encountered, the stack depth decreases
   * by one. When the stack depth decreases from one to zero, the index of that
   * match is returned.
   *
   * @param {string} source The source text.
   * @param {[type]} token The token which decreases the stack depth when it
   *   occurs. Can be of any length.
   * @param {[type]} paired The token which increases the stack depth when it
   *   occurs.
   * @param {Object} [options={}] Options.
   * @param {number} [startIndex=0] The index at which to start searching.
   * @param {number} [startDepth=0] The starting stack depth.
   * @param {boolean} [considerEscapes=true] When `true`, occurrences of both
   *   `token` and `paired` will be ignored when they occur immediately after a
   *   backslash. (Does not yet consider other escape sequences, nor potential
   *   false positives like a preceding literal backslash.)
   * @returns {number} The first index at which `token` occurs when balanced, or
   *   `-1` if a balanced occurrence of `token` is not found.
   */


  function balance$5(source, token, paired, options = {}) {
    options = Object.assign({
      startIndex: 0,
      startDepth: 0,
      considerEscapes: true
    }, options);
    let lastChar;
    let {
      startIndex,
      startDepth: depth,
      considerEscapes
    } = options;
    let tl = token.length;
    let pl = paired.length;
    let length = source.length;

    for (let i = startIndex; i < length; i++) {
      if (i > 0) {
        lastChar = source.slice(i - 1, i);
      }

      let escaped = considerEscapes ? lastChar === '\\' : false;
      let candidate = source.slice(i, i + tl);
      let pairCandidate = source.slice(i, i + pl);

      if (pairCandidate === paired && !escaped) {
        depth++;
      }

      if (candidate === token && !escaped) {
        depth--;

        if (depth === 0) {
          return i;
        }
      }
    }

    return -1;
  }
  /**
   * Given a multiline string, removes all newlines and all space that occurs
   * immediately after newlines.
   *
   * Lets us define replacement strings with indentation, yet have all that
   * extraneous space stripped out before it goes into the replacement.
   *
   * @param   {string} str The string to compact.
   * @returns {string} The compacted string.
   */


  function compact$7(str) {
    str = str.replace(/^[\s\t]*/mg, '');
    str = str.replace(/\n/g, '');
    return str;
  }
  /**
   * Wraps a string with an HTML `span` tag with a given class name, unless the
   * string is empty.
   *
   * @param {string} str The string to wrap.
   * @param {string} className The class name(s) to add to the `span` _if_ the
   *   string is wrapped.
   * @returns {string} The wrapped string.
   */


  function wrap$5(str, className) {
    if (!str) {
      return '';
    }

    return "<span class=\"".concat(className, "\">").concat(str, "</span>");
  }
  /**
   * Given a string of text and a lexer instance, returns the index at which the
   * lexer had its last match. Useful for balancing tokens that are more complex
   * than can be handled by the simpler `balance` function.
   *
   * @param {string} text The string.
   * @param {Lexer} lexer An instance of `Lexer`.
   * @returns {number} The index of the final character of the final token that
   *   was matched by the lexer.
   */


  function balanceByLexer$2(text, lexer, context) {
    let start, end;
    start = performance.now();

    if (performance.mark) {
      performance.mark('daub-lexer-before');
    }

    let results = lexer.run(text, context);
    end = performance.now();

    if (performance.mark) {
      performance.mark('daub-lexer-after');
      performance.measure('daub-lexer-before', 'daub-lexer-after');
    }

    if (!inWebWorker()) {
      let event = new CustomEvent('daub-lexer-time', {
        bubbles: true,
        detail: end - start
      });
      document.dispatchEvent(event);
    }

    return results.lengthConsumed - 1;
  }

  function balanceAndHighlightByLexer$2(text, lexer, context) {
    let start, end;
    start = performance.now();

    if (performance.mark) {
      performance.mark('daub-lexer-before');
    }

    let results = lexer.run(text, context, {
      highlight: true
    });
    end = performance.now();

    if (performance.mark) {
      performance.mark('daub-lexer-after');
      performance.measure('daub-lexer-before', 'daub-lexer-after');
    }

    if (!inWebWorker()) {
      let event = new CustomEvent('daub-lexer-time', {
        bubbles: true,
        detail: end - start
      });
      document.dispatchEvent(event);
    }

    let highlighted = renderLexerTree(results);
    return {
      index: results.lengthConsumed - 1,
      highlighted
    };
  }

  function flattenTree(tree) {
    let results = [];

    if (isString(tree)) {
      return [tree];
    }

    if (tree.content) {
      if (isString(tree.content)) {
        results.push({
          name: tree.name,
          scopes: tree.scopes,
          content: tree.content
        });
      } else {
        if (tree.scopes) {
          results.push({
            open: tree.scopes
          });
        }

        for (let t of wrapArray(tree.content)) {
          results.push(...flattenTree(t));
        }

        if (tree.scopes) {
          results.push({
            close: tree.scopes
          });
        }
      }
    }

    return results;
  }
  /**
    Given an array of Tokens,
   */


  function serializeLexerFragment$1(tokens) {
    let result = [];

    for (let t of tokens) {
      if (isString(t)) {
        result.push(t);
      } else if (t.content) {
        let serialized = serializeLexerFragment$1(wrapArray(t.content));
        result.push(...serialized);
      }
    }

    return result.join('');
  }

  function renderLexerTree(obj) {
    let flat = flattenTree(obj);
    return flat.map(t => {
      let result;
      console.log('tee:', t);

      if (isString(t)) {
        return t;
      }

      if (t.open) {
        result = isString(t.open) ? "<span class=\"".concat(t.open, "\">") : '';
      } else if (t.close) {
        result = isString(t.close) ? "</span>" : '';
      } else {
        let scopes = t.scopes || t.name;
        result = scopes ? "<span class=\"".concat(scopes, "\">").concat(t.content, "</span>") : t.content;
      }

      return result;
    }).join('');
  }

  var Utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    balance: balance$5,
    balanceByLexer: balanceByLexer$2,
    balanceAndHighlightByLexer: balanceAndHighlightByLexer$2,
    compact: compact$7,
    escapeRegExp: escapeRegExp,
    gsub: gsub,
    regExpToString: regExpToString,
    serializeLexerFragment: serializeLexerFragment$1,
    wrap: wrap$5,
    VerboseRegExp: verboseRegexp.VerboseRegExp
  });

  function resolve$1(value) {
    if (typeof value === 'function') {
      return value();
    }

    return value;
  }

  class ParseError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ParseError';
    }

  }

  class Grammar {
    constructor(name, rules, options = {}) {
      if (typeof name === 'object' && !rules) {
        // Anonymous grammar.
        this.name = null;
        options = rules || options;
        rules = name;
      } else {
        this.name = name;
        this.names = [name, ...(options.alias || [])];
        this._classNamePattern = new RegExp('\\b(?:' + this.names.join('|') + ')\\b');
      }

      this.options = options;
      this.rules = [];
      this._originalRules = rules;
      this.extend(rules);

      if (this.name) {
        this.names.forEach(name => {
          Grammar.register(name, this);
        });
      }
    }

    _toObject() {
      return _objectSpread2({}, this._originalRules);
    }

    parse(text, context = null) {
      let pattern = this.pattern;
      pattern.lastIndex = 0; // eslint-disable-next-line

      console.debug("Parsing ".concat(this.name || ''), {
        pattern,
        text
      });

      if (!pattern.test(text)) {
        return text;
      }

      let parsed = gsub(text, pattern, (match, source) => {
        let i = 0,
            j = 1,
            rule,
            index,
            actualLength; // Find the rule that matched.

        while (rule = this.rules[i++]) {
          if (!match[j]) {
            j += rule.length;
            continue;
          }

          console.debug('MATCH rule:', rule, match[j]);

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
                let err = new ParseError("Bad \"index\" callback; requested substring did not match original rule.");
                Object.assign(err, {
                  rule,
                  source,
                  match,
                  index: actualLength
                });
                throw err;
              }
            }
          }

          let replacements = [];

          for (let k = 0; k <= rule.length; k++) {
            replacements.push(match[j + k]);
          }

          replacements.name = rule.name;

          if (rule.captures) {
            for (let i = 0; i < replacements.length; i++) {
              if (!(i in rule.captures)) {
                continue;
              }

              let captureValue = resolve$1(rule.captures[i]);

              if (typeof captureValue === 'string') {
                // A string capture just specifies the class name(s) this token
                // should have. We'll wrap it in a `span` tag.
                replacements[i] = wrap$5(replacements[i], captureValue);
              } else if (captureValue instanceof Grammar) {
                // A grammar capture tells us to parse this string with the
                // grammar in question.
                if (replacements[i]) {
                  replacements[i] = captureValue.parse(replacements[i], context);
                }
              }
            }
          }

          if (rule.before) {
            let beforeResult = rule.before(replacements, context);

            if (typeof beforeResult !== 'undefined') {
              replacements = beforeResult;
            }
          }

          let replacer = rule.replacement;

          if (!replacements.name) {
            // Only assign the name if it isn't already there. The `before`
            // callback might have changed the name.
            replacements.name = rule.name;
          }

          replacements.index = match.index;
          let result = replacer.evaluate(replacements);

          if (rule.after) {
            let afterResult = rule.after(result, context);

            if (typeof afterResult !== 'undefined') {
              result = afterResult;
            }
          }

          if (typeof actualLength !== 'undefined') {
            return [result, index];
          }

          return result;
        } // No matches, so let's return an empty string.


        return '';
      });
      return parsed;
    }

    _makeRules(rules, prevCaptures = 0) {
      let results = [];

      for (let ruleName in rules) {
        let rule = new Rule(ruleName, rules[ruleName], prevCaptures);
        results.push(rule);
        prevCaptures += rule.length;
      }

      return results;
    }

    match(className) {
      return this._classNamePattern.test(className);
    }

    extend(...grammars) {
      let grammar;

      if (grammars.length === 1) {
        grammar = grammars[0];
      } else {
        grammars.forEach(g => this.extend(g));
        return this;
      }

      if (grammar instanceof Grammar) {
        grammar = grammar.toObject();
      }

      if (!grammar) {
        throw new Error('Nonexistent grammar!');
      }

      let prevCaptures = 0;

      if (this.rules.length) {
        prevCaptures = this.rules.map(r => r.length).reduce((a, b) => a + b);
      }

      let rules = grammar;

      let instances = this._makeRules(rules, prevCaptures);

      this.rules.push(...instances);
      this.pattern = new RegExp(this.rules.map(r => r.pattern).join('|'), this.options.ignoreCase ? 'mi' : 'm');
      return this;
    }

    toObject() {
      let result = {};
      this.rules.forEach(r => {
        result[r.name] = r.toObject();
      });
      return result;
    }

  }

  const MAP = {};

  Grammar.register = (name, grammar) => {
    MAP[name] = grammar;
  };

  Grammar.find = name => {
    return MAP[name] || null;
  };

  class Rule {
    constructor(name, rule, prevCaptures) {
      this.name = name;
      let r = rule.replacement;

      if (r) {
        this.replacement = r instanceof Template ? r : new Template(r);
      } else if (rule.captures) {
        // If captures are defined, that means this pattern defines groups. We
        // want a different default template that breaks those groups out. But we
        // won't actually make it until we know how many groups the pattern has.
        this.replacement = null;
      } else {
        this.replacement = Rule.DEFAULT_TEMPLATE;
      }

      this.debug = rule.debug;
      this.before = rule.before;
      this.after = rule.after;
      this.index = rule.index;
      this.captures = rule.captures;
      let originalPattern = rule.pattern;
      let pattern = rule.pattern;

      if (typeof pattern !== 'string') {
        pattern = regExpToString(pattern);
      } // Alter backreferences so that they point to the right thing. Yes,
      // this is ridiculous.


      pattern = pattern.replace(/\\(\d+)/g, (m, d) => {
        let group = Number(d);
        let newGroup = prevCaptures + group + 1; // Adjust for the number of groups that already exist, plus the
        // surrounding set of parentheses.

        return "\\".concat(newGroup);
      }); // Count all open parentheses.

      let parens = (pattern.match(/\(/g) || '').length; // Subtract the ones that begin non-capturing groups.

      let nonCapturing = (pattern.match(/\(\?[:!=]/g) || '').length; // Subtract the ones that are literal open-parens.

      let escaped = (pattern.match(/\\\(/g) || '').length; // Add back the ones that match the literal pattern `\(?`, because they
      // were counted twice instead of once.

      let nonCapturingEscaped = (pattern.match(/\\\(\?[:!=]/g) || '').length;
      let exceptions = nonCapturing + escaped - nonCapturingEscaped; // Add one because we're about to surround the whole thing in a
      // capturing group.

      this.length = parens + 1 - exceptions;
      this.pattern = "(".concat(pattern, ")");
      this.originalPattern = originalPattern;

      if (!this.replacement) {
        this.replacement = Rule.makeReplacement(this.length, rule.wrapReplacement);
      }
    }

    toObject() {
      return {
        // Export the original pattern, not the one we transformed. It'll need to
        // be re-transformed in its new context.
        pattern: this.originalPattern,
        replacement: this.replacement,
        before: this.before,
        after: this.after,
        index: this.index,
        captures: this.captures
      };
    }

  }

  Rule.DEFAULT_TEMPLATE = new Template('<span class="#{name}">#{0}</span>');

  Rule.makeReplacement = (length, wrap) => {
    let arr = [];

    for (let i = 1; i < length; i++) {
      arr.push(i);
    }

    let captures = arr.join("}#{");
    captures = "#{".concat(captures, "}");
    let contents = wrap ? "<span class=\"#{name}\">".concat(captures, "</span>") : captures;
    return new Template(contents);
  };

  /**
   * A wrapper class around `Map` used to pass state across grammars and lexers.
   *
   * The `set` and `get` methods work like `Map#set` and `Map#get`. The main
   * difference is that `Map#get` takes a `defaultValue` parameter to optimize the
   * common case of setting a fallback value when a key doesn't exist.
   *
   * You won't have to instantiate `Context` directly, but instances of `Context`
   * are available within certain callbacks in `Grammar` rules.
   */
  class Context {
    constructor(options = {}) {
      if (options.highlighter) {
        this.highlighter = options.highlighter;
      }

      this.storage = new Map();
    }
    /**
     * Set a value.
     * @param {*} key A map key. Can be anything, though it'll usually be a
     *   string.
     * @param {*} value A value.
     */


    set(key, value) {
      this.storage.set(key, value);
    }
    /**
     * Get a value.
     * @param {*} key A map key. Can be anything, though it'll usually be a
     *   string.
     * @param {*} defaultValue A value to set in this context (and to return
     *   from this method) if storage contains no value for this key. (Uses
     *   `Map#has` internally; `defaultValue` won't be considered if a key's value
     *   is explicitly set to `null` or other falsy values.)
     * @returns {*} The value.
     */


    get(key, defaultValue) {
      if (!this.storage.has(key)) {
        this.storage.set(key, defaultValue);
        return defaultValue;
      }

      return this.storage.get(key);
    }

  }

  /* eslint-disable no-console */
  let levels = {
    DEBUG: 0,
    INFO: 1,
    LOG: 2,
    WARN: 3,
    ERROR: 4
  };

  class Logger {
    constructor(tag = null) {
      this.tag = tag;
    }

    _tag() {
      return "[".concat(this.tag, "]");
    }

    debug(...args) {
      console.debug(this._tag(), ...args);
    }

    info(...args) {
      console.info(this._tag(), ...args);
    }

    log(...args) {
      console.log(this._tag(), ...args);
    }

    warn(...args) {
      console.warn(this._tag(), ...args);
    }

    group(...args) {
      console.group(this._tag(), ...args);
    }

    groupCollapsed(...args) {
      console.groupCollapsed(this._tag(), ...args);
    }

    groupEnd() {
      console.groupEnd();
    }

  }

  for (let label in levels) {
    Logger[label] = levels[label];
  }

  function resolve(value) {
    if (typeof value === 'function') {
      return value();
    }

    return value;
  }

  function determineIfFinal(rule, context) {
    let final = rule.final;

    if (typeof final === 'boolean') {
      return final;
    } else if (typeof final === 'function') {
      return final(context);
    } else if (!final) {
      return false;
    } else {
      throw new TypeError("Invalid value for rule.final!");
    }
  }

  class LexerError extends Error {
    constructor(message) {
      super(message);
      this.name = 'LexerError';
    }

  }
  /**
   * A string fragment with contextual information. It has a name, content, and an
   * `index` value that corresponds to where it begins in the original string. A
   * token's content can be either a string or an array of tokens.
   *
   * Tokens are created automatically by lexers.
   */


  class Token {
    constructor(name, content, index, lengthConsumed, options = {}) {
      /**
       * The name of the token. Determined by the name of the lexer rule that
       * created this token.
       * @type {string}
       */
      this.name = name;
      /**
       * The content of the token. Either a string or an array of `Token`s.
       * @type {string|Token[]}
       */

      this.content = content;
      /**
       * The index of the original string at which this token matched.
       * @type {number}
       */
      // “Length consumed” refers to the number of characters that have already
      // been processed in the original source string. All our indices should be
      // relative to this value.

      this.index = lengthConsumed + index;
      this.scopes = options.scopes;
    }

  }
  /**
   * A class that consumes a string based on a series of rules. Can include other
   * lexers or designate “sub-lexers” for certain rules.
   *
   * @param {Object[]} rules A collection of rules. Each rule object must satisfy
   *   the “rule” contract.
   * @param {String} [name = ''] A name for the lexer. Optional; used for
   *   debugging.
   */


  class Lexer {
    constructor(rules, name = '', options = {}) {
      this.rules = rules; // A lexer can optionally have a name; this is mainly for debugging
      // purposes.

      this.name = name;
      this.scopes = options.scopes;
      this.silent = !!options.silent;
      this.highlight = options.highlight;
    }
    /**
     * Add rules to the lexer.
     *
     * @param {Object[]} rules An array of rules. Each rule object must satisfy
     *   the “rule” contract.
     */


    addRules(rules) {
      this.rules.push(...rules);
    } // To iterate through a lexer is to iterate through its rules.


    [Symbol.iterator]() {
      let allRules = [];

      for (let rule of this.rules) {
        if (rule.include) {
          let lexer = resolve(rule.include);
          allRules.push([...lexer]);
        } else {
          allRules.push(rule);
        }
      }

      return allRules.values();
    }
    /**
     * Attempt to consume part or all of a string with this lexer.
     *
     * Will use its rules to break the string into tokens, matching as close to
     * the beginning of the string as possible with each successive matching
     * attempt.
     *
     * @param {[type]} text The text to consume.
     * @param {[type]} [context=null] A context object to reuse. If one is not
     *   given, a fresh context will be created. All invocations of sub-lexers by
     *   this lexer will share the same context instance.
     * @param {Object} [options={}] A series of options.
     * @param {Number} [options.startIndex=0] The index on which to start lexing
     *   the string. Defaults to 0.
     *
     * @returns {Object} An object with two keys: `results` and `text`. The
     *   `results` key refers to an array of `Token`s and raw strings. The `text`
     *   key contains whatever fragment of the string could not be parsed.
     */


    run(text, context = null, {
      startIndex = 0,
      scopes = null,
      highlight = false
    } = {}) {
      let tokens = [];

      if (!context) {
        context = new Context();
      }

      let lastText = null;
      let lengthConsumed = startIndex;

      while (text) {
        // console.groupCollapsed(`${this.name ? `[${this.name}] ` : ''}Trying new match:`, text);
        // `cMatch` and `cRule` refer to a candidate match and a candidate rule,
        // respectively.
        let rule, match, cMatch;

        for (let cRule of this) {
          cMatch = cRule.pattern.exec(text);

          if (cMatch && cRule.test) {
            // A `test` rule, if defined, imposes further criteria on this rule.
            // If it returns truthy, we proceed. If it returns falsy, the rule
            // doesn't pass after all.
            let result = cRule.test(cMatch, text, context, cRule.pattern);

            if (!result) {
              cMatch = null;
            }
          }

          if (cMatch) {
            // This rule matched, but it's still only a _candidate_ for the right
            // match. We choose the one that matches as near to the beginning of
            // the string as possible.
            if (cMatch.index === 0) {
              // This pattern matched without skipping any text. It's the winner.
              match = cMatch;
              rule = cRule;
              break;
            } else if (!match || cMatch.index < match.index) {
              // This is the match that has skipped the least text so far. But
              // keep going to see if we can find a better one.
              match = cMatch;
              rule = cRule;
            }
          }
        }

        if (!match) {
          // Failing to match anything will cause the Lexer to return and report its results.
          console.debug(this.name, 'No match!'); // console.groupEnd();

          break;
        } else {
          console.debug(this.name, 'Match:', rule.name, match[0], match, rule);
          console.debug(' found at global index:', match.index + lengthConsumed);
        }

        let matchIndex = match.index;
        let newStartIndex = match.index + match[0].length;

        if (match.index > 0) {
          let skipped = text.slice(0, match.index);
          tokens.push(skipped);
          lengthConsumed += skipped.length; // Now that we've consumed all the skipped text, the match's index
          // should be reset to zero, as if that skipped text had already been
          // processed before the call to `exec`.

          matchIndex = 0;
        }

        text = text.slice(newStartIndex); // A rule with `final: true` will cause the lexer to stop parsing once
        // the current match has been processed.
        //
        // If we're inside a sub-lexer, this means that it will cede to its
        // parent, and the parent will continue parsing with its own rules.
        //
        // If we're not inside a sub-lexer, this means that it will cede to the
        // code that called it, even if the entire string hasn't been parsed yet.
        //
        // The `final` property can be a boolean or a function. If it's a
        // function, it'll get called with the current `context` as its only
        // argument. This lets us decide dynamically whether the lexer should
        // terminate based on state.
        //
        // An additional property, `skipSubRulesIfFinal`, determines what happens
        // when a final rule also has a sub-lexer (via the `after` or
        // `inside`properties). If `false` (the default), `final` acts _after_
        // the sub-lexer has a chance to parse the remaining portion of the
        // string. If `true`, the lexer skips the sub-lexing phase even if
        // `inside` or `after` is present.

        let ruleIsFinal = determineIfFinal(rule, context);
        let shouldSkipSubRules = ruleIsFinal && rule.skipSubRulesIfFinal;

        if (rule.trim) {
          if (rule.raw) {
            throw new LexerError("Options \"trim\" and \"raw\" cannot coexist on a rule!");
          }

          let originalMatch = match[0]; // If `trim: true` is present, the rule wants us to strip leading space
          // — or, rather, pull it out of the match and prepend it as a raw token.

          let leadingMatch = /^[\n\s\t]+/.exec(originalMatch);

          if (leadingMatch) {
            tokens.push(leadingMatch[0]);
            match[0] = match[0].slice(leadingMatch[0].length);
            lengthConsumed += leadingMatch[0].length;
          }
        }

        if (rule.raw) {
          // Sometimes we write rules to match a string just to prevent it from
          // being matched by another rule. In these cases, we can use `raw:
          // true` to pass along the raw string rather than wrap it in a Token.
          tokens.push(match[0]);
          lengthConsumed += match[0].length;
        } else if ((rule.inside || rule.after) && !shouldSkipSubRules) {
          let lexerName, lexer, mode; // Often, when we encounter a certain pattern, we want to have a
          // different lexer parse some successive portion of the string before
          // we act again. This is how we apply context-aware parsing rules.
          //
          // We specify these "sub-lexers" via `inside` or `after`. The two
          // properties have identical shapes: they take a `name` property and a
          // `lexer` property, the values of which are a string and a Lexer
          // instance, respectively.
          //
          // Sub-lexing produces a token whose content is an array, rather than a
          // string, and which contains all the Tokens parsed by the sub-lexer,
          // in order. Its name will be the `name` value you specified in your
          // `after` or `inside` rule.
          //
          // The difference between `inside` and `after` is whether the rule that
          // prompted the sub-lexing is placed _within_ that Token (as the first
          // item in its `content` array) or just _after_ that token.
          //
          // Any `context` set inside your lexer will also be available to
          // sub-lexers. It's up to the sub-lexer to decide when to stop parsing,
          // but that decision can be made dynamically depending on the values
          // inside of the `context` store.

          if (rule.inside) {
            mode = 'inside';
            lexerName = rule.inside.name;
            lexer = resolve(rule.inside.lexer);
          } else {
            mode = 'after';
            lexerName = rule.after.name;
            lexer = resolve(rule.after.lexer);
          }

          if (!lexer || !(lexer instanceof Lexer)) {
            throw new LexerError("Invalid lexer!");
          }

          let initialToken = new Token(rule.name, match[0], matchIndex, lengthConsumed, {
            scopes: rule.scopes || rule.name
          });
          let subLexerStartIndex = lengthConsumed + match[0].length - matchIndex;
          let subTokens = [];

          if (mode === 'inside') {
            // In 'inside' mode, this initial token is part of the subtokens
            // collection.
            subTokens.push(initialToken);
          } else {
            // In 'after' mode, this initial token is not part of the subtokens
            // collection.
            tokens.push(initialToken);
          }

          console.debug('Lexer START', lexerName, 'at index:', subLexerStartIndex); // To ensure accurate `index` values on Tokens, we need to tell the
          // sub-lexer how much of the string we've already consumed.

          let lexerResult = lexer.run(text, context, {
            startIndex: subLexerStartIndex
          });
          console.debug('Lexer END', lexerName, 'consumed:', lexerResult.lengthConsumed);
          subTokens.push(...lexerResult.tokens); // Build the container token.

          let token = new Token(lexerName, subTokens, matchIndex, lengthConsumed, {
            scopes: lexerResult.scopes
          });
          tokens.push(token);
          lengthConsumed = lexerResult.lengthConsumed;
          text = lexerResult.text;
        } else {
          // Ordinary rule with no `inside` or `after` property.
          let token = new Token(rule.name, match[0], matchIndex, lengthConsumed, {
            scopes: rule.scopes || rule.name
          });
          tokens.push(token);
          lengthConsumed += match[0].length;
        }

        if (ruleIsFinal) {
          console.debug(this.name, 'Last rule! Done.'); // console.groupEnd();

          break;
        } // If we get this far without having consumed any more of the string than
        // the last iteration, then we should consider ourselves to be done. This
        // is in place to prevent accidental infinite loops, though it does
        // prevent us from using patterns that end up consuming zero characters.
        // In the future I might want this to behave differently.


        if (text === lastText) {
          console.debug(this.name, "No further matches! Done."); // console.groupEnd();

          break;
        }

        lastText = text; // console.groupEnd();
      } // end the gigantic `while` loop.


      if (this.highlight && this.highlight) {
        tokens = this.highlight(tokens, context);
      } // Lexer#run returns three values: an array of tokens, the leftover text
      // that could not be parsed (if any), and the number of characters that
      // were able to be parsed.


      return {
        name: this.name,
        scopes: this.scopes,
        content: tokens,
        tokens,
        text,
        lengthConsumed
      };
    }

  }

  const {
    balance: balance$4,
    compact: compact$6,
    VerboseRegExp: VerboseRegExp$6
  } = Utils;
  let PARAMETERS$4 = new Grammar({
    'meta: parameter': {
      pattern: /(?:\b|^)((?:(?:[A-Za-z_$][\w\d]*)\s)*)(\s*)([a-zA-Z_$:][\w\d]*)(?=,|$)/,
      captures: {
        '1': () => STORAGE,
        '3': 'variable variable-parameter'
      }
    }
  });
  let ESCAPES$1 = new Grammar({
    escape: {
      pattern: /\\./
    }
  });
  const DECLARATIONS = new Grammar({
    'meta: function': {
      pattern: /([A-Za-z_$]\w*)(\s+)([a-zA-Z_$:]\w*)(\s*)(\()(.*)(\))(\s*)(?={)/,

      index(match) {
        let parenIndex = balance$4(match, ')', '(', {
          startIndex: match.indexOf('(')
        }); // Find the index just before the opening brace after the parentheses are
        // balanced.

        return match.indexOf('{', parenIndex) - 1;
      },

      // replacement: "<b>#{1}#{2}#{3}#{4}#{5}#{6}#{7}#{8}</b>",
      captures: {
        '1': 'storage storage-type storage-return-type',
        '3': 'entity',
        '6': () => PARAMETERS$4
      }
    },
    'meta: bare declaration': {
      pattern: /\b([A-Za-z_$][\w\d]*)(\s+)([A-Za-z_$][\w\d]*)(\s*)(?=;)/,
      captures: {
        '1': 'storage storage-type',
        '3': 'variable'
      }
    },
    'meta: declaration with assignment': {
      pattern: /\b([A-Za-z_$][\w\d]*)(\s+)([A-Za-z_$][\w\d]*)(\s*)(=)/,
      captures: {
        '1': 'storage storage-type',
        '3': 'variable',
        '5': 'operator'
      }
    },
    'meta: array declaration': {
      pattern: /\b([A-Za-z_$][\w\d]*)(\s+)([A-Za-z_$][\w\d]*)(\[)(\d+)(\])/,
      captures: {
        '1': 'storage storage-type',
        '3': 'variable',
        '4': 'punctuation',
        '5': 'number',
        '6': 'punctuation'
      }
    },
    'meta: declaration with parens': {
      pattern: /\b([A-Za-z_$][\w\d]*)(\s+)([A-Za-z_$][\w\d]*)(\s*)(\()([\s\S]*)(\))(;)/,

      index(match) {
        let balanceIndex = balance$4(match, ')', '(') + 1;
        return match.indexOf(';', balanceIndex);
      },

      captures: {
        '1': 'storage storage-type',
        '3': 'variable',
        '5': 'punctuation',
        '6': () => VALUES$5,
        '7': 'punctuation'
      }
    },
    'meta: class declaration': {
      pattern: /\b(class|enum)(\s+)([A-Za-z][A-Za-z0-9:_$]*)(\s*)({)/,
      captures: {
        '1': 'storage storage-type',
        '3': 'entity entity-class'
      }
    }
  });
  const VALUES$5 = new Grammar({
    'constant': {
      pattern: /\b[A-Z_]+\b/
    },
    'lambda': {
      pattern: /(\[\])(\s*)(\()([\s\S]*)(\))(\s*)({)([\s\S]*)(})/,

      index(match) {
        return balance$4(match, '}', '{', {
          startIndex: match.indexOf('{')
        });
      },

      wrapReplacement: true,
      captures: {
        '1': 'punctuation',
        '3': 'punctuation',
        '4': () => PARAMETERS$4,
        '5': 'punctuation',
        '7': 'punctuation',
        '8': () => MAIN$6,
        '9': 'punctuation'
      }
    },
    'constant constant-boolean': {
      pattern: /\b(?:true|false)\b/
    },
    'string string-single-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-apostrophes and non-backslashes OR
      // * an even number of consecutive backslashes OR
      // * any backslash-plus-apostrophe pair.
      pattern: /(')((?:[^'\\]|\\\\|\\')*)(')/,
      wrapReplacement: true,
      captures: {
        '2': () => ESCAPES$1
      }
    },
    'string string-double-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-quotes and non-backslashes OR
      // * an even number of consecutive backslashes OR
      // * any backslash-plus-quote pair.
      pattern: /(")((?:[^"\\]|\\\\|\\")*)(")/,
      wrapReplacement: true,
      captures: {
        '2': () => ESCAPES$1
      }
    },
    'number': {
      pattern: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i
    }
  });
  const COMMENTS$1 = new Grammar({
    comment: {
      pattern: /(\/\/[^\n]*(?=\n|$))|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
    }
  });
  const STORAGE = new Grammar({
    'storage storage-type': {
      pattern: /\b(?:u?int(?:8|16|36|64)_t|int|long|float|double|char(?:16|32)_t|char|class|bool|wchar_t|volatile|virtual|extern|mutable|const|unsigned|signed|static|struct|template|private|protected|public|mutable|volatile|namespace|struct|void|short|enum)/
    }
  });
  const MACRO_VALUES = new Grammar({}).extend(COMMENTS$1, VALUES$5);
  const MACROS = new Grammar({
    'macro macro-define': {
      pattern: /^(\#define)(\s+)(\w+)(.*?)$/,
      replacement: compact$6("\n      <span class=\"keyword keyword-macro\">#{1}</span>#{2}\n      <span class=\"entity entity-macro\">#{3}</span>\n      #{4}\n    "),
      captures: {
        '1': 'keyword keyword-macro',
        '3': 'entity entity-macro',
        '4': () => MACRO_VALUES
      }
    },
    'macro macro-include': {
      pattern: /^(\#include)(\s+)("|<|&lt;)(.*?)("|>|&gt;)(?=\n|$)/,
      replacement: compact$6("\n      <span class=\"keyword keyword-macro\">#{1}</span>#{2}\n      <span class=\"string string-include\">\n        <span class=\"punctuation\">#{3}</span>\n        #{4}\n        <span class=\"punctuation\">#{5}</span>\n      </span>\n    ")
    },
    'macro macro-with-one-argument': {
      pattern: /(\#(?:ifdef|ifndef|undef|if))(\s+)(\w+)/,
      captures: {
        '1': 'keyword keyword-macro',
        '3': 'entity entity-macro'
      }
    },
    'macro macro-error': {
      pattern: /(#error)(\s*)(")(.*)(")/,
      replacement: compact$6("\n      <span class=\"keyword keyword-macro\">#{1}</span>\n      #{2}\n      <span class=\"string string-quoted\">#{3}#{4}#{5}</span>\n    ")
    },
    'keyword keyword-macro': {
      pattern: /#(endif|else)/
    }
  });
  const MAIN$6 = new Grammar('arduino', {
    'keyword keyword-control': {
      pattern: /\b(?:alignas|alignof|asm|auto|break|case|catch|compl|constexpr|const_cast|continue|decltype|default|delete|do|dynamic_cast|else|explicit|export|for|friend|goto|if|inline|new|noexcept|nullptr|operator|register|reinterpret_cast|return|sizeof|static_assert|static_cast|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|using|while)\b/
    }
  }).extend(COMMENTS$1, DECLARATIONS);
  MAIN$6.extend(MACROS, VALUES$5, STORAGE, {
    'operator': {
      pattern: /--?|\+\+?|!=?|(?:<|&lt;){1,2}=?|(&gt;|>){1,2}=?|-(?:>|&gt;)|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|\|?|\?|\*|\/|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/
    }
  });

  const {
    balanceByLexer: balanceByLexer$1,
    balanceAndHighlightByLexer: balanceAndHighlightByLexer$1,
    compact: compact$5,
    VerboseRegExp: VerboseRegExp$5,
    wrap: wrap$4
  } = Utils;
  const LEXER_STRING$1 = new Lexer([{
    name: 'string-escape',
    pattern: /\\./
  }, {
    name: 'string-end',
    pattern: /('|")/,
    test: (match, text, context) => {
      let char = context.get('string-begin');

      if (match[1] !== char) {
        return false;
      }

      context.set('string-begin', null);
      return match;
    },
    final: true
  }], 'string', {
    scopes: 'string'
  });
  const LEXER_ATTRIBUTE_VALUE$1 = new Lexer([{
    name: 'string-begin',
    pattern: /^\s*('|")/,
    test: (match, text, context) => {
      context.set('string-begin', match[1]);
      return match;
    },
    inside: {
      name: 'string',
      lexer: LEXER_STRING$1
    }
  }], 'attribute-value');
  const LEXER_ATTRIBUTE_SEPARATOR$1 = new Lexer([{
    name: 'punctuation',
    pattern: /^=/,
    after: {
      name: 'attribute-value',
      lexer: LEXER_ATTRIBUTE_VALUE$1
    }
  }], 'attribute-separator');
  const LEXER_TAG = new Lexer([{
    name: 'tag tag-html',
    pattern: /^[a-zA-Z][a-zA-Z-:]*(?=\s|>|&gt;)/
  }, {
    name: 'attribute-name',
    pattern: /^\s*(?:\/)?[a-zA-Z][a-zA-Z-:]*(?=\=)/,
    after: {
      name: 'attribute-separator',
      lexer: LEXER_ATTRIBUTE_SEPARATOR$1
    }
  }, {
    // Self-closing tag.
    name: 'punctuation',
    pattern: /\/(?:>|&gt;)/,
    final: true
  }, {
    // Opening tag end with middle-of-tag context.
    name: 'punctuation',
    pattern: /(>|&gt;)/,
    final: true
  }], 'tag');
  const LEXER_TAG_START = new Lexer([{
    name: 'punctuation',
    pattern: /^(?:<|&lt;)/,
    after: {
      name: 'tag',
      lexer: LEXER_TAG
    }
  }], 'tag-start', {
    scopes: 'element element-opening'
  });
  const ATTRIBUTES = new Grammar({
    string: {
      pattern: /('[^']*[^\\]'|"[^"]*[^\\]")/
    },
    attribute: {
      pattern: /\b([a-zA-Z][a-zA-Z-:]*)(=)/,
      captures: {
        '1': 'attribute-name',
        '2': 'punctuation'
      }
    }
  });
  const ENTITIES = new Grammar({
    'constant constant-html-entity constant-html-entity-named': {
      pattern: /(&amp;)[a-z]+;/
    },
    'constant constant-html-entity constant-html-entity-numeric': {
      pattern: /(&amp;)\#([0-9]+|[xX][0-9a-fA-F]+);/
    }
  });
  const MAIN$5 = new Grammar('html', {
    'embedded embedded-javascript': {
      pattern: /(&lt;|<)(script|SCRIPT)(\s+.*?)?(&gt;|>)([\s\S]*?)((?:&lt;|<)\/)(script|SCRIPT)(&gt;|>)/,
      replacement: compact$5("\n      <span class='element element-opening'>\n        <span class='punctuation'>#{1}</span>\n        <span class='tag'>#{2}</span>#{3}\n        <span class='punctuation'>#{4}</span>\n      </span>\n        #{5}\n      <span class='element element-closing'>\n        <span class='punctuation'>#{6}</span>\n        <span class='tag'>#{7}</span>\n        <span class='punctuation'>#{8}</span>\n      </span>\n    "),
      captures: {
        '3': ATTRIBUTES
      },
      before: (r, context) => {
        r[5] = context.highlighter.parse(r[5], 'javascript', context);
      }
    },
    'element element-opening': {
      pattern: /(<|&lt;)([a-zA-Z][a-zA-Z-:]*)(?:(\s+)([\s\S]*))?(.)(&gt;|>)/,
      replacement: compact$5("\n      <span class='#{name}'>\n        <span class='punctuation'>#{1}</span>\n        <span class='tag tag-html'>#{2}</span>\n        #{3}#{4}#{5}\n        <span class='punctuation'>#{6}</span>\n      </span>\n    "),

      index(match, context) {
        // return balanceByLexer(match, LEXER_TAG_START);
        let {
          index,
          highlighted
        } = balanceAndHighlightByLexer$1(match, LEXER_TAG_START, context);
        context.set('lexer-highlighted', highlighted);
        return index;
      },

      // before (r, context) {
      //   // Find the first group before group 5 that has content.
      //   let i = 4;
      //   while (r[i] === undefined) { i--; }
      //   if (r[5]) {
      //     if (r[5] === '/') {
      //       // The slash should be punctuation.
      //       r.name = r.name.replace('element-opening', 'element-self');
      //       r[5] = wrap(r[5], 'punctuation');
      //     } else {
      //       // It isn't a slash, so join it with the group it would've otherwise
      //       // been a part of.
      //       r[i] += r[5];
      //       r[5] = '';
      //     }
      //   }
      //   if (r[4]) { r[4] = ATTRIBUTES.parse(r[4], context); }
      // },
      after(text, context) {
        let highlighted = context.get('lexer-highlighted');
        context.set('lexer-highlighted', false);
        return highlighted || text;
      }

    },
    'element element-closing': {
      pattern: /((?:<|&lt;)\/)([a-zA-Z:\-]+)(>|&gt;)/,
      captures: {
        '1': 'punctuation',
        '2': 'tag tag-html',
        '3': 'punctuation'
      },
      wrapReplacement: true
    },
    //  /((?:<|&lt;)!)(DOCTYPE)(\s+)(html)([\s\S]*?)?(>|&gt;)/
    'element element-doctype': {
      pattern: /((?:<|&lt;)!)(DOCTYPE)(\s+)(html)([\s\S]*?)(>|&gt;)/,
      captures: {
        '1': 'punctuation',
        '2': 'keyword special',
        '4': 'keyword special',
        '5': ATTRIBUTES,
        '6': 'punctuation'
      },
      wrapReplacement: true
    },
    comment: {
      pattern: /(?:<|&lt;)!\s*(--([^-]|[\r\n]|-[^-])*--\s*)(?:>|&gt;)/
    }
  }, {
    encode: true
  });
  MAIN$5.extend(ENTITIES);

  /* eslint-disable no-useless-escape */
  const {
    balance: balance$3,
    balanceByLexer,
    balanceAndHighlightByLexer,
    serializeLexerFragment,
    compact: compact$4,
    renderTree,
    wrap: wrap$3,
    VerboseRegExp: VerboseRegExp$4
  } = Utils; // TODO:
  // * Generators.
  // LEXERS
  // ======
  // Consumes until a string-ending delimiter. The string-beginning delimiter is
  // in context as `string-begin`.

  const LEXER_STRING = new Lexer([{
    name: 'string-escape',
    pattern: /\\./
  }, {
    name: 'string-end',
    pattern: /('|")/,
    test: (match, text, context) => {
      let char = context.get('string-begin');

      if (match[1] !== char) {
        return false;
      }

      context.set('string-begin', null);
      return match;
    },
    final: true
  }], 'string', {
    scopes: 'string'
  }); // After seeing `{`, consumes until it sees `}`. Goes one level deeper for each
  // `{` it sees.

  const LEXER_BALANCE_BRACES = new Lexer([{
    name: 'punctuation',
    pattern: /\{/,
    inside: {
      lexer: () => LEXER_BALANCE_BRACES
    }
  }, {
    name: 'punctuation',
    pattern: /\}/,
    final: true
  }], 'balance-braces');
  const LEXER_TEMPLATE_STRING_INTERPOLATION = new Lexer([{
    name: 'exclude escaped closing brace',
    pattern: /\\\}/,
    raw: true
  }, {
    name: 'punctuation interpolation-end',
    pattern: /\}/,
    final: true
  }], 'template-string-interpolation');
  const LEXER_TEMPLATE_STRING = new Lexer([{
    name: 'interpolation-start',
    pattern: /(\$\{)/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_TEMPLATE_STRING_INTERPOLATION
    }
  }, {
    name: 'exclude escaped backtick',
    pattern: /\\\x60/,
    raw: true
  }, {
    name: 'string-end',
    pattern: /\x60/,
    final: true
  }], 'template-string'); // After seeing `$` followed by `{`, consumes until it sees a balanced closing
  // brace.

  const LEXER_JSX_INTERPOLATION = new Lexer([{
    name: 'punctuation interpolation-begin',
    pattern: /\{/,
    inside: {
      lexer: LEXER_BALANCE_BRACES
    }
  }, {
    name: 'exclude escaped closing brace',
    pattern: /\\\}/,
    raw: true
  }, {
    name: 'string-begin',
    // classNames: 'string string-quoted',
    pattern: /^\s*('|")/,
    test: (match, text, context) => {
      context.set('string-begin', match[1]);
      return match;
    },
    inside: {
      name: 'string',
      lexer: LEXER_STRING
    }
  }, {
    name: 'template-string-begin',
    pattern: /\x60/,
    inside: {
      name: 'template-string',
      lexer: LEXER_TEMPLATE_STRING
    }
  }, {
    name: 'punctuation interpolation-end',
    pattern: /\}/,
    final: true
  }], 'jsx-interpolation', {
    highlight: (tokens, context) => {
      let last = tokens.pop();
      let serialized = serializeLexerFragment(tokens);
      let highlighted = MAIN$4.parse(serialized, context);
      return [highlighted, last];
    },
    scopes: 'embedded jsx-interpolation'
  }); // Expects to be deployed immediately before a JSX interpolation. Consumes
  // until the end of the interpolation.

  const LEXER_BEFORE_JSX_INTERPOLATION = new Lexer([{
    name: 'punctuation interpolation-begin',
    pattern: /^\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    }
  }], 'before-jsx-interpolation'); // After seeing `=` in a JSX tag, consumes either an interpolation or a string
  // until the value ends.

  const LEXER_ATTRIBUTE_VALUE = new Lexer([{
    name: 'punctuation interpolation-begin',
    pattern: /^\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    },
    final: true
  }, {
    name: 'string-begin',
    pattern: /^\s*('|")/,
    test: (match, text, context) => {
      context.set('string-begin', match[1]);
      return match;
    },
    inside: {
      name: 'string',
      lexer: LEXER_STRING
    }
  }], 'attribute-value'); // Expects to be deployed immediately before the `=` that separates an
  // attribute name and value.

  const LEXER_ATTRIBUTE_SEPARATOR = new Lexer([{
    name: "punctuation",
    pattern: /^=/,
    after: {
      name: 'attribute-value',
      lexer: LEXER_ATTRIBUTE_VALUE
    }
  }], 'attribute-separator'); // After seeing `</` in a JSX context, consumes until the end of the tag.

  const LEXER_JSX_CLOSING_TAG = new Lexer([{
    name: 'tag HTML',
    scopes: 'tag tag-html',
    pattern: /^[a-z]+(?=&gt;|>)/
  }, {
    name: 'tag JSX',
    scopes: 'tag tag-jsx',
    pattern: /^[A-Z][A-Za-z0-9_$\.]*(?=&gt;|>)/
  }, {
    name: 'punctuation',
    pattern: /^\s*(?:>|&gt;)/,
    test: (match, text, context) => {
      let depth = context.get('jsx-tag-depth');

      if (depth < 1) {
        throw new Error("Depth error!");
      }

      depth--;
      context.set('jsx-tag-depth', depth);
      return match;
    },
    trim: true,
    final: true
  }], 'jsx-closing-tag', {
    scopes: 'jsx-element element element-closing'
  }); // Consumes the inside of a JSX opening (or self-closing) tag, where "inside"
  // means the part after the name and before the closing `>`.

  const LEXER_INSIDE_TAG = new Lexer([{
    name: 'punctuation interpolation-begin',
    pattern: /^\s*\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    },
    trim: true
  }, {
    name: 'attribute-name',
    pattern: /^\s*[a-zA-Z][a-zA-Z0-9_$]+(?=\=)/,
    after: {
      name: 'attribute-separator',
      lexer: LEXER_ATTRIBUTE_SEPARATOR
    },
    trim: true
  }, {
    // The end of a self-closing tag.
    name: 'punctuation punctuation-self-closing',
    pattern: /^\s*\/(?:>|&gt;)/,
    test: (match, text, context) => {
      context.set('is-opening-tag', null); // Don't increment the tag depth.

      return match;
    },
    trim: true,
    final: context => context.get('is-root')
  }, {
    // The end of a tag.
    name: 'punctuation',
    pattern: /^\s*(>|&gt;)/,
    test: (match, text, context) => {
      let wasOpeningTag = context.get('is-opening-tag');
      let depth = context.get('jsx-tag-depth');
      depth += wasOpeningTag ? 1 : -1; // This rule is designed to match situations where we're inside at least
      // one JSX tag, because in those cases we're still in JSX mode. So return
      // false if the new depth is now zero. The next rule will catch this.

      if (depth === 0) {
        return false;
      }

      context.set('jsx-tag-depth', depth);
      context.set('is-opening-tag', null);
      return match;
    },
    trim: true,
    final: context => {
      let depth = context.get('jsx-tag-depth');
      return context.get('only-opening-tag') || depth === 0;
    },
    skipSubRulesIfFinal: true,
    after: {
      name: 'jsx-contents',
      lexer: () => LEXER_WITHIN_TAG
    }
  }], 'inside-tag'); // Consumes the contents of a tag — the stuff between the opening tag and
  // closing tag.

  const LEXER_WITHIN_TAG = new Lexer([{
    // Beginning of an opening (or self-closing) JSX tag.
    name: 'punctuation',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    trim: true,
    after: {
      name: 'tag',
      lexer: () => LEXER_TAG_NAME
    }
  }, {
    name: 'punctuation',
    pattern: /(?:<|&lt;)\/(?=[A-Za-z])/,
    inside: {
      name: 'element jsx-element',
      lexer: LEXER_JSX_CLOSING_TAG
    },
    final: true
  }, {
    name: 'punctuation interpolation-begin',
    pattern: /\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    }
  }], 'within-tag'); // After seeing `<` followed by a letter, consumes the JSX tag name, followed
  // by the rest of the tag contents.

  const LEXER_TAG_NAME = new Lexer([{
    name: 'tag tag-html',
    pattern: /^[a-z\-]+(?=\s|(?:>|&gt;))/,
    test: (match, text, context) => {
      context.set('is-opening-tag', true);
      let depth = context.get('jsx-tag-depth');

      if (typeof depth !== 'number') {
        console.debug("[depth] Depth set to", 0);
        context.set('jsx-tag-depth', 0);
      }

      return match;
    },
    trim: true,
    after: {
      name: 'jsx-tag-contents',
      lexer: LEXER_INSIDE_TAG
    },
    final: context => {
      return context.get('only-opening-tag');
    }
  }, {
    name: 'tag tag-jsx',
    pattern: /^[A-Z][\w\d$\.]*(?=\s|(?:>|&gt;))/,
    test: (match, text, context) => {
      context.set('is-opening-tag', true);
      let depth = context.get('jsx-tag-depth');

      if (typeof depth !== 'number') {
        context.set('jsx-tag-depth', 0);
      }

      return match;
    },
    after: {
      name: 'jsx-tag-contents',
      lexer: LEXER_INSIDE_TAG
    }
  }], 'tag-name'); // Expects to be deployed immediately before the beginning of a JSX opening (or
  // self-closing) tag. Consumes only until the tag ends.

  const LEXER_TAG_OPEN_START = new Lexer([{
    name: 'punctuation',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    test: (match, text, context) => {
      context.set('only-opening-tag', true);
      return match;
    },
    trim: true,
    after: {
      name: 'tag',
      lexer: LEXER_TAG_NAME,
      silent: true
    },
    final: true
  }], 'tag-open-start'); // Expects to be deployed at the beginning of a root JSX element (i.e., where
  // we switch from vanilla JS to JSX). Consumes until the entire JSX block is
  // finished.

  const LEXER_TAG_ROOT = new Lexer([{
    name: 'punctuation',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    test: (match, text, context) => {
      context.set('is-root', true);
      return match;
    },
    trim: true,
    after: {
      name: 'tag',
      lexer: LEXER_TAG_NAME,
      silent: true
    }
  }], 'tag-root', {
    scopes: 'jsx-element element element-opening'
  }); // GRAMMARS
  // ========

  let ESCAPES = new Grammar({
    escape: {
      pattern: /\\./
    }
  });
  let REGEX_INTERNALS$1 = new Grammar({
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
  let INSIDE_TEMPLATE_STRINGS = new Grammar({
    'interpolation': {
      pattern: /(\$\{)(.*?)(\})/,
      captures: {
        '1': 'punctuation interpolation-start',
        '2': () => MAIN$4,
        '3': 'punctuation interpolation-end'
      },
      wrapReplacement: true
    }
  }).extend(ESCAPES);
  const PARAMETERS$3 = new Grammar({
    'meta: parameter with default': {
      pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,
      captures: {
        '1': 'variable parameter',
        '2': 'ror',
        '3': () => VALUES$4
      }
    },
    'keyword operator': {
      pattern: /\.{3}/
    },
    operator: {
      pattern: /=/
    },
    'variable variable-parameter': {
      pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
    }
  });
  let STRINGS$3 = new Grammar({
    'string string-template': {
      pattern: /(`)((?:[^`\\]|\\\\|\\.)*)(`)/,
      captures: {
        '1': 'punctuation string-start',
        '2': INSIDE_TEMPLATE_STRINGS,
        '3': 'punctuation string-end'
      },
      wrapReplacement: true
    },
    'string string-single-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-apostrophes and non-backslashes OR
      // * an even number of consecutive backslashes OR
      // * any backslash-plus-character pair.
      pattern: /(')((?:[^'\\]|\\\\|\\.)*)(')/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      captures: {
        '2': ESCAPES
      }
    },
    'string string-double-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-quotes and non-backslashes OR
      // * an even number of consecutive backslashes OR
      // * any backslash-plus-character pair.
      pattern: /(")((?:[^"\\]|\\\\|\\.)*)(")/,
      captures: {
        '2': ESCAPES
      },
      wrapReplacement: true
    }
  });
  let JSX_INTERPOLATION = new Grammar({
    'embedded jsx-interpolation': {
      pattern: /(\{)([\s\S]*)(\})/,

      index(text) {
        return balanceByLexer(text, LEXER_BEFORE_JSX_INTERPOLATION);
      },

      captures: {
        '1': 'punctuation embedded-start',
        '2': () => MAIN$4,
        '3': 'punctuation embedded-end'
      },
      wrapReplacement: true
    }
  });
  let JSX_ATTRIBUTES = new Grammar({
    string: {
      pattern: /('[^']*[^\\]'|"[^"]*[^\\]")/
    },
    attribute: {
      pattern: /\b([a-zA-Z-:]+)(=)/,
      captures: {
        '1': 'attribute-name',
        '2': 'punctuation'
      },
      wrapReplacement: true
    }
  }).extend(JSX_INTERPOLATION);
  let JSX_TAG_CONTENTS = new Grammar({});
  JSX_TAG_CONTENTS.extend(JSX_ATTRIBUTES);
  JSX_TAG_CONTENTS.extend(JSX_INTERPOLATION);
  JSX_TAG_CONTENTS.extend({
    'punctuation punctuation-tag-close': {
      pattern: />|\/>/
    }
  });
  let JSX_TAG_ROOT = new Grammar({
    'jsx': {
      // This one is tricky. Most of the lexer machinery above is dedicated to
      // finding the balanced end to a JSX tag. That merely tells us _how much_
      // of the string we need to highlight. Then we invoke the JSX_CONTENTS
      // grammar to parse that substring.
      pattern: /(<|&lt;)([a-zA-Z_$][a-zA-Z0-9_$\.]*\s*)([\s\S]*)(&gt;|>)/,
      index: (text, context) => {
        let index = balanceByLexer(text, LEXER_TAG_ROOT, context); // let { index, highlighted } = balanceAndHighlightByLexer(text, LEXER_TAG_ROOT, context);
        // context.set('lexer-highlighted', highlighted);

        return index;
      },
      captures: {
        '0': () => JSX_CONTENTS
      },
      replacement: "<span class='jsx'>#{0}</span>",

      after(text, context) {
        return context.get('lexer-highlighted') || text;
      }

    }
  });

  function handleJsxOrHtmlTag(tagName) {
    if (tagName.match(/^[A-Z]/)) {
      return wrap$3(tagName, 'tag tag-jsx');
    } else {
      return wrap$3(tagName, 'tag tag-html');
    }
  }

  let JSX_TAGS = new Grammar({
    'meta: opening tag without attributes': {
      pattern: /(<|&lt;)([\w$][\w\d$\.]*)(&gt;|>)/,
      replacement: compact$4("\n      <span class='jsx-element element element-opening'>\n        <span class='punctuation'>#{1}</span>\n        #{2}\n        <span class='punctuation'>#{3}</span>\n      </span>\n    "),

      before(r, context) {
        r[2] = handleJsxOrHtmlTag(r[2]);
      }

    },
    'tag tag-open': {
      pattern: /(<|&lt;)([\w$][\w\d$\.]*)(\s+)([\s\S]*)(.)(&gt;|>)/,
      replacement: compact$4("\n      <span class='#{name}'>\n        <span class='punctuation'>#{1}</span>\n        #{2}#{3}#{4}#{5}\n        <span class='punctuation'>#{6}</span>\n      </span>\n    "),

      index(text) {
        return balanceByLexer(text, LEXER_TAG_OPEN_START);
      },

      before(r, context) {
        r.name = "jsx-element element element-opening"; // We grab the last character before the closing angle bracket because an
        // optional match won't work correctly after the greedy content match. If
        // that last character is a slash, we keep it as a separate token;
        // otherwise, we move it back to the end of capture group 4.

        r[2] = handleJsxOrHtmlTag(r[2]);

        if (r[5]) {
          if (r[5] === '/') {
            r.name = r.name.replace('element-opening', 'element-self');
            r[5] = wrap$3(r[5], 'punctuation');
          } else {
            r[4] += r[5];
            r[5] = '';
          }
        }

        r[4] = JSX_ATTRIBUTES.parse(r[4], context);
      }

    },
    'tag tag-close': {
      pattern: /((?:<|&lt;)\/)([\w$][\w\d_$\.]*)(\s*)(&gt;|>)/,
      replacement: compact$4("\n      <span class='jsx-element element element-closing'>\n        <span class='punctuation'>#{1}</span>\n        <span class='tag'>#{2}</span>#{3}\n        <span class='punctuation'>#{4}</span>\n      </span>\n    ")
    }
  });
  let JSX_CONTENTS = new Grammar({}).extend(JSX_INTERPOLATION, JSX_TAGS);
  let ARROW_FUNCTION_PARAMETERS = new Grammar({
    // TODO: This rule won't catch monstrous acts like the definition of an arrow
    // function as a default value inside a parameter. Not sure I care.
    'params': {
      pattern: /(\()([^)]+)(\))/,
      wrapReplacement: true,
      captures: {
        '1': 'punctuation',
        '2': PARAMETERS$3,
        '3': 'punctuation'
      }
    },
    'variable variable-parameter': {
      pattern: /[\w$][\w\d_$]*/
    }
  });
  let ARROW_FUNCTIONS = new Grammar({
    'meta: single-parameter multiline arrow function': {
      pattern: /([\w$][\w\d$]*)(\s*)(=(?:>|&gt;))/,
      captures: {
        '1': ARROW_FUNCTION_PARAMETERS,
        '3': 'operator'
      }
    },
    'meta: arrow function with params in parentheses': {
      pattern: /(\([^)]+\))(\s*)(=(?:>|&gt;))/,
      captures: {
        '1': ARROW_FUNCTION_PARAMETERS,
        '3': 'operator'
      }
    },
    'single line arrow function': {
      pattern: /(\(?[^)]\)?|[a-zA-Z_$][a-zA-Z0-9_$]*)(\s*)(=(?:>|&gt;))(\s*)/,
      captures: {
        '1': ARROW_FUNCTION_PARAMETERS,
        '3': 'operator'
      }
    }
  });
  let VALUES$4 = new Grammar({});
  VALUES$4.extend({
    constant: {
      pattern: /\b(?:arguments|this|false|true|super|null|undefined)\b/
    },
    'number number-binary-or-octal': {
      pattern: /0[bo]\d+/
    },
    number: {
      pattern: /(?:\d*\.?\d+)/
    }
  });
  VALUES$4.extend(ARROW_FUNCTIONS);
  VALUES$4.extend(STRINGS$3);
  VALUES$4.extend({
    comment: {
      pattern: /(\/\/[^\n]*\n)|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
    },
    regexp: {
      // No such thing as an empty regex, so we can get away with requiring at
      // least one not-backslash character before the end delimiter.
      pattern: /(\/)(.*?[^\\])(\/)([mgiy]*)/,
      captures: {
        '2': REGEX_INTERNALS$1,
        '4': 'keyword regexp-flags'
      },
      wrapReplacement: true
    }
  });
  let DESTRUCTURING = new Grammar({
    alias: {
      pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,
      captures: {
        '1': 'entity'
      }
    },
    variable: {
      pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
    },
    operator: {
      pattern: /=/
    }
  });
  let IMPORT_SPECIFIERS = new Grammar('import specifiers', {
    ordinary: {
      pattern: /(^|,)([\s\n]*)([A-Za-z_$][A-Za-z_$0-9]*)(\s*)(?=$|,)/,
      captures: {
        '1': 'punctuation',
        '3': 'variable variable-import'
      }
    },
    'default as': {
      pattern: /(^|,)([\s\n]*)(default)(\s*)(as)(\s*)([\w$][\w\d$]*)(\s*)(?=$|,)/,
      captures: {
        '1': 'punctuation',
        '3': 'keyword keyword-default',
        '5': 'keyword keyword-as',
        '7': 'variable variable-import'
      }
    },
    'foo as bar': {
      pattern: /(^|,)([\s\n]*)([\w$][\w\d$]*)(\s+)(as)(\s+)([\w$][\w\d$]*)(\s*)(?=$|,)/,
      captures: {
        '1': 'punctuation',
        '3': 'variable variable-import',
        '5': 'keyword keyword-as',
        '7': 'variable variable-import'
      }
    }
  });
  let IMPORT_SPECIFIER = new Grammar('import specifier', {
    'implicit default specifier': {
      pattern: /^(\s*)([A-Za-z_$][A-Za-z_$0-9]*)(\s*)(?=,|$)/,
      captures: {
        '2': 'variable variable-import'
      }
    },
    specifiers: {
      pattern: /(\{)(\s*)([^}]+)(})/,
      captures: {
        '3': IMPORT_SPECIFIERS
      }
    }
  });
  let IMPORTS = new Grammar({
    'import with destructuring': {
      pattern: /(^\s*)(import)(\s*)(?=\{)([\s\S]*?)(\s*)(from)(\s*)(.*?)(?=;|\n)/,
      captures: {
        '2': 'keyword keyword-import',
        '4': IMPORT_SPECIFIER,
        '6': 'keyword keyword-from',
        '8': STRINGS$3
      }
    },
    'import with source': {
      pattern: /(^\s*)(import)(\s*)(.*?)(\s*)(from)(\s*)(.*?)(?=;|\n)/,
      captures: {
        '2': 'keyword keyword-import',
        '4': () => IMPORT_SPECIFIER,
        '6': 'keyword keyword-from',
        '8': () => STRINGS$3
      }
    },
    'import without source': {
      pattern: /(^\s*)(import)(\s*)(?=\`|'|")(.*?)(?=;|\n)/,
      captures: {
        '2': 'keyword keyword-import',
        '4': () => STRINGS$3
      }
    }
  });
  let EXPORT_SPECIFIERS = new Grammar('export specifiers', {
    ordinary: {
      pattern: /(^|,)(\s*)([A-Za-z_$][A-Za-z_$0-9]*)(\s*)(?=$|,)/,
      captures: {
        '1': 'punctuation',
        '3': 'variable variable-export'
      }
    },
    'as default': {
      pattern: /(^|,)(\s*)([\w$][\w\d$]*)(\s*)(as)(\s*)(default)(\s*)(?=$|,)/,
      captures: {
        '1': 'punctuation',
        '3': 'variable variable-export',
        '5': 'keyword keyword-as',
        '7': 'keyword keyword-default'
      }
    },
    'as [identifier]': {
      pattern: /(^|,)(\s*)([\w$][\w\d$]*)(\s*)(as)(\s*)([\w$][\w\d$]*)(\s*)(?=$|,)/,
      captures: {
        '1': 'punctuation',
        '3': 'variable variable-import',
        '5': 'keyword keyword-as',
        '7': 'variable variable-export'
      }
    }
  });
  let EXPORT_SPECIFIER = new Grammar('export specifier', {
    specifiers: {
      pattern: /(\{)(\s*)([^}]+)(})/,
      captures: {
        '3': EXPORT_SPECIFIERS
      }
    }
  });
  let EXPORTS = new Grammar('exports', {
    'export with destructuring': {
      pattern: /(^\s*)(export)(\s*)(?=\{)([\s\S]*?\s*\})/,
      captures: {
        '2': 'keyword keyword-export',
        '4': EXPORT_SPECIFIER
      }
    },
    'export default with identifier': {
      pattern: /(^\s*)(export)(\s+)(default)(\s+)([\w$][\w\d$]*)/,
      captures: {
        '2': 'keyword keyword-export',
        '4': 'keyword keyword-default',
        '6': 'variable variable-export'
      }
    },
    'export by itself or with default': {
      pattern: /(^\s*)(export)(\s+)(default)?(\s*)(?=let|const|var|function|\[|\{)/,
      captures: {
        '2': 'keyword keyword-export',
        '4': 'keyword keyword-default'
      }
    }
  });
  let OPERATORS$1 = new Grammar({
    'keyword operator': {
      pattern: /\|\||&&|&amp;&amp;|!==?|={1,3}|(?:>=|&gt;=)|(?:<=|&lt;=)|\+\+|\+|--|-|\*|[\*\+-\/]=|\.{3}|\b(?:instanceof|in|of)\b|!|void|\.|(?:>|&gt;)|(?:<|&lt;)/
    },
    // Ternary colons are very hard to distinguish from property-value-pair
    // colons. Punt on it! Don't highlight a colon or a question mark as ternary
    // operators unless they're flanked by spaces.
    'meta: ternary colon': {
      pattern: /(\s+)(\?|:)(\s+)/,
      captures: {
        2: 'keyword operator operator-ternary'
      }
    }
  });
  let JSX_EXPRESSIONS = new Grammar({});
  JSX_EXPRESSIONS.extend(JSX_TAGS);
  JSX_EXPRESSIONS.extend(VALUES$4);
  JSX_EXPRESSIONS.extend(ARROW_FUNCTIONS);
  JSX_EXPRESSIONS.extend(OPERATORS$1);
  let MAIN$4 = new Grammar('javascript-jsx', {}, {
    alias: ['react', 'javascript', 'js']
  });
  MAIN$4.extend(JSX_TAG_ROOT);
  MAIN$4.extend(IMPORTS);
  MAIN$4.extend(EXPORTS);
  MAIN$4.extend(VALUES$4);
  MAIN$4.extend({
    // TODO: Why did I need this?
    'meta: exclude digits in the middle of identifiers': {
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
    'meta: new keyword plus identifier': {
      pattern: /(new)(\s+)((?:[\w$][\w\d$]*\.)*)([\w$][\w\d$]*)(?=\()/,
      captures: {
        '1': 'keyword keyword-new',
        '3': () => OPERATORS$1,
        '4': 'entity-class'
      }
    },
    'meta: variable declaration': {
      pattern: /\b(var|let|const)(\s+)([\w$][\w\d$]*?)(\s*)(?=\s|=|;|,)/,
      captures: {
        '1': 'storage',
        '3': 'variable'
      }
    },
    'meta: variable assignment': {
      // This rule could accidentally match the middle of a parameter list with
      // defaults, which is why we try to weed those out first with an earlier
      // rule.
      pattern: /(\s+|,)([A-Za-z_$][\w\d$]*?)(\s*)(?==)(?!=(?:>|&gt;))/,
      captures: {
        '2': 'variable'
      }
    },
    'meta: destructuring assignment': {
      pattern: /(let|var|const)(\s+)(\{|\[)([\s\S]*)(\}|\])(\s*)(=)/,
      index: text => {
        // TODO: Should this use a lexer approach? Might be more accurate, but
        // would be lots more code.
        let pairs = {
          '{': '}',
          '[': ']'
        };
        let match = /(let|var|const|)(\s+)(\{|\[)/.exec(text);
        let char = match[3],
            paired = pairs[char];
        let index = balance$3(text, paired, char); // Once we've balanced braces, find the next equals sign.

        let equals = text.indexOf('=', index);
        text.slice(0, equals + 1);
        return equals;
      },
      captures: {
        '1': 'storage',
        '4': DESTRUCTURING,
        '7': 'operator'
      }
    },
    'function function-expression': {
      pattern: /\b(function)(\s*)([a-zA-Z_$]\w*)?(\s*)(\()(.*?)(\))/,
      captures: {
        '1': 'keyword keyword-function',
        '3': 'entity',
        '5': 'punctuation',
        '6': PARAMETERS$3,
        '7': 'punctuation'
      }
    },
    'function function-literal-shorthand-style': {
      pattern: /(^\s*)(get|set|static)?(\s*)([\w$][\w\d$]*)(\s*)(\()(.*?)(\))(\s*)(?=\{)/,
      captures: {
        '2': 'storage',
        '4': 'entity',
        '6': 'punctuation',
        '7': PARAMETERS$3,
        '8': 'punctuation'
      }
    },
    'meta: function shorthand with computed property name': {
      pattern: /(])(\s*)(\()(.*?)(\))(\s*)(?=\{)/,
      captures: {
        '3': 'punctuation',
        '4': PARAMETERS$3,
        '5': 'punctuation',
        '7': 'punctuation'
      }
    },
    'function function-assigned-to-variable': {
      pattern: /\b([\w$][\w\d$]*)(\s*)(=)(\s*)(function)(\s*)(\()(.*?)(\))/,
      captures: {
        '1': 'variable',
        '3': 'operator',
        '5': 'keyword',
        '7': 'punctuation',
        '8': PARAMETERS$3,
        '9': 'punctuation'
      }
    },
    'meta: property then function': {
      pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(:)(\s*)(?=function)/,
      captures: {
        '1': 'entity',
        '2': 'punctuation'
      }
    },
    'entity': {
      pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(?=:)/
    },
    'meta: class definition': {
      pattern: /(class)(?:(\s+)([A-Z][A-Za-z0-9_]*))?(?:(\s+)(extends)(\s+)([A-Z][A-Za-z0-9_$\.]*))?(\s*)({)/,

      index(match) {
        return balance$3(match, '}', '{', {
          startIndex: match.indexOf('{') + 1
        });
      },

      captures: {
        '1': 'storage',
        '3': 'entity entity-class',
        '5': 'storage',
        '7': 'entity entity-class entity-superclass'
      }
    },
    storage: {
      pattern: /\b(?:var|let|const|class|extends|async|static)\b/
    },
    keyword: {
      pattern: /\b(?:try|catch|finally|if|else|do|while|for|break|continue|case|switch|default|return|yield|throw|await)\b/
    }
  }).extend(OPERATORS$1);

  const {
    balance: balance$2,
    wrap: wrap$2,
    compact: compact$3,
    VerboseRegExp: VerboseRegExp$3
  } = Utils;
  const STRINGS$2 = new Grammar({
    interpolation: {
      pattern: /\{(\d*)\}/
    },
    'escape escape-hex': {
      pattern: /\\x[0-9a-fA-F]{2}/
    },
    'escape escape-octal': {
      pattern: /\\[0-7]{3}/
    },
    escape: {
      pattern: /\\./
    }
  });
  const VALUES$3 = new Grammar({
    'lambda': {
      pattern: /(lambda)(\s+)(.*?)(:)/,
      captures: {
        '1': 'keyword storage',
        '3': () => PARAMETERS_WITHOUT_DEFAULT
      }
    },
    'string string-triple-quoted': {
      pattern: /"""[\s\S]*?"""/,
      before: (r, context) => {
        r[0] = STRINGS$2.parse(r[0], context);
      }
    },
    'string string-raw string-single-quoted': {
      pattern: /([urb]+)(')(.*?[^\\]|[^\\]*)(')/,
      replacement: "<span class='storage string'>#{1}</span><span class='#{name}'>#{2}#{3}#{4}</span>",
      captures: {
        '3': () => STRINGS$2
      }
    },
    'string string-single-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-apostrophes and non-backslashes OR
      // * a backslash plus exactly one of any character (including backslashes)
      pattern: /([ub])?(')((?:[^'\\]|\\.)*)(')/,
      replacement: "#{1}<span class='#{name}'>#{2}#{3}#{4}</span>",
      captures: {
        '1': 'storage string',
        '3': () => STRINGS$2
      }
    },
    'string string-double-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-quotes and non-backslashes OR
      // * a backslash plus exactly one of any character (including backslashes)
      pattern: /([ub])?(")((?:[^"\\]|\\.)*)(")/,
      replacement: "#{1}<span class='#{name}'>#{2}#{3}#{4}</span>",
      captures: {
        '1': 'storage string',
        '3': () => STRINGS$2
      }
    },
    constant: {
      pattern: /\b(self|None|True|False)\b/
    },
    // Initial declaration of a constant.
    'constant constant-assignment': {
      pattern: /^([A-Z][A-Za-z\d_]*)(\s*)(?=\=)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}"
    },
    // Usage of a constant after assignment.
    'constant constant-named': {
      pattern: /\b([A-Z_]+)(?!\.)\b/
    },
    'variable variable-assignment': {
      pattern: /([a-z_][[A-Za-z\d_]*)(\s*)(?=\=)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}"
    },
    number: {
      pattern: /(\b|-)((0(x|X)[0-9a-fA-F]+)|([0-9]+(\.[0-9]+)?))\b/
    },
    'number number-binary': {
      pattern: /0b[01]+/
    },
    'number number-octal': {
      pattern: /0o[0-7]+/
    }
  });
  const ARGUMENTS = new Grammar({
    'meta: parameter with default': {
      pattern: /(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*?)(?=,|$)/,
      captures: {
        '2': 'variable variable-parameter',
        '3': 'keyword punctuation',
        '4': VALUES$3
      }
    }
  }).extend(VALUES$3);
  const PARAMETERS_WITHOUT_DEFAULT = new Grammar({
    'meta: parameter': {
      pattern: /(\s*)(\*\*?)?([A-Za-z0-9_]+)(?=,|$)/,
      captures: {
        '2': 'keyword operator',
        '3': 'variable variable-parameter'
      }
    }
  });
  const PARAMETERS$2 = new Grammar({
    'meta: parameter with default': {
      pattern: /(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*?)(?=,|$)/,
      captures: {
        '2': 'variable variable-parameter',
        '3': 'keyword punctuation',
        '4': () => VALUES$3
      }
    }
  }).extend(PARAMETERS_WITHOUT_DEFAULT);
  const MAIN$3 = new Grammar('python', {
    'storage storage-type support': {
      pattern: /(int|float|bool|chr|str|bytes|list|dict|set)(?=\()/
    },
    'support support-builtin': {
      pattern: /(repr|round|print|input|len|min|max|sum|sorted|enumerate|zip|all|any|open)(?=\()/
    },
    'meta: from/import/as': {
      pattern: /(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(\s+)(as)(\s+)(.*?)(?=\n|$)/,
      captures: {
        '1': 'keyword',
        '5': 'keyword',
        '9': 'keyword'
      }
    },
    'meta: from/import': {
      pattern: /(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(?=\n|$)/,
      captures: {
        '1': 'keyword',
        '5': 'keyword'
      }
    },
    'meta: subclass': {
      pattern: /(class)(\s+)([\w\d_]+)(\()([\w\d_]*)(\))(\s*)(:)/,
      captures: {
        '1': 'keyword',
        '3': 'entity entity-class',
        '4': 'punctuation',
        '5': 'entity entity-class entity-superclass',
        '6': 'punctuation',
        '8': 'punctuation'
      }
    },
    'meta: class': {
      pattern: /(class)(\s+)([\w\d_]+)(:)/,
      captures: {
        '1': 'keyword',
        '3': 'entity entity-class',
        '4': 'punctuation'
      }
    },
    comment: {
      pattern: /#[^\n]*(?=\n)/
    },
    keyword: {
      pattern: /\b(?:if|else|elif|print|class|pass|from|import|raise|while|try|finally|except|return|global|nonlocal|for|in|del|with)\b/
    },
    'meta: method definition': {
      pattern: /(def)(\s+)([A-Za-z0-9_!?]+)(\s*)(\()(.*?)?(\))/,
      captures: {
        '1': 'keyword',
        '3': 'entity',
        '5': 'punctuation',
        '6': PARAMETERS$2,
        '7': 'punctuation'
      }
    },
    'meta: method invocation': {
      pattern: /([A-Za-z0-9_!?]+)(\s*)(\()(\s*)([\s\S]*)(\s*\))/,
      index: text => {
        return balance$2(text, ')', '(', text.indexOf('('));
      },
      captures: {
        '3': 'punctuation',
        '5': () => ARGUMENTS,
        '6': 'punctuation'
      }
    },
    'keyword operator operator-logical': {
      pattern: /\b(and|or|not)\b/
    },
    'keyword operator operator-bitwise': {
      pattern: /(?:&|\||~|\^|>>|<<)/
    },
    'keyword operator operator-assignment': {
      pattern: /=/
    },
    'keyword operator operator-comparison': {
      pattern: /(?:>=|<=|!=|==|>|<)/
    },
    'keyword operator operator-arithmetic': {
      pattern: /(?:\+=|\-=|=|\+|\-|%|\/\/|\/|\*\*|\*)/
    }
  });
  MAIN$3.extend(VALUES$3);

  const {
    balance: balance$1,
    compact: compact$2,
    VerboseRegExp: VerboseRegExp$2,
    wrap: wrap$1
  } = Utils;

  function includes(str, pattern) {
    return str.indexOf(pattern) > -1;
  }

  function hasOnlyLeftBrace(part) {
    return includes(part, '{') && !includes(part, '}');
  }

  function findEndOfHash(allParts, startIndex) {
    let parts = allParts.slice(startIndex); // Join the parts together so we can search one string to find the balanced
    // brace.

    let str = parts.join('');
    let index = balance$1(str, '}', '{', {
      stackDepth: 1
    });

    if (index === -1) {
      return;
    } // Loop through the parts until we figure out which part that balance brace
    // belongs to.


    let totalLength = 0;

    for (let i = startIndex; i < allParts.length; i++) {
      totalLength += allParts[i].length;

      if (totalLength >= index) {
        return i;
      }
    }
  }

  function rejoinHash(parts, startIndex, endIndex) {
    let result = [];

    for (let i = startIndex; i <= endIndex; i++) result.push(parts[i]);

    return result.join(',');
  } // Syntax is permissive enough in Ruby that it's quite hard to parse parameters
  // as a group. Much easier to try to split them and parse each one individually.


  function parseParameters(str, grammar, context) {
    if (!grammar) grammar = PARAMETERS$1;
    let rawParts = str.split(/,/),
        parameters = [];

    for (let i = 0, rawPart; i < rawParts.length; i++) {
      rawPart = rawParts[i];

      if (hasOnlyLeftBrace(rawPart)) {
        // We've split in the middle of a hash. Find the end of the hash and
        // rejoin.
        let endIndex = findEndOfHash(rawParts, i + 1);
        let rejoined = rejoinHash(rawParts, i, endIndex);
        parameters.push(rejoined);
        i = endIndex;
      } else {
        parameters.push(rawPart);
      }
    }

    return parameters.map(p => grammar.parse(p, context));
  }

  const PARAMETERS$1 = new Grammar({
    'meta: parameter with default': {
      pattern: /^(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*)/,
      captures: {
        '2': 'variable variable-parameter',
        '3': 'keyword operator',
        '4': () => VALUES$2
      }
    },
    'meta: variable': {
      pattern: /^(\s*)([A-Za-z0-9_]+)$/,
      captures: {
        '2': 'variable variable-parameter'
      }
    }
  }); // Block parameters get a separate grammar because they can't have defaults.

  const BLOCK_PARAMETERS = new Grammar({
    'meta: block variable': {
      pattern: /^(\s*)([A-Za-z0-9_]+)$/,
      captures: {
        '2': 'variable variable-parameter'
      }
    }
  }); // Values.
  // In other words, (nearly) anything that's valid on the right hand side of
  // an assignment operator.

  const VALUES$2 = new Grammar({
    'named constant': {
      // Technically, an identifier only needs an initial capital to be treated
      // as a constant, but in practice most constants use all-caps, and this way
      // we don't treat classes as constants.
      pattern: /\b([A-Z][A-Z0-9_]*)\b/,
      captures: {
        '1': 'constant'
      }
    },
    // Single-quoted strings are easy; they have no escapes _or_
    // interpolation.
    'string string-single-quoted': {
      pattern: /(')([^']*?)(')/
    },
    'string string-double-quoted': {
      pattern: /(")(.*?[^\\])(")/,
      wrapReplacement: true,
      captures: {
        '2': () => STRINGS$1
      }
    },
    // Probably could rewrite the above pattern to catch this, but this is
    // good enough for now.
    'string string-double-quoted empty': {
      pattern: /\"\"/
    },
    'string string-percent-q string-percent-q-braces': {
      pattern: /(%Q\{)([\s\S]*)(\})/,
      index: text => {
        return balance$1(text, '}', '{', {
          startIndex: text.indexOf('{')
        });
      },
      wrapReplacement: true,
      captures: {
        '2': () => STRINGS$1
      }
    },
    'string string-percent-q string-percent-q-parens': {
      pattern: /(%Q\()([\s\S]*)(\))/,
      index: text => {
        return balance$1(text, ')', '(', {
          startIndex: text.indexOf('(')
        });
      },
      wrapReplacement: true,
      captures: {
        '2': () => STRINGS$1
      }
    },
    'string string-percent-q string-percent-q-brackets': {
      pattern: /(%Q\[)([\s\S]*)(\])/,
      index: text => {
        return balance$1(text, ']', '[', {
          startIndex: text.indexOf('[')
        });
      },
      wrapReplacement: true,
      captures: {
        '2': () => STRINGS$1
      }
    },
    'string embedded string-shell-command': {
      pattern: /(`)([^`]*?)(`)/,
      wrapReplacement: true,
      captures: {
        '2': () => STRINGS$1
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
      wrapReplacement: true,
      captures: {
        '3': () => STRINGS$1
      }
    },
    regexp: {
      pattern: /(\/)(.*?)(\/)/,
      wrapReplacement: true,
      captures: {
        '2': () => REGEX_INTERNALS
      }
    },
    'variable variable-instance': {
      pattern: /(@)[a-zA-Z_][\w\d]*/
    },
    'variable variable-global': {
      pattern: /(\$)[a-zA-Z_][\w\d]*/
    },
    keyword: {
      pattern: /\b(begin|do|class|def|if|module|yield|then|else|for|until|unless|while|elsif|case|when|break|retry|redo|rescue|return|require|lambda)\b/
    }
  });
  const REGEX_INTERNALS = new Grammar({
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
  const STRINGS$1 = new Grammar({
    escape: {
      pattern: /\\./
    },
    interpolation: {
      pattern: /(#\{)(.*?)(\})/,
      captures: {
        '1': 'punctuation',
        '2': () => MAIN$2,
        '3': 'punctuation'
      },
      wrapReplacement: true
    }
  });
  const MAIN$2 = new Grammar('ruby', {
    'meta: method definition': {
      pattern: /(def)(\s+)([A-Za-z0-9_!?.]+)(?:\s*(\()(.*?)(\)))?/,
      captures: {
        '1': 'keyword',
        '3': 'entity'
      },
      before: (r, context) => {
        if (r[5]) r[5] = parseParameters(r[5], null, context);
      }
    },
    // For blocks, we don't try to capture the entire contents of the block in a
    // rule. But we mark where it starts and then push onto a stack in context so
    // we can keep track of where the block must end later on.
    'block block-braces': {
      pattern: /(\{)(\s*)(\|)([^|]*?)(\|)/,
      // pattern: /(\{)(\s*)(\|)([^|]*?)(\|)/,
      replacement: compact$2("\n      <b class='#{name}'>\n        <span class='punctuation'>#{1}</span>#{2}\n        <span class='punctuation'>#{3}</span>\n        #{4}\n        <span class='punctuation'>#{5}</span>\n    "),
      before: (r, context) => {
        // Keep a LIFO stack of block braces. When we encounter a brace that
        // we don't recognize later on, we'll pop the last scope off of the
        // stack and highlight it thusly.
        let stack = context.get('bracesStack', []);
        stack.push(r.name);
        r[4] = parseParameters(r[4], BLOCK_PARAMETERS, context);
      }
    },
    'block block-do-end': {
      pattern: /(do)(\s*)(\|)([^|]*?)(\|)/,
      replacement: compact$2("\n      <b class='#{name}'>\n        <span class='keyword keyword-do'>#{1}</span>#{2}\n        <span class='punctuation'>#{3}</span>\n        #{4}\n        <span class='punctuation'>#{5}</span>\n    "),
      before: (r, context) => {
        // Keep a LIFO stack of block braces. When we encounter a brace that
        // we don't recognize later on, we'll pop the last scope off of the
        // stack and highlight it thusly.
        let stack = context.get('bracesStack', []);
        stack.push(r.name);
        r[4] = parseParameters(r[4], null, context);
        r[6] = MAIN$2.parse(r[6], context);
      }
    },
    'meta: class definition with superclass': {
      pattern: /(class)(\s+)([A-Z][A-Za-z0-9_]*)(\s*(?:<|&lt;)\s*)([A-Z][A-Za-z0-9:_]*)/,
      replacement: compact$2("\n      <span class='keyword keyword-class'>#{1}</span>#{2}\n      <span class='entity entity-class'>#{3}</span>\n      <span class='punctuation'>#{4}</span>\n      <span class='entity entity-class entity-superclass'>#{5}</span>\n    ")
    },
    'meta: class or module definition': {
      pattern: /(class|module)(\s+)([A-Z][\w\d]*)(\s*)(?=$|\n)/,
      // pattern: /(class|module)(\s+)([A-Z][A-Za-z0-9_]*)\s*(?=$|\n)/,
      replacement: compact$2("\n      #{1}#{2}#{3}#{4}\n    "),

      before(m, context) {
        let classOrModule = m[1];
        m[1] = wrap$1(m[1], "keyword keyword-".concat(classOrModule));
        m[3] = wrap$1(m[3], "entity entity-".concat(classOrModule));
      }

    },
    'string heredoc-indented': {
      pattern: /(&lt;&lt;-|<<-)([_\w]+?)\b([\s\S]+?)(\2)/,
      replacement: compact$2("\n      <span class='#{name}'>\n        <span class='heredoc-begin'>#{1}#{2}</span>\n        #{3}\n        <span class='heredoc-end'>#{4}</span>\n      </span>\n    "),
      captures: {
        '3': () => STRINGS$1
      }
    },
    'keyword operator': {
      pattern: /(\+|-|\*|\/|>|&gt;|<|&lt;|=>|=&gt;|>>|&gt;&gt;|<<|&lt;&lt;|=~|\|\|=|==|=|\|\||&&|\+=|-=|\*=|\/=)/
    },
    'keyword keyword-special': {
      pattern: /\b(initialize|new|loop|extend|raise|attr|catch|throw|private|protected|public|module_function|attr_(?:reader|writer|accessor))\b/
    }
  });
  MAIN$2.extend(VALUES$2); // These need to be lowest possible priority, so we put them in after the
  // values grammar.

  MAIN$2.extend({
    comment: {
      pattern: /#[^\n]+/
    },
    'bracket-block-end': {
      pattern: /\}/,
      replacement: "#{0}",

      after(text, context) {
        let stack = context.get('bracesStack', []);
        let scope = stack.pop();
        if (!scope) return;
        return "".concat(text, "<!-- close ").concat(scope, " --></b>");
      }

    },
    'keyword keyword-block-end': {
      pattern: /\b(end)\b/,

      after(text, context) {
        let stack = context.get('bracesStack', []);
        let scope = stack.pop();
        if (!scope) return;
        return "".concat(text, "<!-- close ").concat(scope, " --></b>");
      }

    }
  });

  const {
    balance,
    compact: compact$1,
    VerboseRegExp: VerboseRegExp$1
  } = Utils;

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
        '3': () => VALUES$1,
        '4': 'punctuation'
      }
    },
    'support support-function-call support-function-call-sass': {
      pattern: /(red|green|blue|mix|hue|saturation|lightness|adjust-hue|lighten|darken|saturate|desaturate|grayscale|complement|invert|alpha|opacity|opacify|transparentize|fade-in|fade-out|selector-(?:nest|replace)|unquote|quote|str-(?:length|insert|index|slice)|to-(?:upper|lower)-case|percentage|round|ceil|floor|abs|min|max|random|(?:feature|variable|global-variable|mixin)-exists|inspect|type-of|unit|unitless|comparable|call|if|unique-id)(\()(.*)(\))/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
      captures: {
        '2': 'punctuation',
        '3': () => VALUES$1,
        '4': 'punctuation'
      }
    },
    'support support-function-call support-function-call-url': {
      pattern: /(url)(\()(.*)(\))/,
      index: match => {
        console.log('wtf');
        return balance(match, ')', '(', {
          startIndex: match.indexOf('(')
        });
      },
      replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
      before: (r, context) => {
        // The sole argument to `url` can be a quoted string or an unquoted
        // string. Apply interpolations either way.
        let transformed = INSIDE_URL_FUNCTION.parse(r[3], context);

        if (!/^('|")/.test(r[3])) {
          transformed = INTERPOLATIONS.parse(r[3], context);
          transformed = "<span class='string string-unquoted'>".concat(transformed, "</span>");
        }

        r[3] = transformed;
      }
    },
    'support support-function-call support-function-call-custom': {
      pattern: /([A-Za-z_-][A-Za-z0-9_-]*)(\()(.*)(\))/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
      captures: {
        '2': 'punctuation',
        '3': () => VALUES$1,
        '4': 'punctuation'
      }
    }
  });
  const INTERPOLATIONS = new Grammar({
    interpolation: {
      pattern: /(\#\{)(.*?)(})/,
      captures: {
        '1': 'punctuation interpolation-begin',
        '2': () => VALUES$1,
        '3': 'punctuation interpolation-end'
      },
      wrapReplacement: true
    }
  });

  function variableRuleNamed(name) {
    return new Grammar({
      [name]: {
        pattern: /\$[A-Za-z0-9_-]+/
      }
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
        '5': () => VALUES$1
      }
    }
  }).extend(VARIABLE);
  const PARAMETERS = new Grammar({
    'meta: parameter with default': {
      pattern: /(\$[\w\-][\w\d\-]*)(\s*)(:)(\s*)(.*?)(?=,|\),\n)/,
      captures: {
        '1': 'variable variable-parameter',
        '3': 'punctuation',
        '5': () => VALUES$1
      } // pattern: /(\$[A-Za-z][A-Za-z0-9_-]*)(\s*:\s*)(.*?)(?=,|\)|\n)/,
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
  }).extend(variableRuleNamed('variable variable-parameter'));
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
      replacement: compact$1("\n      <span class='#{name}'>\n        #{1}\n        <span class='parameter'>#{2}</span>\n        #{3}\n      </span>\n    "),
      captures: {
        '2': () => SELECTORS
      }
    },
    'meta: BEM self-reference pattern': {
      pattern: /(&amp;)((?:__|--)(?:[\w\d\-]+)?)/,
      captures: {
        '1': 'selector selector-self-reference-bem-style selector-element',
        '2': 'selector selector-class selector-self-reference-bem-style'
      } // pattern: /(?:&amp;|&)(?:__|--)(?:[A-Za-z0-9_-]+)?/,

    },
    'selector selector-interpolation embedded': {
      pattern: /(#\{)(.*)(\})/,
      index: match => {
        return balance(match, '}', '{', {
          startIndex: match.indexOf('{')
        });
      },
      wrapReplacement: true,
      captures: {
        '2': () => VALUES$1
      }
    },
    'selector selector-self-reference': {
      pattern: /(?:&amp;|&)/
    },
    'selector selector-pseudo selector-pseudo-with-args': {
      pattern: /((?:\:+)\b(?:lang|nth-(?:last-)?child|nth-(?:last-)?of-type))(\()(.*)(\))/,
      wrapReplacement: true,
      captures: {
        '3': () => VALUES$1
      }
    },
    'selector selector-pseudo selector-pseudo-without-args': {
      pattern: /(:{1,2})(link|visited|hover|active|focus|targetdisabled|enabled|checked|indeterminate|root|first-child|last-child|first-of-type|last-of-type|only-child|only-of-type|empty|valid|invalid)/
    },
    'selector selector-pseudo selector-pseudo-element': {
      pattern: /(:{1,2})(-(?:webkit|moz|ms)-)?\b(after|before|first-letter|first-line|selection|any-link|local-link|(?:input-)?placeholder|focus-inner|matches|nth-match|column|nth-column)\b/
    },
    'selector selector-attribute': {
      pattern: /(\[)([A-Za-z_-][A-Za-z0-9_-]*)(?:([~\.$^]?=)((['"])(?:.*?)(?:\5)|[^\s\]]))?(\])/,
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
        '3': () => VALUES$1
      }
    }
  }); // Split out because it's the one operator that gets used in @media and
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
  const VALUES$1 = new Grammar({
    // An arbitrary grouping of parentheses could also be a list, among other
    // things. But we don't need to apply special highlighting to lists;
    // their values will get highlighted.
    'meta: possible map': {
      pattern: /(\()([\s\S]+)(\))/,
      replacement: "#{1}#{2}#{3}",
      before: (r, context) => {
        let mapPattern = /[A-Za-z_-][A-Za-z0-9_-]*:.*(?:,|\)|$)/;
        let grammar = VALUES$1;

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
      pattern: /([\+|\-]?(?:\s*)?(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+))(\s*)((?:ch|cm|deg|dpi|dpcm|dppx|em|ex|grad|in|mm|ms|pc|pt|px|rad|rem|turn|s|vh|vmin|vw)\b|%)/,
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
      pattern: /(')([^']*?)(')/,
      wrapReplacement: true,
      captures: {
        '2': INTERPOLATIONS
      }
    },
    'string double-quoted': {
      pattern: /(")(.*?[^\\])(")/,
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
  VALUES$1.extend(FUNCTIONS, STRINGS, COLORS, NUMBERS, DIRECTIVES, {
    'support': {
      pattern: /\b([\w-]+)\b/
    }
  });
  const COMMENTS = new Grammar({
    'comment comment-line': {
      pattern: /(?:\s*)\/\/(?:.*?)(?=\n)/
    },
    'comment comment-block': {
      pattern: /(?:\s*)(\/\*)([\s\S]*)(\*\/)/
    }
  });
  const PROPERTIES = new Grammar({
    'meta: property pair': {
      pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(;)/,
      captures: {
        '1': 'property',
        '3': () => VALUES$1
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
  const INSIDE_AT_RULE_IF = new Grammar({}).extend(FUNCTIONS, OPERATORS, VALUES$1);
  const INSIDE_AT_RULE_INCLUDE = new Grammar({}).extend(PARAMETERS, VALUES$1, {
    'string string-unquoted': {
      pattern: /\b\w+\b/
    }
  });
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
        '1': () => VALUES$1
      }
    }
  }).extend(PROPERTIES);
  const INSIDE_AT_RULE_SUPPORTS = new Grammar({
    'meta: property pair': {
      pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(?=\)|$)/,
      replacement: "<span class=\"property\">#{1}</span>#{2}#{3}#{4}",
      captures: {
        '1': 'property',
        '2': 'punctuation',
        '3': () => VALUES$1
      }
    }
  }).extend(OPERATOR_LOGICAL);
  const MEDIA_AT_RULE_PROP_PAIR = new Grammar({
    'meta: property pair': {
      pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(?=\)|$)/,
      captures: {
        '1': 'property',
        '3': () => VALUES$1
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
      index: match => {
        return balance(match, '}', '{', {
          startIndex: match.indexOf('{')
        });
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
        '4': () => VALUES$1
      }
    },
    'keyword keyword-at-rule keyword-at-rule-for': {
      pattern: /(@for)(.*)\b(from)\b(.*)(through)(.*)({)/,
      replacement: compact$1("\n      <span class='#{name}'>#{1}</span>\n      #{2}#{3}#{4}#{5}#{6}#{7}\n    "),
      captures: {
        '2': () => VARIABLES,
        '3': 'keyword',
        '4': () => VALUES$1,
        '5': 'keyword',
        '6': () => VALUES$1
      }
    },
    'keyword keyword-at-rule keyword-at-rule-mixin': {
      pattern: /(@mixin)(\s+)([A-Za-z-][A-Za-z0-9\-_]+)(?:(\s*\())?(.*)(?={)/,
      replacement: compact$1("\n      <span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}\n    "),
      captures: {
        '3': 'function',
        '5': PARAMETERS
      }
    },
    'keyword keyword-at-rule keyword-at-rule-function': {
      pattern: /(@function)(\s+)([A-Za-z-][A-Za-z0-9\-_]+)(?:(\s*\())?(.*)(?={)/,
      replacement: compact$1("\n      <span class='#{name}'>#{1}</span>\n      #{2}#{3}#{4}#{5}\n    "),
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

        if (/!optional$/.test(r[3])) {
          r[3] = r[3].replace(/(!optional)$/, "<span class='keyword keyword-directive'>$1</span>");
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
        if (!r[3]) {
          r[4] = '';
        }
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
        '3': () => VALUES$1
      }
    }
  });
  const MAIN$1 = new Grammar('scss', {});
  MAIN$1.extend(FUNCTIONS, VARIABLES, AT_RULES);
  MAIN$1.extend({
    'meta: selector line': {
      pattern: /(^\s*)((?:[>\+~]|\.|\#|\[|(?:&|&amp;)|%|\*|(?:a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|eventsource|fieldset|figure|figcaption|footer|form|frame|frameset|(?:h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|svg|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\b).*)(,|\{)/,
      index: match => {
        let endIndex = findFirstThatIsNotPrecededBy('{', '#', match, 0);
        return endIndex;
      },
      // TODO: interpolations?
      captures: {
        '2': SELECTORS
      }
    }
  });
  MAIN$1.extend(PROPERTIES, COMMENTS);

  const {
    wrap,
    VerboseRegExp
  } = Utils;
  const INSIDE_STRINGS$1 = new Grammar({
    variable: {
      pattern: /(\$[\d\w_\-]+)\b|(\$\{[\d\w_\-]+\})/
    }
  });
  const INSIDE_SHELL_COMMANDS = new Grammar({
    variable: {
      pattern: /(\$[\w_\-]+)\b/
    }
  });
  const MAIN = new Grammar('shell', {
    comment: {
      pattern: /#[^\n]*(?=\n|$)/
    },
    string: {
      pattern: /(?:'[^']*'|"[^"]*")/,
      before: (r, context) => {
        r[0] = INSIDE_STRINGS$1.parse(r[0], context);
      }
    },
    function: {
      pattern: /(\w[\w\d_\-]+)(?=\()/
    },
    'meta: function definition': {
      pattern: /\b(function)(\s+)([a-zA-Z_$-]\w*)(\s*)(?={)/,
      replacement: "<span class=\"keyword keyword-function\">#{1}</span>#{2}<span class=\"entity\">#{3}</span>#{4}"
    },
    'shell-command shell-command-backticks': {
      pattern: /(`)([^`]*)(`)/,
      replacement: "<span class=\"interpolation\"><span class=\"punctuation\">#{1}</span><span class=\"interpolation-contents\">#{2}</span><span class=\"punctuation\">#{3}</span></span>",
      before: (r, context) => {
        r[2] = INSIDE_SHELL_COMMANDS.parse(r[2], context);
      }
    },
    'shell-command': {
      pattern: /(\$\()(.*?)(\))/,
      replacement: "<span class=\"interpolation\"><span class=\"punctuation\">#{1}</span><span class=\"interpolation-contents\">#{2}</span><span class=\"punctuation\">#{3}</span></span>",
      before: (r, context) => {
        r[2] = INSIDE_SHELL_COMMANDS.parse(r[2], context);
      }
    },
    'support support-builtin': {
      pattern: /\b(?:sudo|chmod|cd|mkdir|ls|cat|echo|touch|mv|cp|rm|ln|sed|awk|tr|xargs|yes|pbcopy|pbpaste|trap)\b/
    },
    'support support-other': {
      pattern: /\b(?:ruby|gem|rake|python|pip|easy_install|node|npm|php|perl|bash|sh|zsh|gcc|go|mate|subl|atom|nano|pico)(?=\s)/
    },
    // Special-case IPs before we handle floats.
    'meta: handle ip address': {
      pattern: /\b([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\b/,
      replacement: "#{1}.#{2}.#{3}.#{4}",
      before: (r, context) => {
        for (let i = 1; i <= 4; i++) {
          r[i] = wrap(r[i], 'number');
        }
      }
    },
    number: {
      pattern: /\b(?:[0-9]+(\.[0-9]+)?)\b/
    },
    constant: {
      pattern: /\b(?:false|true|SIGTERM|SIGINT|SIGKILL)\b/
    },
    'constant constant-home': {
      pattern: /(^|\s*|\n)~(?=\b|\/)/
    },
    keyword: {
      pattern: /\b(?:if|fi|case|esac|for|do|else|then|while|exit|done|shift)\b/
    },
    operator: {
      pattern: />|&gt;|&amp;&amp;|&amp;|&&|&/
    },
    variable: {
      pattern: /(\$[\w_\-]+)\b/
    },
    'meta: subshell with $() notation': {
      pattern: /\b(\$\()(.*?)(\))/,
      replacement: "<span class=\"interpolation\"><span class=\"punctuation\">#{1}</span><span class=\"interpolation-contents\">#{2}</span><span class=\"punctuation\">#{3}</span></span>",
      before: (r, context) => {
        r[2] = MAIN.parse(r[2], context);
      }
    },
    'variable-assignment': {
      pattern: /([A-Za-z_][A-Za-z0-9_]*)(=)/,
      replacement: "<span class='variable'>#{1}</span><span class='operator'>#{2}</span>"
    },
    'variable variable-in-braces': {
      pattern: /\$\{.+?}(?=\n|\b)/
    }
  }, {
    alias: ['bash']
  });

  const {
    compact
  } = Utils;
  const INSIDE_STRINGS = new Grammar({
    variable: {
      pattern: /(\$[\d\w_\-]+)\b/
    }
  });
  const VALUES = new Grammar({
    'meta: unquoted IP address string': {
      pattern: /(\s|^)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\:\d+)?)/,
      captures: {
        '2': 'string string-unquoted string-ip-address'
      }
    },
    'string string-unquoted string-url': {
      pattern: /\bhttps?:\/\/.*?(?=;|\s|$)/
    },
    'meta: unquoted path string': {
      pattern: /(\s+|^)((?:[A-Za-z0-9_\-]+)?\/(?:\\\s|.)+?(?=\s|$))/,
      // pattern: VerboseRegExp`
      //   (\s+|^) # preceding space or beginning of line
      //   (
      //     (?:[A-Za-z0-9_\-]+)? # possible name before first slash, if a relative path
      //     \/            # leading path separator
      //     (?:\\\s|.)+?    # any characters other than spaces, but allowing escaped spaces
      //     (?=\s|$)      # space or end of string
      //   )
      // `,
      captures: {
        '2': 'string string-unquoted string-path'
      }
    },
    'meta: number': {
      pattern: /(\s|^)(\d[\d\.]*)/,
      captures: {
        '2': 'number number-integer'
      }
    },
    'meta: string': {
      pattern: /((?:^|[^\\])(?:\\\\)*)("(?:[^"\\]|\\.|\n)*"|'(?:[^'\\]|\\.|\n)*')/,

      // pattern: VerboseRegExp`
      //   (                 # group 1: whitespace or control characters
      //     (?:^|[^\\])
      //     (?:\\\\)*
      //   )
      //   (                 # group 2: entire string
      //     "            # group 3: leading punctuation
      //     (?:[^"\\]|\\.|\n)*
      //     "            # group 4: trailing punctuation
      //     |
      //     '            # group 5: leading punctuation
      //     (?:[^'\\]|\\.|\n)*
      //     '             # group 6: trailing punctuation
      //   )
      // `,
      before(r) {
        r[2] = handleString(r[2]);
      },

      replacement: "#{1}#{2}"
    },
    'variable': {
      pattern: /\$[A-Za-z_][A-Za-z0-9_]*/
    },
    'meta: boolean': {
      pattern: /(\s)(off|on)(?!\S)/,
      captures: {
        '2': 'constant constant-boolean'
      }
    }
  });

  function handleString(str) {
    let punct = str.charAt(0);
    let contents = INSIDE_STRINGS.parse(str.slice(1, -1));
    return compact("\n    <span class=\"string string-quoted\">\n      <span class=\"punctuation\">".concat(punct, "</span>\n      ").concat(contents, "\n      <span class=\"punctuation\">").concat(punct, "</span>\n    </span>\n  "));
  }

  const INSIDE_DIRECTIVES = new Grammar({}).extend(VALUES).extend({
    'entity entity-function-with-block': {
      pattern: /^(?:server|location|events|http|upstream|types)(?!\S)/
    },
    'support support-function': {
      pattern: /^\S+/
    }
  });
  new Grammar('nginx', {
    'comment comment-line': {
      pattern: /(^|[\s{};])#.*$/
    },
    'meta: directive': {
      pattern: /(^|\s)(\w(?:[^;{}"'\\\s]|\\.|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\s+(?:\#.*(?!.)|(?![\#\s])))*?)(?=\s*[;{])/,
      // pattern: VerboseRegExp`
      //   (^|\s)
      //   (
      //     \w(?:
      //       [^;{}"'\\\s]|
      //       \\.|
      //       "(?:
      //         [^"\\]|
      //         \\.
      //       )*"|
      //       '(?:
      //         [^'\\]|
      //         \\.
      //       )*'|
      //       \s+(?:
      //         \#.*(?!.)|
      //         (?![\#\s])
      //       )
      //     )*?
      //   )
      //   (?=\s*[;{])
      // `,
      // before: (r) => {
      //   console.debug('directive parsing', r[2]);
      //   r[2] = INSIDE_DIRECTIVES.parse(r[2]);
      //   console.debug('directive now:', r[2]);
      // }
      captures: {
        '2': INSIDE_DIRECTIVES
      }
    }
  });

  /* eslint-env worker */
  const LOGGER = new Logger('worker');

  function postError(error) {
    postMessage({
      error
    });
  }

  function parseLanguage(text, language, context) {
    let grammar = Grammar.find(language);

    if (!grammar) {
      throw new Error("No such grammar: ".concat(language));
    }

    return grammar.parse(text, context);
  }

  onmessage = function onmessage(event) {
    LOGGER.log('Message:', event);
    let {
      type
    } = event.data;

    switch (type) {
      case 'parse':
        {
          let {
            language,
            text,
            id
          } = event.data;
          let grammar = Grammar.find(language);

          if (!grammar) {
            postError("No such grammar: ".concat(language));
            console.error("No such grammar: ".concat(language));
            return;
          }

          let context = new Context({
            highlighter: {
              parse: parseLanguage
            }
          });
          let source = grammar.parse(text, context);
          postMessage({
            id,
            language,
            source
          });
          break;
        }
    }
  };

}));
