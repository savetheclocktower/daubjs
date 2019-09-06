/* eslint-env node */
// import { VerboseRegExp } from '../src/utils';

const { VerboseRegExp } = require('../src/utils/verbose-regexp');

// A very small Babel plugin that invokes `VerboseRegExp` at compile time
// instead of at runtime. This is pretty silly, but it ends up saving me ~2k
// after gzipping.
//
// If it ever stops working for whatever reason, I can just disable it and
// fall back to runtime behavior.

function _isEscapedHash (line, index) {
  return (index === 0) ? false : line.charAt(index - 1) === '\\';
}

function _trimCommentsFromLine (line) {
  let hashIndex = -1;
  do { hashIndex = line.indexOf('#', hashIndex + 1); }
  while ( hashIndex > -1 && _isEscapedHash(line, hashIndex) );

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
// function VerboseRegExp (str, ...args) {
//   let raw = String.raw(str, ...args);
//
//   let pattern = raw.split(/\n/)
//     .map(_trimCommentsFromLine)
//     .join('')
//     .replace(/\s/g, '');
//
//   // Take (e.g.) `\\5` and turn it into `\5`. For some reason we can't do
//   // this with raw strings.
//   pattern = pattern.replace(/(\\)(\\)(\d+)/g, (m, _, bs, d) => {
//     return `${bs}${d}`;
//   });
//
//   let result = new RegExp(pattern);
//   return result;
// }

function isOurs (path) {
  if (!path || !path.node || !path.node.tag) { return false; }
  return path.node.tag.name === 'VerboseRegExp';
}

function verboseRegExpPlugin (babel) {
  return {
    name: 'verbose-regexp',
    visitor: {
      TaggedTemplateExpression (path, state) {
        if (!isOurs(path)) { return; }
        _handleReference(path, state, babel);
      }
    }
  };
}

function _handleReference (path, state, babel) {
  let { types } = babel;
  let { quasi } = path.node;

  if (quasi.expressions && quasi.expressions.length > 0) {
    throw new Error('VerboseRegExp macro doesn’t work with interpolations!');
  }

  let escapedTemplateString = quasi.quasis[0].value.raw;

  // Build the arguments that `VerboseRegExp` expects.
  let str = { raw: [escapedTemplateString] };

  let pattern = VerboseRegExp(str);

  // `RegExpLiteral` expects a string.
  pattern = pattern.toString();
  pattern = pattern.slice(1, -1);

  let quasiPath = path.get('quasi');
  quasiPath.parentPath.replaceWith(
    types.RegExpLiteral(pattern)
  );
}

module.exports = verboseRegExpPlugin;
// export default ;
