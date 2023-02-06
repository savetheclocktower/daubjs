import Context from '#internal/context';
import Grammar from '#internal/grammar';

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

const EMPTY_FUNCTION = () => {};
const makeDefaultUid = () => Math.random().toString(16).slice(2);

/**
 * @abstract
 * @private
 */
class AbstractHighlighter {
  constructor () {
    this.elements = [];
  }

  // PRIVATE
  // =======

  _fire (name, element, detail = {}, opts = {}) {
    detail.highlighter = this;
    let event = new CustomEvent(
      `daub-${name}`,
      {
        bubbles: true,
        cancelable: true,
        ...opts,
        detail
      }
    );
    element.dispatchEvent(event);
    return event;
  }

  _updateElement (element, text, language) {
    let doc = element.ownerDocument;
    let range = doc.createRange();

    // Turn the string into a DOM fragment so that it can more easily be
    // acted on by plugins.
    let fragment = range.createContextualFragment(text);

    let meta = { element, language, fragment };
    /**
     * Event that signifies that the element's content is about to be replaced
     * with highlighted content. Event handlers can read or mutate the content
     * that will be placed onto the page.
     *
     * Can be cancelled with `event.preventDefault()`.
     *
     * @event daub-will-highlight
     * @memberof Highlighter
     * @property {Element} element The element that will receive the
     *   highlighting.
     * @property {string} language The name of the grammar that performed the
     *   parsing.
     * @property {DocumentFragment} fragment A DOM fragment representation of
     *   the content that will be placed onto the page. Can be mutated in place
     *   by a handler or replaced entirely.
     */

    /**
     * Event that signifies that the element's content is about to be replaced
     * with highlighted content. Event handlers can read or mutate the content
     * that will be placed onto the page.
     *
     * Can be cancelled with `event.preventDefault()`.
     *
     * @event daub-will-highlight
     * @memberof AsyncHighlighter
     * @see Highlighter.event:daub-will-highlight
     *
     */
    let event = this._fire('will-highlight', element, meta);

    // Allow event handlers to cancel the highlight.
    if (event.defaultPrevented) { return; }

    if (event.detail.fragment) {
      fragment = event.detail.fragment;
    }

    element.innerHTML = '';
    element.appendChild(fragment);
  }

  // PUBLIC
  // ======

  /**
   * Add an element to the highlighter.
   * @param {Element} element
   * @memberof AsyncHighlighter.prototype
   */

  /**
    * Add an element to the highlighter.
    * @param {Element} element
    * @memberof Highlighter.prototype
    */
  addElement (element) {
    if (this.elements.indexOf(element) > -1) { return; }
    this.elements.push(element);
  }
}

/**
 * A class that applies syntax highlighting to certain elements on the page by
 * communicating with a web worker.
 *
 * @param {Worker} worker A web worker.
 * @param {Object} [options={}] Options.
 */
class AsyncHighlighter extends AbstractHighlighter {
  constructor (worker, options = {}) {
    super();
    this.worker = worker;

    if (!(this.worker instanceof Worker)) {
      throw new TypeError(`Invalid "worker" option.`);
    }
    this._setupWorker();

    this.uid = 0;
    this._callbacks = {};
    this.options = {
      ...AsyncHighlighter.DEFAULT_OPTIONS,
      ...options
    };
  }

  // PRIVATE
  // =======

  _getLanguage (element) {
    return element.getAttribute('data-language') ||
     element.className;
  }

  _getSelector () {
    let rawSelector = this.options.selector;
    if (typeof rawSelector === 'string') { rawSelector = [rawSelector]; }
    return rawSelector
      .map(s => `${s}:not([data-daub-highlighted])`)
      .join(', ');
  }

