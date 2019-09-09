import Context from './context';

function resolve (value) {
  if (typeof value === 'function') { return value(); }
  return value;
}

function determineIfFinal (rule, context) {
  let final = rule.final;
  if (typeof final === 'boolean') { return final; }
  else if (typeof final === 'function') {
    return final(context);
  } else if (!final) {
    return false;
  } else {
    throw new TypeError(`Invalid value for rule.final!`);
  }
}

class LexerError extends Error {
  constructor (message) {
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
  constructor (name, content, index, lengthConsumed) {
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

    // “Length consumed” refers to the number of characters that have already
    // been processed in the original source string. All our indices should be
    // relative to this value.

    /**
     * The index of the original string at which this token matched.
     * @type {number}
     */
    this.index = lengthConsumed + index;
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
  constructor (rules, name = '') {
    this.rules = rules;
    // A lexer can optionally have a name; this is mainly for debugging
    // purposes.
    this.name = name;
  }

  /**
   * Add rules to the lexer.
   *
   * @param {Object[]} rules An array of rules. Each rule object must satisfy
   *   the “rule” contract.
   */
  addRules (rules) {
    this.rules.push(...rules);
  }

  // To iterate through a lexer is to iterate through its rules.
  [Symbol.iterator] () {
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
  run (text, context = null, { startIndex = 0 } = {}) {
    let isRoot = context === null;
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
          if (!result) { cMatch = null; }
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
          } else if (!match || (cMatch.index < match.index)) {
            // This is the match that has skipped the least text so far. But
            // keep going to see if we can find a better one.
            match = cMatch;
            rule = cRule;
          }
        }
      }

      if (!match) {
        // Failing to match anything will cause the Lexer to return and report its results.
        console.debug('No match!');
        // console.groupEnd();
        break;
      } else {
        console.debug('Match:', rule.name, match[0], match, rule);
        console.debug(' found at global index:', match.index + lengthConsumed);
      }

      let matchIndex = match.index;
      let newStartIndex = match.index + match[0].length;
      if (match.index > 0) {
        let skipped = text.slice(0, match.index);
        tokens.push(skipped);
        lengthConsumed += skipped.length;
        // Now that we've consumed all the skipped text, the match's index
        // should be reset to zero, as if that skipped text had already been
        // processed before the call to `exec`.
        matchIndex = 0;
      }
      text = text.slice(newStartIndex);

      // A rule with `final: true` will cause the lexer to stop parsing once
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

      if (rule.raw) {
        // Sometimes we write rules to match a string just to prevent it from
        // being matched by another rule. In these cases, we can use `raw:
        // true` to pass along the raw string rather than wrap it in a Token.
        tokens.push(match[0]);
        lengthConsumed += match[0].length;
      } else if ((rule.inside || rule.after) && !shouldSkipSubRules) {
        let lexerName, lexer, mode;
        // Often, when we encounter a certain pattern, we want to have a
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
        // item in its `content` array) or just _before_ that token.
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
          throw new LexerError(`Invalid lexer!`);
        }

        let initialToken = new Token(
          rule.name,
          match[0],
          matchIndex,
          lengthConsumed
        );

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
        console.debug('Lexer START', lexerName, 'at index:', subLexerStartIndex);

        // To ensure accurate `index` values on Tokens, we need to tell the
        // sub-lexer how much of the string we've already consumed.
        let lexerResult = lexer.run(text, context, { startIndex: subLexerStartIndex });

        console.debug('Lexer END', lexerName, 'consumed:', lexerResult.lengthConsumed);

        subTokens.push(...lexerResult.tokens);

        // Build the container token.
        let token = new Token(
          lexerName,
          subTokens,
          matchIndex,
          lengthConsumed
        );

        tokens.push(token);

        lengthConsumed = lexerResult.lengthConsumed;
        text = lexerResult.text;
      } else {
        let token = new Token(
          rule.name,
          match[0],
          matchIndex,
          lengthConsumed
        );
        tokens.push(token);
        lengthConsumed += match[0].length;
      }
      if (ruleIsFinal) {
        console.debug('Last rule! Done.');
        // console.groupEnd();
        break;
      }

      // If we get this far without having consumed any more of the string than
      // the last iteration, then we should consider ourselves to be done. This
      // is in place to prevent accidental infinite loops, though it does
      // prevent us from using patterns that end up consuming zero characters.
      // In the future I might want this to behave differently.
      if (text === lastText) {
        console.debug(`No further matches! Done.`);
        // console.groupEnd();
        break;
      }
      lastText = text;
      // console.groupEnd();
    } // end the gigantic `while` loop.

    // Lexer#run returns three values: an array of tokens, the leftover text
    // that could not be parsed (if any), and the number of characters that
    // were able to be parsed.
    return {
      tokens,
      text,
      lengthConsumed
    };
  }
}

export {
  Token,
  Lexer as default
};
