/* eslint-env worker */

// This file is designed to be transpiled to ES5 for simple loading in a web
// worker. If you need only a small subset of grammars, you should consult
// `examples/worker.js` for a script that
import Grammar from '#internal/grammar';
import Context from '#internal/context';
import Logger from '#internal/logger';

import * as GRAMMARS from '#internal/grammars/index';

const LOGGER = new Logger('worker');

function postError (error) {
  postMessage({ error });
}

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
