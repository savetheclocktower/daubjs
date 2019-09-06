import './_rollupPluginBabelHelpers-5ac5ebc9.js';

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

class Template {
  constructor(template, pattern) {
    this.template = String(template);
    this.pattern = pattern || Template.DEFAULT_PATTERN;
  }

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
// This file uses CommonJS so that we can import it from Node. `VerboseRegExp`s
// get transpiled to regular expression literals during builds in the interests
// of file size.
// Rollup should still do the right thing so that VerboseRegExp is available to
// custom grammars as a runtime import.
function _isEscapedHash(line, index) {
  return index === 0 ? false : line.charAt(index - 1) === '\\';
}

function _trimCommentsFromLine(line) {
  let hashIndex = -1;

  do {
    hashIndex = line.indexOf('#', hashIndex + 1);
  } while (hashIndex > -1 && _isEscapedHash(line, hashIndex));

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


function VerboseRegExp(str) {
  let raw = str.raw[0];
  let pattern = raw.split(/\n/).map(_trimCommentsFromLine).join('').replace(/\s/g, ''); // Take (e.g.) `\\5` and turn it into `\5`. For some reason we can't do
  // this with raw strings.

  pattern = pattern.replace(/(\\)(\\)(\d+)/g, (m, _, bs, d) => {
    return "".concat(bs).concat(d);
  });
  let result = new RegExp(pattern);
  return result;
}

var verboseRegexp = {
  VerboseRegExp
};
var verboseRegexp_1 = verboseRegexp.VerboseRegExp;

// string unit by unit. Whenever the `paired` token is encountered, the
// stack size increases by 1. When `token` is encountered, the stack size
// decreases by 1, and if the stack size is already 0, that's our desired
// token.

function balance(source, token, paired) {
  let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  options = Object.assign({
    startIndex: 0,
    stackDepth: 0,
    considerEscapes: true
  }, options);
  let lastChar;
  let {
    startIndex,
    stackDepth,
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
} // Given a multiline string, removes all space at the beginnings of lines.
// Lets us define replacement strings with indentation, yet have all that
// extraneous space stripped out before it gets into the replacement.


function compact(str) {
  str = str.replace(/^[\s\t]*/mg, '');
  str = str.replace(/\n/g, '');
  return str;
} // Wrap a string in a `span` with the given class name.


function wrap(str, className) {
  if (!str) {
    return '';
  }

  return "<span class=\"".concat(className, "\">").concat(str, "</span>");
} // function regexpEscape (str) {

function _getLastToken(results) {
  for (let i = results.length - 1; i >= 0; i--) {
    let token = results[i];

    if (typeof token === 'string') {
      continue;
    }

    if (Array.isArray(token.content)) {
      return _getLastToken(token.content);
    } else {
      return token;
    }
  }

  return null;
}

function balanceByLexer(text, lexer) {
  let results = lexer.run(text);

  let lastToken = _getLastToken(results.tokens);

  let index = lastToken.index + lastToken.content.length - 1;
  return index;
}

function flattenTokens(tokens) {
  let result = [];

  function f(tokens) {
    tokens.forEach(token => {
      result.push(token);

      if (Array.isArray(token.content)) {
        f(token.content);
      }
    });
  }

  f(tokens);
  return result;
}

var Utils = /*#__PURE__*/Object.freeze({
  balance: balance,
  balanceByLexer: balanceByLexer,
  compact: compact,
  escapeRegExp: escapeRegExp,
  flattenTokens: flattenTokens,
  gsub: gsub,
  regExpToString: regExpToString,
  wrap: wrap,
  VerboseRegExp: verboseRegexp_1
});

export { Template as T, Utils as U, balanceByLexer as a, balance as b, compact as c, escapeRegExp as e, flattenTokens as f, gsub as g, regExpToString as r, verboseRegexp_1 as v, wrap as w };
