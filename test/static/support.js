/* global daub */
/* eslint-disable no-console */
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
document.addEventListener('daub-lexer-time', e => {
  let time = e.detail;
  _runningLexerTime += time;
  _runningLexerCount++;
  console.info('Lexer time:', time, 'ms. Cumulative:', _runningLexerTime, 'Count:', _runningLexerCount);
});

let URL_PARAMS = new URLSearchParams(location.search);
let DEBUG = URL_PARAMS.has('debug');

const Support = {
  async setup () {
    if (!GRAMMAR) {
      let meta = document.querySelector(`meta[name="language"], meta[name="daub-language"]`);
      if (meta) {
        GRAMMAR = meta.getAttribute('value');
      } else {
        let loc = window.location.toString();
        let m = loc.match(/\/(\w*?)\.html/);
        if (m) { GRAMMAR = m[1] === 'index' ? null : m[1]; }
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

    console.log('menu:', document.querySelector('ul#menu'));

    if (!daub) { return; }

    let root = document.body;
    // If there's a PRE element with a `data-only` attribute, highlight only
    // that element. Useful for debugging.
    if (document.querySelector('[data-only]')) {
      root = document.querySelector('[data-only]');
    }

    for (let [name, plugin] of Object.entries(daub.PLUGINS)) {
      plugin();
    }

    if (IS_ASYNC) {
      HIGHLIGHTER = new daub.AsyncHighlighter(WORKER);
    } else {
      HIGHLIGHTER = new daub.Highlighter();
      if (GRAMMAR) {
        let grammarNames = GRAMMAR.split(/,\s*/);
        let grammars = grammarNames.map(g => daub.Grammar.find(g));
        grammars.forEach(g => {
          if (g) { HIGHLIGHTER.addGrammar(g); }
        });
      } else {
        for (let grammar of Object.values(daub.GRAMMARS)) {
          HIGHLIGHTER.addGrammar(grammar);
        }
      }
    }

    HIGHLIGHTER.addElement(root);
    console.log('setting logging to:', DEBUG);
    HIGHLIGHTER.setLogging(DEBUG);
    this.HIGHLIGHTER = HIGHLIGHTER;

    let start, end;
    start = performance.now();
    if (performance && performance.mark) {
      performance.mark('daub-before');
    }

    let markEnd = function (nodes = null) {
      if (nodes) {
        console.log('Highlighted', nodes, 'nodes.');
      }
      if (performance && performance.mark) {
        performance.mark('daub-after');
        performance.measure('daub-before', 'daub-after');
      }
      end = performance.now();
      console.info('Highlight time:', end - start, 'ms');
    };

    await HIGHLIGHTER.highlight();
    markEnd();

    // Keep the chosen section in view.
    let hash = window.location.hash;
    if (hash) {
      window.setTimeout(() => {
        document.querySelector(hash).scrollIntoView();
      }, 0);
    }
  }
};
