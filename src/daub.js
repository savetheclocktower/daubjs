// TODO: I used to import core-js polyfills along with regenerator-runtime. My
// new goal is to make it so that the codebase doesn't need those things. If a
// recent browser doesn't support something, I should be able to write a pure
// polyfill for it or else adopt another approach to work around the problem.

import * as Utils from '#internal/utils';
import Context from '#internal/context';
import Grammar from '#internal/grammar';
import Highlighter, { AsyncHighlighter } from '#internal/highlighter';
import Lexer from '#internal/lexer';

export {
  AsyncHighlighter,
  Context,
  Grammar,
  Highlighter,
  Lexer
};