  _scan (node) {
    let selector = this._getSelector();
    let nodes = Array.from( node.querySelectorAll(selector) );

    if (!nodes || !nodes.length) {
      return Promise.resolve([]);
    }

    let length = nodes.length;
    let complete = 0;

    let promises = nodes.map(element => {
      let uid;
      if (element.hasAttribute('data-daub-uid')) {
        uid = element.getAttribute('data-daub-uid');
      } else {
        uid = this.uid;
        element.setAttribute('data-daub-uid', this.uid++);
      }

      let source = element.innerHTML;
      let language = this._getLanguage(element);

      return this.parse(source, language, uid).then(([parsed, element]) => {
        this._updateElement(element, parsed, language);
        element.setAttribute('data-daub-highlighted', 'true');
        /**
         * Event that signifies that highlighting has occurred on a given
         * element.
         * @event daub-highlighted
         * @memberof AsyncHighlighter
         * @type {Object}
         * @property element The element which received the highlighting.
         * @property language The name of the grammar which performed the
         *   highlighting.
         */
        this._fire(
          'highlighted',
          element,
          { element, language },
          { cancelable: false }
        );
        return element;
      });
    });

    return Promise.all(promises);
  }

  _handleMessage (e) {
    let { id, source } = e.data;
    let element;
    for (let el of this.elements) {
      element = el.querySelector(`[data-daub-uid="${id}"]`);
      if (element) { break; }
    }
    let callback = this._callbacks[id];
    delete this._callbacks[id];
    if (!callback) {
      // TODO: This shouldn't happen. Worth throwing?
      return;
    }
    callback([source, element]);
  }

  _setupWorker () {
    this.worker.onmessage = (e) => this._handleMessage(e);
  }

  // PUBLIC
  // ======

  /**
   * Parses arbitrary text using a single grammar name.
   *
   * You usually won't need to call this directly; it's called by
   * `AsyncHighlighter#highlight`. You may, though, use it if you want to
   * request highlighting of text that isn't in the DOM, as long as you
   * know the name of the grammar you'd like to use.
   *
   * If the worker doesn't recognize the grammar name, it will return the
   * original text unmodified.
   *
   * @param   {string} text The raw source to highlight.
   * @param   {string} language The grammar name with which to highlight.
   * @param   {string} [uid=null] A unique ID to represent the job.
       Optional; if missing, one will be generated at random.
   * @returns {Promise} Resolves with a two-item array: the highlighted
   *   source, and any element associated with this job. If you call this
   *   method manually, the second item will be `undefined`.
   */
  parse (text, language = null, uid = null) {
    if (!language) {
      throw new Error(`Must specify a language!`);
    }

    if (!uid) { uid = makeDefaultUid(); }

    return new Promise((resolve, reject) => {
      this._callbacks[uid] = resolve;

      this.worker.postMessage({
        type: 'parse',
        text,
        language,
        id: uid
      });
    });
  }

  /**
   * Highlight elements that need highlighting.
   *
   * You can call this method as often as you like; each time it's called, it'll
   * look for elements that it hasn't already handled (i.e., because they
   * weren't yet on the page).
   *
   * To force `Highlighter` to re-highlight an element, remove the element's
   * `data-daub-highlighted` attribute, then call `Highlighter#highlight`
   * again. You should not do this unless you have also completely replaced
   * the element's contents.
   *
   * @fires AsyncHighlighter.daub-will-highlight
   * @fires AsyncHighlighter.daub-highlighted
   *
   * @returns {Promise} A promise that resolves after all elements that may
   *   need highlighting have been highlighted. Resolves with an array of
   *   affected nodes.
   */
  highlight () {
    let promises = this.elements.map(el => this._scan(el));
    return Promise.all(promises).then(results => results.flat());
  }
}

AsyncHighlighter.DEFAULT_OPTIONS = {
  selector: [
    `code[data-language]`,
    `code[class]`
  ]
};

/**
 * A class that applies syntax highlighting to certain elements on the page.
 * @extends AbstractHighlighter
 */
class Highlighter extends AbstractHighlighter {
  /**
   * Creates a `Highlighter` instance.
   *
   * @param {Object} [options={}] Options.
   * @param {Function} [options.customSelector] A function that, when given the
   *   name of a grammar, should return a CSS selector that describes the
   *   elements which should be highlighted by that grammar. Defaults to a
   *   function that, when called with `foo`, returns `code.foo,
   *   code[data-language-"foo"]`.
   *
   *   In other words: by default, `<code class="foo">` and
   *   `<code data-language="foo">` will tell the highlighter to use the grammar
   *   named “foo” to highlight the code inside.
   *
   *   Called with two parameters: the name of the grammar and the highlighter's
   *   `options` object. The latter is given so you can take into account the
   *   value of `classPrefix` if you so choose.
   *
   * @param {string} [options.classPrefix=''] A string that is prepended to any
   *   `class` value when determining the selector. Default is an empty string.
   *   If the value were `language-`, then `<code class="language-foo">` would
   *   trigger highlighting for the grammar named "foo". Does not affect the
   *   `[data-language]` aspect of the selector.
   *
   *   The default value for `customSelector` takes `classPrefix` into account.
   *   If you write your own `customSelector` function, it's up to you whether
   *   to incorporate this value into your logic.
   */
  constructor (options = {}) {
    super();

    this.grammars = [];
    this._grammarTable = {};

    this.options = {
      ...Highlighter.DEFAULT_OPTIONS,
      ...options
    };
  }

