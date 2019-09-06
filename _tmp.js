

/**
 * Finds the index of the first _balanced_ `right` occurence of `right` in
 * `source`.
 *
 * Encountering `left` increases the depth; encountering `right` decreases it.
 * The depth starts out at zero (or at `options.startDepth`); when it returns
 * to zero, the index is returned.
 *
 * The option `startIndex` begins the search at some position of the string
 * other than the beginning.
 *
 * The option `startDepth` begins the depth somewhere other than zero.
 *
 * The option `considerEscapes` will ignore either `left` or `right` if it
 * follows a backslash.
 *
 * @param   {String} source Source text.
 * @param   {String} left The character that increases the depth.
 * @param   {String} right The character that decreases the depth, and for
 *   which we are searching.
 * @param   {Object} [options={}] Options.
 * @returns {Number} The index of the character in question.
 */

function balancePairedCharacters (source, { left, right }, options = {}) {
  let {
    startIndex = 0,
    startDepth = 0,
    considerEscapes = true
  } = options;

  let lastCharacter;
  let rl = right.length;
  let ll = left.length;
  let sl = source.length;

  let depth = startDepth;

  // NOTE: We only return a result when the depth _returns_ to zero. If it
  // _starts_ at zero, we keep going until it increases by at least one and
  // then decreases back to zero.
  for (let i = startIndex; i < length; i++) {
    if (i > 0) { lastCharacter = source.slice(i - 1, i); }
    let isEscaped = considerEscapes ? (lastCharacter === '\\') : false;

    let rightCandidate = source.slice(i, i + rl);
    let leftCandidate = source.slice(i, i + ll);
    if (leftCandidate === left && !isEscaped) {
      depth++;
    }

    if (rightCandidate === right && !isEscaped) {
      depth--;
      // The characters are balanced. We're done.
      if (depth === 0) { return i; }
    }
  }

  return -1;
}

function getLastToken (results) {
  for (let i = results.length - 1; i >= 0; i--) {
    let token = results[i];
    if (typeof token === 'string') { continue; }
    if (Array.isArray(token.content)) {
      return getLastToken(token.content);
    }
    return token;
  }
  return null;
}

/**
 * Given a string of text and an instance of `Lexer`, runs the lexer against
 * the text until the lexer stops, and returns the index of the very last character
 * matched by the lexer.
 *
 * This approach is useful for balancing complex tokens.
 *
 * @param   {String} source Source text.
 * @param   {Lexer} lexer The lexer against which to run the text.
 * @returns {Number} The index of the final character matched by the lexer —
 *   i.e., the final character of the final token.
 */
function balanceByLexer (source, lexer) {
  let { tokens } = lexer.run(source);
  let lastToken = getLastToken(tokens);
  return lastToken.index + lastToken.content.length;
}

/**
 * Given a string that may contain characters that are meaningful in a RegExp,
 * escapes them so that they are safe to include when dynamically building a
 * RegExp.
 *
 * @param   {String} str The string to escape.
 * @returns {String} The escaped string.
 */
function escapeRegExpComponent (str) {
  return str.replace(
    /[-\/\\^$*+?.()|[\]{}]/g,
    '\\$&'
  );
}


/**
 * Given a multiline string, removes all newlines and all leading space on each
 * line.
 *
 * This allows us to define replacement strings more readably, using newlines
 * and indentation, and still have that whitespace stripped out so it doesn't
 * become meaningful in the replacement.
 *
 * @param   {String} str The string.
 * @returns {String} The compacted string.
 */
function compact (str) {
  str = str.replace(/^[\s\t]/mg, '');
  str = str.replace(/\n/g, '');
  return str;
}

/**
 * Given a string, wraps the string in a `span` with a given `class` attribute
 * value _if_ the string exists and is not empty. Otherwise returns an empty
 * string.
 *
 * @param   {String?} str       [description]
 * @param   {String} className [description]
 * @returns {String} HTML if the string exists; an empty string if it does not.
 */
function wrap (str, className) {
  if (!str) { return ''; }
  return `<span class="${className}">${str}</span>`;
}

function isEscapedHash (line, index) {
  if (index === 0) { return false; }
  return line.charAt(index - 1) === '\\';
}

function trimCommentsFromLine (line) {
  let hashIndex = -1;
  do {
    hashIndex = line.indexOf('#', hashIndex + 1);
  } while (hashIndex > -1 && isEscapedHash(line, hashIndex));

  if (hashIndex > -1) {
    line = line.substring(0, hashIndex);
  }
  return line.trim();
}


// A tagged template literal that allows you to define a verbose regular
// expression using backticks. Literal whitespace is ignored, and you can use
// `#` to mark comments. This makes long regular expressions way easier for
// humans to read and write.
//
// Escape sequences _do not_ need to be double-escaped, with one exception:
// capture group backreferences like \5 need to be written as \\5, because JS
// doesn't understand that syntax outside of a literal RegExp.
function VerboseRegExp (str) {
  let raw = str.raw[0];
  let pattern = raw.split(/\n/)
    .map(trimCommentsFromLine)
    .join('')
    .replace(/\s/g, '');

  // Take (e.g.) `\\5` and turn it into `\5`. An oversight in ES6 prevents
  // raw backreferences from working right in template strings.
  pattern = pattern.replace(/(\\)(\\)(\d+)/g, (m, _, bs, d) => {
    return `${bs}${d}`;
  });

  return new RegExp(pattern);
}

export {
  balancePairedCharacters,
  balanceByLexer,
  compact,
  escapeRegExpComponent,
  VerboseRegExp,
  wrap
};
