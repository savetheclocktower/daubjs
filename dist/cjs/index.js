'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var shell = require('./shell-618902c9.js');

const {
  balance,
  compact,
  wrap,
  VerboseRegExp
} = shell.Utils; // TODO:
// * Generators

let ESCAPES = new shell.Grammar({
  escape: {
    pattern: /\\./
  }
});
let REGEX_INTERNALS = new shell.Grammar({
  escape: {
    pattern: /\\./
  },
  'exclude from group begin': {
    pattern: /(\\\()/,
    replacement: "#{1}"
  },
  'group-begin': {
    pattern: /(\()/,
    replacement: '<b class="group">#{1}'
  },
  'group-end': {
    pattern: /(\))/,
    replacement: '#{1}</b>'
  }
});

function handleParams(text, context) {
  return PARAMETERS.parse(text, context);
}

let INSIDE_TEMPLATE_STRINGS = new shell.Grammar({
  'interpolation': {
    pattern: /(\$\{)(.*?)(\})/,
    replacement: "<span class='#{name}'><span class='punctuation'>#{1}</span><span class='interpolation-contents'>#{2}</span><span class='punctuation'>#{3}</span></span>",
    before: (r, context) => {
      r[2] = MAIN.parse(r[2], context);
    }
  }
}).extend(ESCAPES);
const PARAMETERS = new shell.Grammar({
  'parameter parameter-with-default': {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,
    replacement: compact("\n      <span class=\"parameter\">\n        <span class=\"variable\">#{1}</span>\n        <span class=\"operator\">#{2}</span>\n      #{3}\n      </span>\n    "),
    before: (r, context) => {
      r[3] = VALUES.parse(r[3], context);
    }
  },
  'keyword operator': {
    pattern: /\.{3}/
  },
  'variable parameter': {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  }
});
let STRINGS = new shell.Grammar({
  'string string-template embedded': {
    pattern: /(`)([^`]*)(`)/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      r[2] = INSIDE_TEMPLATE_STRINGS.parse(r[2], context);
    }
  },
  'string string-single-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-apostrophes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-non-apostrophe pair.
    pattern: /(')((?:[^'\\]|\\\\|\\[^'])*)(')/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      r[2] = ESCAPES.parse(r[2], context);
    }
  },
  'string string-double-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-quotes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-non-quote pair.
    pattern: /(")((?:[^"\\]|\\\\|\\[^"])*)(")/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      r[2] = ESCAPES.parse(r[2], context);
    }
  }
});
let VALUES = new shell.Grammar(shell._objectSpread2({
  constant: {
    pattern: /\b(?:arguments|this|false|true|super|null|undefined)\b/
  },
  'number number-binary-or-octal': {
    pattern: /0[bo]\d+/
  },
  number: {
    pattern: /(?:\d*\.?\d+)/
  }
}, STRINGS.toObject(), {
  comment: {
    pattern: /(\/\/[^\n]*\n)|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
  },
  regexp: {
    // No such thing as an empty regex, so we can get away with requiring at
    // least one not-backslash character before the end delimiter.
    pattern: /(\/)(.*?[^\\])(\/)([mgiy]*)/,
    replacement: "<span class='regexp'>#{1}#{2}#{3}#{4}</span>",
    before: (r, context) => {
      r[2] = REGEX_INTERNALS.parse(r[2], context);
      if (r[4]) r[4] = wrap(r[4], 'keyword regexp-flags');
    }
  }
}));
let DESTRUCTURING = new shell.Grammar({
  alias: {
    pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,
    replacement: "<span class='entity'>#{1}</span>#{2}#{3}#{4}"
  },
  variable: {
    pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
  }
});
let MAIN = new shell.Grammar('javascript', {}, {
  alias: ['js']
});
MAIN.extend(VALUES);
MAIN.extend({
  'meta: digits in the middle of identifiers': {
    pattern: /\$\d/,
    replacement: "#{0}"
  },
  // So that properties with keyword names don't get treated like keywords.
  'meta: properties with keyword names': {
    pattern: /(\.)(for|if|while|switch|catch|return)\b/,
    replacement: "#{0}"
  },
  // So that keywords that are followed by `(` don't get treated like
  // functions.
  'meta: functions with keyword names': {
    pattern: /(\s*)\b(for|if|while|switch|catch)\b/,
    replacement: "#{1}<span class='keyword'>#{2}</span>"
  },
  'meta: fat arrow function, one arg, no parens': {
    pattern: /([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*)(=(?:&gt;|>))/,
    replacement: "#{1}#{2}#{3}",
    before: (r, context) => {
      r[1] = handleParams(r[1], context);
    }
  },
  'meta: fat arrow function, args in parens': {
    pattern: /(\()([^\)]*?)(\))(\s*)(=(?:&gt;|>))/,
    replacement: "#{1}#{2}#{3}#{4}#{5}",
    before: (r, context) => {
      r[2] = handleParams(r[2], context);
    }
  },
  'keyword keyword-new': {
    pattern: /new(?=\s[A-Za-z_$])/
  },
  'variable variable-declaration': {
    pattern: /\b(var|let|const)(\s+)([A-Za-z_$][_$A-Z0-9a-z]*?)(?=\s|=|;|,)/,
    replacement: "<span class='storage'>#{1}</span>#{2}<span class='#{name}'>#{3}</span>"
  },
  'variable variable-assignment': {
    pattern: /(\s+|,)([A-Za-z_$][\w\d$]*?)(\s*)(?==)/,
    replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}"
  },
  'meta: destructuring assignment': {
    pattern: /(let|var|const)(\s+)(\{|\[)([\s\S]*)(\}|\])(\s*)(?==)/,
    index: matchText => {
      let pairs = {
        '{': '}',
        '[': ']'
      };
      let match = /(let|var|const|)(\s+)(\{|\[)/.exec(matchText);
      let char = match[3],
          paired = pairs[char];
      return balance(matchText, char, paired, {
        startIndex: matchText.indexOf(char) + 1
      });
    },
    replacement: "<span class='storage'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
    before: (r, context) => {
      r[4] = DESTRUCTURING.parse(r[4], context);
    }
  },
  'function function-expression': {
    pattern: /\b(function)(\s*)([a-zA-Z_$]\w*)?(\s*)(\()(.*?)(\))/,
    replacement: "<span class='keyword keyword-function'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
    before: function before(r, context) {
      if (r[3]) r[3] = "<span class='entity'>".concat(r[3], "</span>");
      r[6] = handleParams(r[6], context);
      return r;
    }
  },
  'function function-literal-shorthand-style': {
    pattern: /(^\s*)(get|set|static)?(\s*)([a-zA-Z_$][a-zA-Z0-9$_]*)(\s*)(\()(.*?)(\))(\s*)(\{)/,
    replacement: "#{1}#{2}#{3}<span class='entity'>#{4}</span>#{5}#{6}#{7}#{8}#{9}#{10}",
    before: (r, context) => {
      if (r[2]) r[2] = "<span class='storage'>".concat(r[1], "</span>");
      r[7] = handleParams(r[7], context);
    }
  },
  'function function-assigned-to-variable': {
    pattern: /\b([a-zA-Z_?\.$]+\w*)(\s*)(=)(\s*)(function)(\s*)(\()(.*?)(\))/,
    replacement: "<span class='variable'>#{1}</span>#{2}#{3}#{4} <span class='keyword'>#{5}</span>#{6}#{7}#{8}#{9}",
    before: (r, context) => {
      r[8] = handleParams(r[8], context);
    }
  },
  'meta: property then function': {
    pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(:)(\s*)(?=function)/,
    replacement: "<span class='entity'>#{1}</span>#{2}#{3}"
  },
  'entity': {
    pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(?=:)/
  },
  'meta: class definition': {
    pattern: /(class)(?:(\s+)([A-Z][A-Za-z0-9_]*))?(?:(\s+)(extends)(\s+)([A-Z][A-Za-z0-9_$\.]*))?(\s*)({)/,
    index: match => {
      return balance(match, '}', '{', {
        startIndex: match.indexOf('{') + 1
      }); // return findBalancedToken('}', '{', match, match.indexOf('{') + 1);
    },
    replacement: compact("\n      <span class=\"storage\">#{1}</span>\n      #{2}#{3}\n      #{4}#{5}#{6}#{7}\n      #{8}#{9}\n    "),
    before: r => {
      if (r[3]) r[3] = wrap(r[3], 'entity entity-class');
      if (r[5]) r[5] = wrap(r[5], 'storage');
      if (r[7]) r[7] = wrap(r[7], 'entity entity-class entity-superclass');
    }
  },
  storage: {
    pattern: /\b(?:var|let|const|class|extends|async)\b/
  },
  keyword: {
    pattern: /\b(?:try|catch|finally|if|else|do|while|for|break|continue|case|switch|default|return|yield|throw|await)\b/
  },
  'keyword operator': {
    pattern: /!==?|={1,3}|>=?|<=?|\+\+|\+|--|-|\*|[\*\+-\/]=|\?|\.{3}|\b(?:instanceof|in|of)\b/
  }
});

// Given a document fragment, find the first text node in the tree,
// depth-first, or `null` if none is found.
function findFirstTextNode(fragment) {
  let {
    childNodes: nodes
  } = fragment;

  if (nodes.length === 0) {
    return null;
  }

  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];

    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }

    let descendant = findFirstTextNode(node);

    if (descendant) {
      return descendant;
    }
  }

  return null;
}

function findLastTextNode(fragment) {
  let {
    childNodes: nodes
  } = fragment;

  if (nodes.length === 0) {
    return null;
  }

  for (let i = nodes.length - 1; i >= 0; i--) {
    let node = nodes[i];

    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }

    let descendant = findFirstTextNode(node);

    if (descendant) {
      return descendant;
    }
  }

  return null;
} // eslint-disable-next-line no-unused-vars

function handler(event) {
  let {
    fragment
  } = event.detail;
  let firstTextNode = findFirstTextNode(fragment);

  if (firstTextNode) {
    let value = firstTextNode.nodeValue;

    if (value && value.match(/^(\s*\n)/)) {
      value = value.replace(/^(\s*\n)/, '');
    }

    firstTextNode.parentNode.replaceChild(document.createTextNode(value), firstTextNode);
  }

  let lastTextNode = findLastTextNode(fragment);

  if (lastTextNode) {
    let value = lastTextNode.nodeValue;

    if (value && value.match(/(\s*\n)+$/)) {
      value = value.replace(/(\s*\n)+$/, '');
    }

    lastTextNode.parentNode.replaceChild(document.createTextNode(value), lastTextNode);
  }
}

function init() {
  document.addEventListener('daub-will-highlight', handler);
}

function getLineHeight(el) {
  let style = getComputedStyle(el);
  return parseFloat(style.lineHeight);
}

function getTopOffset(code, pre) {
  let dummy = document.createElement('span');
  dummy.setAttribute('class', 'daub-line-highlight-dummy');
  dummy.setAttribute('aria-hidden', 'true');
  dummy.textContent = ' ';
  code.insertBefore(dummy, code.firstChild);
  let preRect = pre.getBoundingClientRect();
  let codeRect = dummy.getBoundingClientRect();
  let delta = preRect.top - codeRect.top;
  code.removeChild(dummy);
  return Math.abs(delta);
}

function handleAttribute(str) {
  if (!str) {
    return null;
  }

  function handleUnit(unit) {
    let result = {};

    if (unit.indexOf('-') > -1) {
      let [start, end] = unit.split('-').map(u => Number(u));
      result.start = start;
      result.lines = end + 1 - start;
    } else {
      result.start = Number(unit);
      result.lines = 1;
    }

    return result;
  }

  let units = str.split(/,\s*/).map(handleUnit);
  return units;
}

function makeLine(range, lh, topOffset) {
  let span = document.createElement('mark');
  span.setAttribute('class', 'daub-line-highlight');
  span.setAttribute('aria-hidden', 'true');
  span.textContent = new Array(range.lines).join('\n') + ' ';
  let top = topOffset + (range.start - 1) * lh - 2;
  Object.assign(span.style, {
    position: 'absolute',
    top: top + 'px',
    left: '0',
    right: '0',
    lineHeight: 'inherit'
  });
  return span;
}

function handler$1(event) {
  let code = event.target;
  let pre = code.parentNode;
  let {
    fragment
  } = event.detail;
  let lineAttr = code.getAttribute('data-lines') || pre.getAttribute('data-lines');

  if (!lineAttr) {
    return;
  }

  let ranges = handleAttribute(lineAttr);
  if (!ranges) return;
  pre.style.position = 'relative';
  let lh = getLineHeight(code);
  let to = getTopOffset(code, pre);
  ranges.forEach(r => {
    let span = makeLine(r, lh, to);
    fragment.appendChild(span);
  });
}

function init$1() {
  document.addEventListener('daub-will-highlight', handler$1);
}

const GRAMMAR_MAP = {
  'arduino': shell.Arduino,
  'html': shell.HTML,
  'javascript': MAIN,
  'jsx': shell.JSX,
  'python': shell.Python,
  'ruby': shell.Ruby,
  'scss': shell.SCSS,
  'shell': shell.Shell
};
const GRAMMARS = {
  Arduino: shell.Arduino,
  HTML: shell.HTML,
  JavaScript: MAIN,
  JSX: shell.JSX,
  Python: shell.Python,
  Ruby: shell.Ruby,
  SCSS: shell.SCSS,
  Shell: shell.Shell
};
const PLUGIN_MAP = {
  'whitespace-normalizer': init,
  'line-highlighter': init$1
}; //
// let highlighter = new Daub.Highlighter();
//
// highlighter.addGrammar(Arduino);
// highlighter.addGrammar(SCSS);
// highlighter.addGrammar(JavaScript);
// highlighter.addGrammar(JSX);
// highlighter.addGrammar(HTML);
// highlighter.addGrammar(Python);
// highlighter.addGrammar(Ruby);
// highlighter.addGrammar(Shell);

function init$2() {
  let {
    grammars = [],
    plugins = []
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let highlighter = new shell.Highlighter();
  let gs = grammars.map(g => GRAMMAR_MAP[g]);
  gs.forEach(g => {
    if (!g) {
      return;
    }

    highlighter.addGrammar(g);
  });
  let ps = plugins.map(p => PLUGIN_MAP[p]);
  ps.forEach(p => {
    if (!p) {
      return;
    }

    p();
  });
  return highlighter;
}

exports.AsyncHighlighter = shell.AsyncHighlighter;
exports.Context = shell.Context;
exports.Grammar = shell.Grammar;
exports.Highlighter = shell.Highlighter;
exports.Lexer = shell.Lexer;
exports.Utils = shell.Utils;
exports.GRAMMARS = GRAMMARS;
exports.init = init$2;
