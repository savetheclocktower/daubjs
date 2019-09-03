
import * as Daub from './daub';

import Arduino from './grammars/arduino';
import HTML from './grammars/html';
import JavaScript from './grammars/javascript';
import JSX from './grammars/jsx';
import Python from './grammars/python';
import Ruby from './grammars/ruby';
import SCSS from './grammars/scss';
import Shell from './grammars/shell';

// import JSXLexer from './lexers/jsx-new';
// import { HTMLFormatter } from './formatter';

import './plugins/whitespace-normalizer';
import './plugins/line-highlighter';

let highlighter = new Daub.Highlighter();

highlighter.addGrammar(Arduino);
highlighter.addGrammar(SCSS);
highlighter.addGrammar(JavaScript);
highlighter.addGrammar(JSX);
highlighter.addGrammar(HTML);
highlighter.addGrammar(Python);
highlighter.addGrammar(Ruby);
highlighter.addGrammar(Shell);


// const escapeLexer = new Daub.Lexer([
//
// ]);

const stringLexer = new Daub.Lexer([
  {
    name: 'string-open',
    pattern: /^\s*('|"|`)/,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      context.set('string-open', match[1]);
      return match;
    }
  },
  {
    name: 'string-escape',
    pattern: /\\./
  },
  {
    name: 'string-end',
    pattern: /('|"|`)/,
    test: (pattern, text, context) => {
      let char = context.get('string-open');
      let match = pattern.exec(text);
      if (!match) { return false; }
      if (match[1] !== char) { return false; }
      context.set('string-open', null);
      return match;
    },
    final: true
  }
]);

const tagLexer = new Daub.Lexer([
  {
    name: 'tag-open',
    pattern: /^\s*<(?=[a-z])/
  },
  {
    name: 'tag-name',
    pattern: /^[a-z][a-z\-]*(?=\s|>)/
  },
  {
    name: 'attribute-name',
    pattern: /^\s*[a-z]+=/,
    after: {
      name: 'attribute-value',
      lexer: stringLexer
    }
  },
  {
    name: 'tag-close',
    pattern: /^>/,
    final: true
  }
]);

// let js = `
//   import PropTypes from 'prop-types';
//
//   import {
//     default as Thing,
//     other
//   } from \`../thing\`;
//
//   class View extends React.Component {
//     render () {
//       let { isClosable } = this.props;
//       if (foo && bar) { doSomething(); }
//       if (bar !== '3') { doSomethingElse(); }
//       return (
//         &lt;div className="WhatTheHell">
//           {isClosable && &lt;Button onClose={onClose} />}
//           &lt;div>foo&lt;/div>
//         &lt;/div>
//       );
//     }
//   }
//
//   function OtherView ({ text }) {
//     return &lt;div>{text}&lt;/div>
//   }
//
//   export default View;`;
//
// let results = JSXLexer.run(js);
// let output = new HTMLFormatter().format(results.tokens);
// console.log('!!!! Raw: ', results);
// console.log('!!!! HTML:', JSON.stringify(output));
//
// window.output = output;

export default highlighter;
