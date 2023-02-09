import { escapeRegExp, gsub, regExpToString } from './template.js';
import { VerboseRegExp } from './utils/verbose-regexp.js';

function inWebWorker () {
  // eslint-disable-next-line no-undef
  return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
}

function supportsCustomEvent () {
  return typeof CustomEvent !== 'undefined';
}

function isString (obj) {
  return typeof obj === 'string';
}

function wrapArray (obj) {
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
function balance(source, token, paired, options = {}) {
  options = Object.assign(
    { startIndex: 0, startDepth: 0, considerEscapes: true },
    options
  );

  let lastChar;
  let { startIndex, startDepth: depth, considerEscapes } = options;
  let tl = token.length;
  let pl = paired.length;
  let length = source.length;

  for (let i = startIndex; i < length; i++) {
    if (i > 0) { lastChar = source.slice(i - 1, i); }
    let escaped = considerEscapes ? (lastChar === '\\') : false;
    let candidate = source.slice(i, i + tl);
    let pairCandidate = source.slice(i, i + pl);

    if (pairCandidate === paired && !escaped) {
      depth++;
    }

    if (candidate === token && !escaped) {
      depth--;
      if (depth === 0) { return i; }
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
function compact (str) {
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
function wrap (str, className) {
  if (!str) { return ''; }
  return `<span class="${className}">${str}</span>`;
}

/**
 * Given a string of text and a lexer instance, returns the index at which the
 * lexer had its last match. Useful for balancing tokens that are more complex
 * than can be handled by the simpler `balance` function.
 *
 * @param {string} text The string.
 * @param {Lexer} lexer An instance of `Lexer`.
 * @param {Context} context The `Context` instance that was provided in the
 *   invoking grammar callback.
 * @returns {number} The index of the final character of the final token that
 *   was matched by the lexer.
 */
function balanceByLexer (text, lexer, context) {
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
  if (!inWebWorker() && supportsCustomEvent()) {
    let event = new CustomEvent('daub-lexer-time', { bubbles: true, detail: end - start });
    document.dispatchEvent(event);
  }
  return results.lengthConsumed - 1;
}

/**
 * Given a string of text and a lexer instance, returns both the index
 * reperesenting everything the lexer consumed and the serialized HTML
 * representation of the lexer tree.
 *
 * Experimental, but useful for preventing redundant lexer usage by
 * allowing the lexer itself to be in charge of highlighting for everything
 * it consumes.
 *
 * @param {string} text The string.
 * @param {Lexer} lexer An instance of `Lexer`.
 * @param {Context} context The `Context` instance that was provided in the
 *   invoking grammar callback.
 * @returns {Object} Object with properties `index` (the index of the final
 *   character of the final token that was matched by the lexer) and
 *   `highlighted` (the tokenized HTML serialization of the lexer tree).
 */
function balanceAndHighlightByLexer (text, lexer, context) {
  let start, end;
  start = performance.now();
  if (performance.mark) {
    performance.mark('daub-lexer-before');
  }
  let results = lexer.run(text, context, { highlight: true });
  end = performance.now();
  if (performance.mark) {
    performance.mark('daub-lexer-after');
    performance.measure('daub-lexer-before', 'daub-lexer-after');
  }
  if (!inWebWorker() && supportsCustomEvent()) {
    let event = new CustomEvent('daub-lexer-time', { bubbles: true, detail: end - start });
    document.dispatchEvent(event);
  }
  let highlighted = renderLexerTree(results);
  return {
    index: results.lengthConsumed - 1,
    highlighted
  };
}

/**
 * Converts all or part of a lexer's output back into the raw text that it
 * represents.
 *
 * @param {Array|Object} tokens The token or tokens that should be converted
 *  back to raw text. Can be an array or a single object.
 * @returns {string}
 */
function serializeLexerFragment (tokens) {
  let result = [];
  tokens = wrapArray(tokens);
  for (let t of tokens) {
    if (isString(t)) { result.push(t); }
    else if (t.content) {
      let serialized = serializeLexerFragment( wrapArray(t.content) );
      result.push(...serialized);
    }
  }
  return result.join('');
}


function flattenTree (tree) {
  let results = [];
  if (isString(tree)) { return [tree]; }
  if (tree.content) {
    if (isString(tree.content)) {
      results.push({
        name: tree.name,
        scopes: tree.scopes,
        content: tree.content
      });
    } else {
      if (tree.scopes) {
        results.push({ open: tree.scopes });
      }
      for (let t of wrapArray(tree.content)) {
        results.push(...flattenTree(t));
      }
      if (tree.scopes) {
        results.push({ close: tree.scopes });
      }
    }
  }
  return results;
}

/**
 * Given a lexer's output, serializes it into a string while retaining any
 * information marked as useful for syntax highlighting.
 * @param   {Object} obj A lexer tree, the result of `Lexer#run`.
 * @returns {string} HTML marked for syntax highlighting.
 */
function renderLexerTree (obj) {
  let flat = flattenTree(obj);
  return flat.map((t) => {
    let result;
    if (isString(t)) { return t; }
    if (t.open) {
      result = isString(t.open) ? `<span class="${t.open}">` : '';
    } else if (t.close) {
      result = isString(t.close) ? `</span>` : '';
    } else {
      let scopes = t.scopes || t.name;
      result = scopes ? `<span class="${scopes}">${t.content}</span>` : t.content;
    }
    return result;
  }).join('');
}

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  VerboseRegExp: VerboseRegExp,
  balance: balance,
  balanceAndHighlightByLexer: balanceAndHighlightByLexer,
  balanceByLexer: balanceByLexer,
  compact: compact,
  escapeRegExp: escapeRegExp,
  gsub: gsub,
  regExpToString: regExpToString,
  renderLexerTree: renderLexerTree,
  serializeLexerFragment: serializeLexerFragment,
  wrap: wrap
});

export { balanceAndHighlightByLexer as a, balance as b, compact as c, balanceByLexer as d, renderLexerTree as r, serializeLexerFragment as s, utils as u, wrap as w };
