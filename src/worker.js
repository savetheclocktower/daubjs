/* eslint-env worker */
import Grammar from './grammar';
import Context from './context';
import Logger from './logger';

import * as GRAMMARS from './grammars';

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
