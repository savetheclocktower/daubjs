/* eslint-env commonjs */

// `VerboseRegExp`s get transpiled to regular expression literals during builds
// in the interests of file size.

// Rollup should still do the right thing so that VerboseRegExp is available to
// custom grammars as a runtime import.

function isEscapedHash (line, index) {
  return (index === 0) ? false : line.charAt(index - 1) === '\\';
}

function trimCommentsFromLine (line) {
  let hashIndex = -1;
  do { hashIndex = line.indexOf('#', hashIndex + 1); }
  while ( hashIndex > -1 && isEscapedHash(line, hashIndex) );

  if (hashIndex > -1) { line = line.substring(0, hashIndex); }
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
function VerboseRegExp (str) {
  let raw = str.raw[0];

  let pattern = raw.split(/\n/)
    .map(trimCommentsFromLine)
    .join('')
    .replace(/\s/g, '');

  // Take (e.g.) `\\5` and turn it into `\5`. Because of a spec bug, we can't
  // do this with raw strings.
  pattern = pattern.replace(/(\\)(\\)(\d+)/g, (m, _, bs, d) => {
    return `${bs}${d}`;
  });

  let result = new RegExp(pattern);
  return result;
}

export { VerboseRegExp };
