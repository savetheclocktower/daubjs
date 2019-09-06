class Context {
  constructor (options) {
    if (options.highlighter) {
      this.highlighter = options.highlighter;
    }
    this.storage = new Map();
  }

  set (key, value) {
    this.storage.set(key, value);
  }

  get (key, defaultValue) {
    if (!this.storage.has(key)) {
      this.storage.set(key, defaultValue);
      return defaultValue;
    }
    return this.storage.get(key);
  }
}

export default Context;
