
// Coerces `null` and `undefined` to empty strings; uses default coercion on
// everything else.
function _interpretString (value) {
  return value == null ? '' : String(value);
}

function _regexpWithoutGlobalFlag (re) {
  let flags = re.flags.replace('g', '');
  return new RegExp( regExpToString(re) , flags);
}

function regExpToString (re) {
  let str = re.toString();
  str = str.replace(/^\//, '');
  str = str.replace(/\/[mgiy]*$/, '');
  return str;
}

function escapeRegExp (str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
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
    pattern = _regexpWithoutGlobalFlag(pattern);
  } else if (typeof pattern === 'string') {
    pattern = escapeRegExp(pattern);
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


/**
 * A class describing an abstract interpolation. Can later be supplied with data
 * to produce a string.
 *
 * @param {String} template A string describing an interpolation.
 */
class Template {
  constructor (template) {
    this.template = String(template);

    // Prototype's version allowed for this pattern to be customized, but that
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
        let comp = match[1].charAt(0) === '[' ?
          match[2].replace(/\\]/, ']') : match[1];
        ctx = ctx[comp];
        if (ctx == null || match[3] === '') { break; }
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

export {
  Template as default,
  escapeRegExp,
  gsub,
  regExpToString
};
