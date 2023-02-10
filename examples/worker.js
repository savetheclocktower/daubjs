/* eslint-env worker */

// This is an example implementation of a web worker. For a no-headaches,
// already-transpiled example, import `daub/worker` or load the pre-built
// `dist/daub.worker.umd.js` file; rolling your own will allow you to load less
// JavaScript by importing only the grammars you need.

// Import the Grammar class and any specific grammars you want to be able to
// understand. Simply importing a grammar will register it so that it can later
// be found by `Grammar.find`.
import { Context, Grammar } from 'daubjs';
import Ruby from 'daubjs/grammars/ruby';

function postError (error) {
  postMessage({ error });
}

function parseLanguage (text, language, context) {
  let grammar = Grammar.find(language);
  if (!grammar) {
    // Depending on your goals, you could decide to throw an error here, or
    // post a message back to the page, or just silently fail and return the
    // text you were given.
    return text;
    // throw new Error(`No such grammar: ${language}`);
  }
  return grammar.parse(text, context);
}

onmessage = function (event) {
  // The lightweight `AsyncHighlighter` class handles the task of requesting
  // syntax highlighting from the main page.
  //
  // Currently, the only type of message it posts is a `parse` event. The
  // metadata includes the grammar name, the text to be highlighted, and a
  // unique ID to ensure continuity.
  let { type } = event.data;
  switch (type) {
    case 'parse': {
      let { language, text, id } = event.data;

      let context = new Context({
        // Some grammars may ask the highlighter to parse with a different
        // grammar that it may be aware of. We build an object of the shape
        // that the grammar expects, so that these requests can be received and
        // possibly satisfied.
        highlighter: { parse: parseLanguage }
      });

      let source = parseLanguage(text, language, context);

      // Return whatever you like, but ensure that `id` and `source` are
      // present at the bare minimum. `id` must be returned so that various
      // parsing jobs don't get confused, and `source` is the tokenized HTML
      // that we just made.
      postMessage({ id, language, source });
      break;
    }
  }
};
