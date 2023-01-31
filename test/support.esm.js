/* eslint-disable no-console */

import {
  AsyncHighlighter,
  Highlighter,
  Grammar,
  GRAMMARS,
  PLUGINS
} from '../dist/daub.esm.js';

const LOC = location.toString();
const IS_ASYNC = LOC.match(/\?worker/);

let HIGHLIGHTER;
let WORKER = null;
let GRAMMAR = null;
if (IS_ASYNC) {
  WORKER = new Worker('/dist/daub.worker.umd.js');
}

let _runningLexerTime = 0;
let _runningLexerCount = 0;
document.addEventListener('daub-lexer-time', (e) => {
  let time = e.detail;
  _runningLexerTime += time;
  _runningLexerCount++;
  console.info('Lexer time:', time, 'ms. Cumulative:', _runningLexerTime, 'Count:', _runningLexerCount);
});

const Support = {
  setup () {
    console.log('setup!');
    if (!GRAMMAR) {
      let meta = document.querySelector(`meta[name="language"], meta[name="daub-language"]`);
      if (meta) {
        GRAMMAR = meta.getAttribute('value');
      } else {
        let loc = window.location.toString();
        let m = loc.match(/\/(\w*?)\.html/);
        if (m) { GRAMMAR = m[1]; }
      }
    }
    if ( document.querySelector('ul#menu') ) {
      // Build the TOC.
      let h1s = Array.from( document.querySelectorAll('section[id] h1, h1[id]') );

      let lis = h1s.map(h1 => {
        let id = h1.getAttribute('id'), title = h1.innerText;
        if (!id) { id = h1.closest('section').getAttribute('id'); }

        return `<li><a href="#${id}">${title}</a></li>`;
      });

      document.querySelector('ul#menu').innerHTML = lis.join('\n');
    }

    let root = document.body;
    // If there's a PRE element with a `data-only` attribute, highlight only
    // that element. Useful for debugging.
    if (document.querySelector('[data-only]')) {
      root = document.querySelector('[data-only]');
    }
    console.log('root is:', root);

    for (let [name, plugin] of Object.entries(PLUGINS)) {
      plugin();
    }

    if (IS_ASYNC) {
      HIGHLIGHTER = new AsyncHighlighter(WORKER);
    } else {
      HIGHLIGHTER = new Highlighter();
      console.log('Highlighter:', HIGHLIGHTER, GRAMMAR);
      if (GRAMMAR) {
        let grammars;
        if (GRAMMAR === 'all') {
          grammars = Object.values(GRAMMARS);
        } else {
          let grammarNames = GRAMMAR.split(/,\s*/);
          grammars = grammarNames.map(g => Grammar.find(g));
        }
        grammars.forEach(g => {
          if (g) { HIGHLIGHTER.addGrammar(g); }
        });
      } else {
        for (let [name, grammar] of GRAMMARS) {
          console.log('adding grammar:', grammar);
          HIGHLIGHTER.addGrammar(grammar);
        }
      }
    }

    HIGHLIGHTER.addElement(root);

    let start, end;
    start = performance.now();
    if (performance && performance.mark) {
      performance.mark('daub-before');
    }

    let markEnd = function () {
      if (performance && performance.mark) {
        performance.mark('daub-after');
        performance.measure('daub-before', 'daub-after');
      }
      end = performance.now();
      console.info('Highlight time:', end - start, 'ms');
    };

    if (IS_ASYNC) {
      HIGHLIGHTER.highlight(markEnd);
    } else {
      HIGHLIGHTER.highlight();
      markEnd();
    }

    // Keep the chosen section in view.
    let hash = window.location.hash;
    if (hash) {
      window.setTimeout(() => {
        document.querySelector(hash).scrollIntoView();
      }, 0);
    }
  }
};

export default Support;
