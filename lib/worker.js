import Grammar from './grammar.js';
import Context from './context.js';
import Logger from './logger.js';
import './grammars/arduino.js';
import './grammars/html.js';
import './grammars/jsx.js';
import './grammars/nginx.js';
import './grammars/python.js';
import './grammars/ruby.js';
import './grammars/scss.js';
import './grammars/shell.js';
import './utils-8b837a1b.js';
import './template.js';
import './utils/verbose-regexp.js';
import './lexer.js';

/* eslint-env worker */

const LOGGER = new Logger('worker');

function parseLanguage (text, language, context) {
  let grammar = Grammar.find(language);
  if (!grammar) {
    return text;
  }
  return grammar.parse(text, context);
}

onmessage = function (event) {
  LOGGER.log('Message:', event);
  let { type } = event.data;
  switch (type) {
    case 'parse': {
      let { language, text, id } = event.data;
      let context = new Context({
        highlighter: { parse: parseLanguage }
      });
      let source = parseLanguage(text, language, context);
      postMessage({ id, language, source });
      break;
    }
  }
};
