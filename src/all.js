
import {
  Context,
  Grammar,
  AsyncHighlighter,
  Highlighter,
  Lexer,
  Utils
} from './daub';

import Arduino from './grammars/arduino';
import HTML from './grammars/html';
import JavaScript from './grammars/javascript';
import JSX from './grammars/jsx';
import Python from './grammars/python';
import Ruby from './grammars/ruby';
import SCSS from './grammars/scss';
import Shell from './grammars/shell';

const GRAMMAR_MAP = {
  'arduino': Arduino,
  'html': HTML,
  'javascript': JavaScript,
  'jsx': JSX,
  'python': Python,
  'ruby': Ruby,
  'scss': SCSS,
  'shell': Shell
};

const GRAMMARS = {
  Arduino,
  HTML,
  JavaScript,
  JSX,
  Python,
  Ruby,
  SCSS,
  Shell
};

import WhitespaceNormalizer from './plugins/whitespace-normalizer';
import LineHighlighter from './plugins/line-highlighter';

const PLUGINS = {
  WhitespaceNormalizer,
  LineHighlighter
};

const PLUGIN_MAP = {
  'whitespace-normalizer': WhitespaceNormalizer,
  'line-highlighter': LineHighlighter
};
//
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

function init ({
  grammars = [],
  plugins = []
} = {}) {
  let highlighter = new Highlighter();

  let gs = grammars.map(g => GRAMMAR_MAP[g]);

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
