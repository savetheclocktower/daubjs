/* eslint-env worker */
import Grammar from './grammar';

import * as GRAMMARS from './grammars';

console.log('GRAMMARS:', Grammar.debug());

function postError (error) {
  postMessage({ error });
}

onmessage = function (event) {
  console.log('[worker] Message:', event);
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

      let source = grammar.parse(text);
      postMessage({ id, language, source });
      break;
    }
  }
};
