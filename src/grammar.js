import { gsub, regExpToString, wrap } from './utils';
import Template from './template';

class ParseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ParseError';
  }
}

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

    this._originalRules = rules;

    this.extend(rules);
    if (this.name) {
      this.names.forEach(name => {
        Grammar.register(name, this);
      });
    }
  }

  _toObject () {
    return { ...this._originalRules };
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
              let err = new ParseError(`Bad "index" callback; requested substring did not match original rule.`);
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

        if (rule.captures) {
          for (let i = 0; i < replacements.length; i++) {
            if (!(i in rule.captures)) { continue; }
            let captureValue = rule.captures[i];
            if (typeof captureValue === 'function') {
              captureValue = captureValue();
            }
            if (typeof captureValue === 'string') {
              // A string capture just specifies the class name(s) this token
              // should have. We'll wrap it in a `span` tag.
              replacements[i] = wrap(replacements[i], captureValue);
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

const MAP = {};

Grammar.register = (name, grammar) => {
  MAP[name] = grammar;
};

Grammar.find = (name) => {
  return MAP[name] || null;
};

class Rule {
  constructor (name, rule, prevCaptures) {
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

    this.debug  = rule.debug;
    this.before = rule.before;
    this.after  = rule.after;
    this.index  = rule.index;
    this.captures = rule.captures;

    let originalPattern = rule.pattern;
    let pattern = rule.pattern;
    if (typeof pattern !== 'string') {
      pattern = regExpToString(pattern);
    }

    // Alter backreferences so that they point to the right thing. Yes,
    // this is ridiculous.
    pattern = pattern.replace(/\\(\d+)/g, (m, d) => {
      let group = Number(d);
      let newGroup = (prevCaptures + group + 1);
      // Adjust for the number of groups that already exist, plus the
      // surrounding set of parentheses.
      return `\\${newGroup}`;
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
  let captures = arr.join(`}#{`);
  captures = `#{${captures}}`;
  let contents = wrap ?
    `<span class="#{name}">${captures}</span>` :
    captures;
  return new Template(contents);
};

export {
  Grammar as default,
  Rule
};
