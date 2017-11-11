(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.utils = {})));
}(this, (function (exports) { 'use strict';

// Find the next "balanced" occurrence of the token. Searches through the
// string unit by unit. Whenever the `paired` token is encountered, the
// stack size increases by 1. When `token` is encountered, the stack size
// decreases by 1, and if the stack size is already 0, that's our desired
// token.
function balance(source, token, paired) {
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
function compact(str) {
  str = str.replace(/^[\s\t]*/mg, '');
  str = str.replace(/\n/g, '');
  return str;
}

// Wrap a string in a `span` with the given class name.
function wrap(str, className) {
  return '<span class="' + className + '">' + str + '</span>';
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
function VerboseRegExp(str) {
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

exports.balance = balance;
exports.compact = compact;
exports.wrap = wrap;
exports.VerboseRegExp = VerboseRegExp;

Object.defineProperty(exports, '__esModule', { value: true });

})));
