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
        worker: WORKER
      });
    } else {
      HIGHLIGHTER = new daub.Highlighter();
      var grammar = daub.Grammar.find(GRAMMAR);
      if (grammar) {
        HIGHLIGHTER.addGrammar(grammar);
      } else {
        for (var key in daub.GRAMMARS) {
          HIGHLIGHTER.addGrammar(daub.GRAMMARS[key]);
        }
      }
    }

    HIGHLIGHTER.addElement(root);

    var start, end;
    start = performance.now();
    if (performance && performance.mark) {
      performance.mark('daub-before');
    }

    var markEnd = function () {
      if (performance && performance.mark) {
        performance.mark('daub-after');
        performance.measure('daub-before', 'daub-after');
      }
      end = performance.now();
      console.log('Highlight time:', end - start, 'ms');
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
