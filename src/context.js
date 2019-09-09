/**
 * A wrapper class around `Map` used to pass state across grammars and lexers.
 *
 * The `set` and `get` methods work like `Map#set` and `Map#get`. The main
 * difference is that `Map#get` takes a `defaultValue` parameter to optimize the
 * common case of setting a fallback value when a key doesn't exist.
 *
 * You won't have to instantiate `Context` directly, but instances of `Context`
 * are available within certain callbacks in `Grammar` rules.
 */
class Context {
  constructor (options = {}) {
    if (options.highlighter) {
      this.highlighter = options.highlighter;
    }
    this.storage = new Map();
  }

  /**
   * Set a value.
   * @param {*} key A map key. Can be anything, though it'll usually be a
   *   string.
   * @param {*} value A value.
   */
  set (key, value) {
    this.storage.set(key, value);
  }

  /**
   * Get a value.
   * @param {*} key A map key. Can be anything, though it'll usually be a
   *   string.
   * @param {*} defaultValue A value to set in this context (and to return
   *   from this method) if storage contains no value for this key. (Uses
   *   `Map#has` internally; `defaultValue` won't be considered if a key's value
   *   is explicitly set to `null` or other falsy values.)
   * @returns {*} The value.
   */
  get (key, defaultValue) {
    if (!this.storage.has(key)) {
      this.storage.set(key, defaultValue);
      return defaultValue;
    }
    return this.storage.get(key);
  }
}

export default Context;
