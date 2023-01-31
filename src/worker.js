/* eslint-env worker */
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
    throw new Error(`No such grammar: ${language}`);
  }
  return grammar.parse(text, context);
}

onmessage = function (event) {
  LOGGER.log('Message:', event);
  let { type } = event.data;
  switch (type) {
    case 'parse': {
      let { language, text, id } = event.data;
      let grammar = Grammar.find(language);
      if (!grammar) {
        postError(`No such grammar: ${language}`);
        console.error(`No such grammar: ${language}`);
        return;
      }

      let context = new Context({
        highlighter: { parse: parseLanguage }
      });
      let source = grammar.parse(text, context);
      postMessage({ id, language, source });
      break;
    }
  }
};
