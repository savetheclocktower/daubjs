import {
  Context,
  Grammar,
  AsyncHighlighter,
  Highlighter,
  Lexer
} from '#internal/daub';

import * as Utils from '#internal/utils';
import * as GRAMMARS from '#internal/grammars/index';

import WhitespaceNormalizer from '#internal/plugins/whitespace-normalizer';
import LineHighlighter from '#internal/plugins/line-highlighter';

const PLUGINS = {
  WhitespaceNormalizer,
  LineHighlighter
};

const PLUGIN_MAP = {
  'whitespace-normalizer': WhitespaceNormalizer,
  'line-highlighter': LineHighlighter
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

export {
  GRAMMARS,
  PLUGINS,

  Context,
  Grammar,
  AsyncHighlighter,
  Highlighter,
  Lexer,
  Utils,

  init
};