  _selectorsForGrammar (grammar) {
    return grammar.names.map(name => {
      let selectors = this.options.customSelector(name, this.options);
      if (typeof selectors === 'string') { selectors = [selectors]; }
      return selectors.map(s => `${s}:not([data-daub-highlighted])`).join(', ');
    }).join(', ');
  }

  _scan (node) {
    this.grammars.forEach((grammar) => {
      let selector = this._selectorsForGrammar(grammar);
      let nodes = node.querySelectorAll(selector);
      if (!nodes || !nodes.length) { return; }
      Array.from(nodes).forEach((el) => {
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
        /**
         * Event that signifies that highlighting has occurred on a given
         * element.
         * @event daub-highlighted
         * @memberof Highlighter
         * @type {Object}
         * @property element The element which received the highlighting.
         * @property language The name of the grammar which performed the
         *   highlighting.
         */
        this._fire('highlighted', el, meta, { cancelable: false });
      });

    });
  }

  /**
   * Highlight elements that need highlighting.
   *
   * You can call this method as often as you like; each time it's called, it'll
   * look for elements that it hasn't already handled (i.e., because they
   * weren't yet on the page).
   *
   * To force `Highlighter` to re-highlight an element, remove the element's
   * `data-daub-highlighted` attribute, then call `Highlighter#highlight` again.
   * You should not do this unless you have also completely replaced the
   * element's contents.
   */
  highlight () {
    this.elements.forEach( el => this._scan(el) );
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

  // PUBLIC
  // ======

  addElement (element) {
    if (this.elements.indexOf(element) > -1) { return; }
    this.elements.push(element);
  }

  /**
   * Add a grammar to the list of grammars that the highlighter should use.
   *
   * @param {Grammar|string} grammar The grammar or its name. If a name is
   *   given, the grammar must already be known to Daub. Built-in grammars are
   *   always known about; for custom grammars, call `Grammar.register` after
   *   creating it to make Daub aware of its name.
   */
  addGrammar (grammar) {
    if (typeof grammar === 'string') {
      grammar = Grammar.find(grammar);
    }
    if (grammar === null || !(grammar instanceof Grammar)) {
      throw new TypeError(`Invalid "grammar" argument.`);
    }
    if (!grammar.name) {
      throw new Error(`Can't register a grammar without a name.'`);
    }
    if (this.grammars.indexOf(grammar) > -1) { return; }
    this.grammars.push(grammar);
    grammar.names.forEach(n => this._grammarTable[n] = grammar);
  }

  /**
   * Parse text using a grammar.
   *
   * @param {string} text The text to parse.
   * @param {string|Grammar} [grammar=null] The grammar to use. If a string,
   *   must be the name of a grammar that has been made known to this
   *   highlighter via `addGrammar`.
   * @param {[type]} [context=null] The instance of `Context` to use. If parsing
   *   a language within another language, pass the instance of `Context` that
   *   is already available to you; otherwise omit this argument and a new
   *   instance will be created. You'll hardly ever have to create a `Context`
   *   instance yourself.
   * @returns {string} Parsed text. If a grammar is specified by name and this
   *   instance does not recognize it, the original text will be returned.
   */
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
  classPrefix: '',
  // Given a grammar, returns a selector that would match HTML elements meant
  // to be highlighted with that grammar.
  //
  // NOTE: If the selector has several comma-separated components, return an
  // _array_ of parts so that the parts can be concatenated onto more easily.
  customSelector: (grammarName, options) => {
    return [
      `code.${options.classPrefix}${grammarName}`,
      `code[data-language="${grammarName}"]`
    ];
  }
};

export {
  AsyncHighlighter,
  Highlighter as default
};
