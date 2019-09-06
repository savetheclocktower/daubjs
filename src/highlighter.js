import Context from './context';

// TODO: I've got a proof-of-concept for doing the grunt work of highlighting
// inside a web worker. It's easy enough to write a `Highlighter` analog that
// talks to that web worker instead of triggering the highlighting directly.

// The hard part is determining how that web worker script loads its grammars.
// With the ordinary workflow, anyone using Rollup can just import the built-in
// grammars they need, and the rest of them (theoretically) are removed via
// tree-shaking. With the web worker workflow, there are a few ways to go:
//
// 1. The user builds a self-contained script that imports only the grammars
//    they need. This process would be mostly manual. Would still allow for
//    (theoretical) tree-shaking, but now the user's got to add another output
//    script to their `rollup.config.js`.
// 2. We expose each built-in grammar as a standalone script that can be loaded
//    atomically from the web worker. Feels complicated and still requires the
//    user to write their own worker script.

class AsyncHighlighter {
  constructor ({ worker, node } = {}) {
    this.worker = worker;
    this.node = node || document.body;

    if (!(this.worker instanceof Worker)) {
      throw new TypeError(`Invalid "worker" option.`);
    }
    if (!('nodeType' in this.node)) {
      throw new TypeError(`Invalid "node" option.`);
    }

    this._setupWorker();
    this.uid = 0;
  }

  addElement (element) {
    if (this.elements.indexOf(element) > -1) { return; }
    this.elements.push(element);
  }

  _getLanguage (element) {
    let language = element.getAttribute('data-language');
    if (!language) {
      language = element.className;
    }
    return language;
  }

  highlight () {
    console.log('AsyncHighlighter#scan');
    let selector = `code:not([data-daub-highlighted])`;
    let nodes = Array.from(
      this.node.querySelectorAll(selector)
    );
    if (!nodes || !nodes.length) { return; }

    nodes.forEach(element => {
      console.log('AsyncHighlighter Handling node:', element);
      let uid = this.uid;
      element.setAttribute('data-daub-uid', this.uid++);

      // TODO: Context.
      let source = element.innerHTML;
      let language = this._getLanguage(element);
      // TODO: Encode?
      this.parse(source, language, uid, (parsed) => {
        console.log('[AsyncHighlighter] Got source back:', source);
        this._updateElement(element, parsed, language);
        element.setAttribute('data-daub-highlighted', 'true');
        let meta = { element, language };
        this._fire(
          'highlighted',
          element,
          meta,
          { cancelable: false }
        );
      });
    });
  }

  _handleMessage (e) {
    console.log('AsyncHighlighter handling message:', e);
    let { id, language, source } = e.data;
    let element = this.node.querySelector(`[data-daub-uid="${id}"]`);
    console.log(' does the element exist?', id, element);
    if (!element) {
      // How do we prevent stale highlighting results from being displayed? The
      // process of triggering a newer highlighting pass for that element gave
      // it a new UID. The older call won't find any element on the page.
      // That's the code path we're in right now.
      return;
    }
    this._updateElement(element, source, language);
  }

  _setupWorker () {
    console.log('setting up worker:', this.worker);
    this.worker.onmessage = (e) => this._handleMessage(e);
  }

  _updateElement (element, text, language) {
    let doc = element.ownerDocument;
    let range = document.createRange();

    // Turn the string into a DOM fragment so that it can more easily be
    // acted on by plugins.
    let fragment = range.createContextualFragment(text);

    let meta = { element, language, fragment };
    let event = this._fire('will-highlight', element, meta);

    // Allow event handlers to cancel the highlight.
    if (event.defaultPrevented) { return; }

    if (event.detail.fragment) {
      fragment = event.detail.fragment;

      element.innerHTML = '';
      element.appendChild(fragment);
    }
  }

  _fire (name, element, detail, opts = {}) {
    detail = { highlighter: this, ...detail };
    let options = {
      bubbles: true,
      cancelable: true,
      ...opts,
      detail
    };

    let event = new CustomEvent(`daub-${name}`, options);

    element.dispatchEvent(event);
    return event;
  }

  parse (text, language = null, uid, callback) {
    if (!language) {
      throw new Error(`Must specify a language!`);
    }

    this.worker.postMessage({
      type: 'parse',
      text: text,
      id: uid,
      language: language
    });
  }
}

class Highlighter {
  constructor (options = {}) {
    this.grammars = [];
    this._grammarTable = {};
    this.elements = [];
    this.options = Object.assign({}, Highlighter.DEFAULT_OPTIONS, options);
  }

  addElement (element) {
    if (this.elements.indexOf(element) > -1) { return; }
    this.elements.push(element);
  }

  addGrammar (grammar) {
    if (!grammar.name) {
      throw new Error(`Can't register a grammar without a name.'`);
    }
    if (this.grammars.indexOf(grammar) > -1) { return; }
    this.grammars.push(grammar);
    if (grammar.name) {
      this._grammarTable[grammar.name] = grammar;
    }
  }

  scan (node) {
    this.grammars.forEach((grammar) => {
      let selector = grammar.names
        .map((n) => {
          let cls = this.options.classPrefix + n;
          return `code.${cls}:not([data-highlighted])`;
        })
        .join(', ');

      let nodes = node.querySelectorAll(selector);
      nodes = Array.from(nodes);
      if (!nodes || !nodes.length) { return; }
      nodes.forEach((el) => {
        if ( el.hasAttribute('data-daub-highlighted') ) { return; }
        let context = new Context({ highlighter: this });
        let source = el.innerHTML;
        if (grammar.options.encode) {
          source = source.replace(/</g, '&lt;');
        }
        let parsed = this.parse(source, grammar, context);

        this._updateElement(el, parsed, grammar);
        el.setAttribute('data-daub-highlighted', 'true');

        let meta = { element: el, grammar };
        this._fire('highlighted', el, meta, { cancelable: false });
      });

    });
  }

  highlight () {
    this.elements.forEach( el => this.scan(el) );
  }

  _updateElement (element, text, grammar) {
    let doc = element.ownerDocument, range = doc.createRange();

    // Turn the string into a DOM fragment so that it can more easily be
    // acted on by plugins.
    let fragment = range.createContextualFragment(text);

    let meta = { element, grammar, fragment };
    let event = this._fire('will-highlight', element, meta);

    // Allow event handlers to cancel the highlight.
    if (event.defaultPrevented) { return; }

    // Allow event handlers to mutate the fragment.
    if (event.detail.fragment) { fragment = event.detail.fragment; }

    element.innerHTML = '';
    element.appendChild(fragment);
  }

  _fire (name, element, detail, opts = {}) {
    Object.assign(detail, { highlighter: this });

    let options = Object.assign(
      { bubbles: true, cancelable: true },
      opts,
      { detail }
    );

    let event = new CustomEvent(`daub-${name}`, options);

    element.dispatchEvent(event);
    return event;
  }

  parse (text, grammar = null, context = null) {
    if (typeof grammar === 'string') {
      // If the user passes a string and we can't find the grammar, we should
      // fail silently instead of throwing an error.
      grammar = this._grammarTable[grammar];
      if (!grammar) { return text; }
    } else if (!grammar) {
      throw new Error(`Must specify a grammar!`);
    }
    if (!context) { context = new Context({ highlighter: this }); }

    let parsed = grammar.parse(text, context);

    return parsed;
  }
}

Highlighter.DEFAULT_OPTIONS = {
  classPrefix: ''
};

export {
  AsyncHighlighter,
  Highlighter as default
};
