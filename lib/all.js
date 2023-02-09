export { u as Utils } from './utils-8b837a1b.js';
export { default as Context } from './context.js';
import Grammar from './grammar.js';
import Highlighter from './highlighter.js';
export { AsyncHighlighter } from './highlighter.js';
export { default as Lexer } from './lexer.js';
export { i as GRAMMARS } from './index-e1d6b5cf.js';
import init$1 from './plugins/whitespace-normalizer.js';
import init$2 from './plugins/line-highlighter.js';
import './template.js';
import './utils/verbose-regexp.js';
import './grammars/arduino.js';
import './grammars/html.js';
import './grammars/jsx.js';
import './grammars/nginx.js';
import './grammars/python.js';
import './grammars/ruby.js';
import './grammars/scss.js';
import './grammars/shell.js';

const PLUGINS = {
  WhitespaceNormalizer: init$1,
  LineHighlighter: init$2
};

const PLUGIN_MAP = {
  'whitespace-normalizer': init$1,
  'line-highlighter': init$2
};

// Expose a convenience function for UMD builds that can build a highlighter
// with the specified grammars and plugins.
function init ({ grammars = [], plugins = [] } = {}) {
  let highlighter = new Highlighter();

  let gs = grammars.map(g => Grammar.load(g));
  gs.forEach(g => {
    if (!g) { return; }
    highlighter.addGrammar(g);
  });

  let ps = plugins.map(p => PLUGIN_MAP[p]);
  ps.forEach(p => {
    if (!p) { return; }
    p();
  });

  return highlighter;
}

export { Grammar, Highlighter, PLUGINS, init };
