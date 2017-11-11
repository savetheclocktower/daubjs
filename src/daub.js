import * as Utils from './utils';

function _regexToString (re) {
  let str = re.toString();
  str = str.replace(/^\//, '');
  str = str.replace(/\/[mgiy]*$/, '');
  return str;
}

// Coerces `null` and `undefined` to empty strings; uses default coercion on
// everything else.
function _interpretString (value) {
  return value == null ? '' : String(value);
}

function _escapeRegex (str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

function _regexWithoutGlobalFlag (re) {
  let flags = re.flags.replace('g', '');
  return new RegExp( _regexToString(re) , flags);
}

// Like String#replace, but with some enhancements:
//
// * Understands Templates and Template-style strings.
// * Allows the handler to retroactively match _less_ than what it was
//   given, tossing the rest back into the queue for matching.
//
function gsub (source, pattern, replacement) {
  let result = '';

  if (typeof replacement !== 'function') {
    let template = new Template(replacement);
    replacement = (match) => template.evaluate(match);
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
    let origLength = source.length;
    let match = source.match(pattern);
    if (match) {
      let replaced = replacement(match, source);

      let newLength;
      if ( Array.isArray(replaced) ) {
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

class Context {
  constructor (options) {
    if (options.highlighter) {
      this.highlighter = options.highlighter;
    }
    this.storage = new Map();
  }

  set (key, value) {
    this.storage.set(key, value);
  }

  get (key, defaultValue) {
    if (!this.storage.has(key)) {
      this.storage.set(key, defaultValue);
      return defaultValue;
    }
    return this.storage.get(key);
  }
}

class Template {
  constructor (template, pattern) {
    this.template = String(template);
    this.pattern = pattern || Template.DEFAULT_PATTERN;
  }

  evaluate (object) {
    return gsub(this.template, this.pattern, (match) => {
      if (object == null) return '';

      let before = match[1] || '';
      if (before == '\\') return match[2];

      let ctx = object, expr = match[3];

      let pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;

      match = pattern.exec(expr);
      if (match == null) return before;

      while (match != null) {
        let comp = match[1].startsWith('[') ? match[2].gsub('\\\\]', ']') : match[1];
        ctx = ctx[comp];
        if (null == ctx || '' == match[3]) break;
        expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
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

class Highlighter {
  constructor (options = {}) {
    this.grammars = [];
    this._grammarTable = {};
    this.elements = [];
    this.options = Object.assign({}, Highlighter.DEFAULT_OPTIONS, options);
  }

  addElement (element) {
    if (this.elements.indexOf(element) > -1) { return; }
    this.elements.push(element);
  }

  addGrammar (grammar) {
    if (!grammar.name) {
      throw new Error(`Can't register a grammar without a name.'`);
    }
    if (this.grammars.indexOf(grammar) > -1) { return; }
    this.grammars.push(grammar);
    if (grammar.name) {
      this._grammarTable[grammar.name] = grammar;
    }
  }

  scan (node) {
    this.grammars.forEach((grammar) => {
      let selector = grammar.names
        .map((n) => {
          let cls = this.options.classPrefix + n;
          return `code.${cls}:not([data-highlighted])`;
        })
        .join(', ');

      let nodes = node.querySelectorAll(selector);
      nodes = Array.from(nodes);
      if (!nodes || !nodes.length) { return; }
      nodes.forEach((el) => {
        if ( el.hasAttribute('data-daub-highlighted') ) { return; }
        let context = new Context({ highlighter: this });
        let source = el.innerHTML;
        if (grammar.options.encode) {
          source = source.replace(/</g, '&lt;');
        }
        let parsed = this.parse(source, grammar, context);

        this._updateElement(el, parsed, grammar);
        el.setAttribute('data-daub-highlighted', 'true');

        let meta = { element: el, grammar };
        this._fire('highlighted', el, meta, { cancelable: false });
      });

    });
  }

  highlight () {
    this.elements.forEach( el => this.scan(el) );
  }

  _updateElement (element, text, grammar) {
    let doc = element.ownerDocument, range = doc.createRange();

    // Turn the string into a DOM fragment so that it can more easily be
    // acted on by plugins.
    let fragment = range.createContextualFragment(text);

    let meta = { element, grammar, fragment };
    let event = this._fire('will-highlight', element, meta);

    // Allow event handlers to cancel the highlight.
    if (event.defaultPrevented) { return; }

    // Allow event handlers to mutate the fragment.
    if (event.detail.fragment) { fragment = event.detail.fragment; }

    element.innerHTML = '';
    element.appendChild(fragment);
  }

  _fire (name, element, detail, opts = {}) {
    Object.assign(detail, { highlighter: this });

    let options = Object.assign(
      { bubbles: true, cancelable: true },
      opts,
      { detail }
    );

    let event = new CustomEvent(`daub-${name}`, options);

    element.dispatchEvent(event);
    return event;
  }

  parse (text, grammar = null, context = null) {
    if (typeof grammar === 'string') {
      // If the user passes a string and we can't find the grammar, we should
      // fail silently instead of throwing an error.
      grammar = this._grammarTable[grammar];
      if (!grammar) { return text; }
    } else if (!grammar) {
      throw new Error(`Must specify a grammar!`);
    }
    if (!context) { context = new Context({ highlighter: this }); }

    let parsed = grammar.parse(text, context);

    return parsed;
  }
}

Highlighter.DEFAULT_OPTIONS = { classPrefix: '' };

class Grammar {
  constructor (name, rules, options = {}) {
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

    this.extend(rules);
  }

  parse (text, context = null) {
    let pattern = this.pattern;
    pattern.lastIndex = 0;

    // eslint-disable-next-line
    console.debug(`Parsing ${this.name || ''}`, { pattern, text });

    if ( !pattern.test(text) ) { return text; }
    let parsed = gsub(text, pattern, (match, source) => {
      let i = 0, j = 1, rule, index, actualLength;
      // Find the rule that matched.
      while (rule = this.rules[i++]) {
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
              let err = new Error(`Bad "index" callback; requested substring did not match original rule.`);
              Object.assign(err, { rule, source, match, index: actualLength });
              throw err;
            }
          }
        }

        let replacements = [];
        for (let k = 0; k <= rule.length; k++) {
          replacements.push(match[j + k]);
        }

        replacements.name = rule.name;

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
      }

      // No matches, so let's return an empty string.
      return '';
    });

    return parsed;
  }

  _makeRules (rules, prevCaptures = 0) {
    let results = [];
    for (let ruleName in rules) {
      let rule = new Rule(ruleName, rules[ruleName], prevCaptures);
      results.push(rule);
      prevCaptures += rule.length;
    }

    return results;
  }

  match (className) {
    return this._classNamePattern.test(className);
  }

  extend (...grammars) {
    let grammar;
    if (grammars.length === 1) {
      grammar = grammars[0];
    } else {
      grammars.forEach((g) => this.extend(g));
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
      prevCaptures = this.rules
        .map((r) => r.length)
        .reduce((a, b) => a + b);
    }

    let rules = grammar;

    let instances = this._makeRules(rules, prevCaptures);
    this.rules.push(...instances);

    this.pattern = new RegExp(
      this.rules.map( (r) => r.pattern ).join('|'),
      this.options.ignoreCase ? 'mi' : 'm'
    );

    return this;
  }

  toObject () {
    let result = {};
    this.rules.forEach((r) => {
      result[r.name] = r.toObject();
    });
    return result;
  }
}

class Rule {
  constructor (name, rule, prevCaptures) {
    this.name = name;

    let r = rule.replacement;
    if (r) {
      this.replacement = r instanceof Template ? r : new Template(r);
    } else {
      this.replacement = Rule.DEFAULT_TEMPLATE;
    }

    this.debug  = rule.debug;
    this.before = rule.before;
    this.after  = rule.after;
    this.index  = rule.index;

    let pattern = rule.pattern;
    if (typeof pattern !== 'string') {
      pattern = _regexToString(pattern);
    }

    // Alter backreferences so that they point to the right thing. Yes,
    // this is ridiculous.
    pattern = pattern.replace(/\\(\d+)/g, (m, d) => {
      let group = Number(d);
      // Adjust for the number of groups that already exist, plus the
      // surrounding set of parentheses.
      return `\\${prevCaptures + group + 1}`;
    });

    // Count all open parentheses.
    let parens       = (pattern.match(/\(/g)   || '').length;
    // Subtract the ones that begin non-capturing groups.
    let nonCapturing = (pattern.match(/\(\?[:!=]/g)  || '').length;
    // Subtract the ones that are literal open-parens.
    let escaped      = (pattern.match(/\\\(/g) || '').length;
    // Add back the ones that match the literal pattern `\(?`, because they
    // were counted twice instead of once.
    let nonCapturingEscaped  = (pattern.match(/\\\(\?[:!=]/g) || '').length;

    let exceptions = ((nonCapturing + escaped) - nonCapturingEscaped);

    // Add one because we're about to surround the whole thing in a
    // capturing group.
    this.length = (parens + 1) - exceptions;
    this.pattern = `(${pattern})`;
  }

  toObject() {
    // Trim the enclosing parentheses from the pattern.
    let pattern = this.pattern.substring(
      1, this.pattern.length - 1);
    return {
      pattern: pattern,
      replacement: this.replacement,
      before: this.before,
      after: this.after,
      index: this.index
    };
  }
}

Rule.DEFAULT_TEMPLATE = new Template('<span class="#{name}">#{0}</span>');

export {
  Utils,
  Grammar,
  Highlighter
};
