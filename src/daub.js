// import "core-js/stable";
// import "core-js/es/array/iterator";
// import "core-js/es/string/includes";
// import "core-js/es/string/trim";
// import "regenerator-runtime/runtime";

import * as Utils from './utils';
import Context from './context';
import Grammar from './grammar';
import Highlighter, { AsyncHighlighter } from './highlighter';
import Lexer from './lexer';

export {
  AsyncHighlighter,
  Context,
  Grammar,
  Highlighter,
  Lexer,
  Utils
};
