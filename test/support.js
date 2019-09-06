/* global daub */
/* eslint-disable no-console */
var LOC = location.toString();
var IS_ASYNC = LOC.match(/\?worker/);

var HIGHLIGHTER;
var WORKER = null;
var GRAMMAR = null;
if (IS_ASYNC) {
  WORKER = new Worker('/dist/daub.worker.umd.js');
}

var Support = {
  setup () {
    if (!GRAMMAR) {
      let meta = document.querySelector(`meta[name="language"]`);
      if (meta) {
        GRAMMAR = meta.getAttribute('value');
      } else {
        var loc = window.location.toString();
        var m = loc.match(/\/(\w*?)\.html/);
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

    if (!daub) { return; }

    let root = document.body;
    // If there's a PRE element with a `data-only` attribute, highlight only
    // that element. Useful for debugging.
    if (document.querySelector('[data-only]')) {
      root = document.querySelector('[data-only]');
    }

    for (var name in daub.PLUGINS) {
      daub.PLUGINS[name]();
    }

    if (IS_ASYNC) {
      HIGHLIGHTER = new daub.AsyncHighlighter({
        worker: WORKER,
        node: root
      });
    } else {
      HIGHLIGHTER = new daub.Highlighter();
      HIGHLIGHTER.addElement(root);
      let grammar = daub.Grammar.find(GRAMMAR);
      if (grammar) {
        HIGHLIGHTER.addGrammar(grammar);
      } else {
        for (var key in daub.GRAMMARS) {
          HIGHLIGHTER.addGrammar(daub.GRAMMARS[key]);
        }
      }
    }


    // highlighter = daub.init({
    //   grammars: [grammar],
    //   plugins: [
    //     'line-highlighter',
    //     'whitespace-normalizer'
    //   ]
    // });
    // const WORKER = new Worker('../src/worker.js');
    //
    // WORKER.onmessage = function (event) {
    //   console.log('message:', event);
    //   console.log(event.data);
    // };
    //

    // let codes = document.querySelectorAll(`code[class=javascript-jsx]`);
    // console.log('CODES', codes);
    //
    // codes.forEach(function (code, index) {
    //   let text = code.innerText;
    //   // let grammar = code.getAttribute('class');
    //   let message = {
    //     id: index,
    //     grammar,
    //     text
    //   };
    //   console.log('posting message:');
    //   WORKER.postMessage(message);
    // });

    // WORKER.postMessage({ 'daub': '../dist/daub.umd.js' });

    // If there's a PRE element with a `data-only` attribute, highlight only
    // that element. Useful for debugging.
    // if (document.querySelector('[data-only]')) {
    //   HIGHLIGHTER.addElement( document.querySelector('[data-only]')
    //   );
    // } else {
    //   HIGHLIGHTER.addElement(document.body);
    // }

    let start, end;
    start = performance.now();
    if (performance && performance.mark) {
      performance.mark('daub-before');
    }
    HIGHLIGHTER.highlight();
    if (performance && performance.mark) {
      performance.mark('daub-after');
      performance.measure('daub-before', 'daub-after');
    }
    end = performance.now();
    console.log('Highlight time:', end - start, 'ms');

    // Keep the chosen section in view.
    let hash = window.location.hash;
    if (hash) {
      window.setTimeout(() => {
        document.querySelector(hash).scrollIntoView();
      }, 0);
    }
  }
};
