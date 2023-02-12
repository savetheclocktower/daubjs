/* eslint-disable no-console */

let levels = {
  DEBUG: 0,
  INFO:  1,
  LOG:   2,
  WARN:  3,
  ERROR: 4
};

function resolve (value) {
  if (typeof value === 'function') { return value(); }
  return value;
}

class Logger {
  constructor (tag = null, { enabled = false } = {}) {
    this.enabled = resolve(enabled);
    this.tag = tag;
  }

  toggle (condition) {
    this.enabled = typeof condition === 'function' ? condition() : condition;
  }

  _tag () {
    return `[${this.tag}]`;
  }

  debug (...args) {
    if (!this.enabled) { return; }
    console.debug(this._tag(), ...args);
  }

  info (...args) {
    if (!this.enabled) { return; }
    console.info(this._tag(), ...args);
  }

  log (...args) {
    if (!this.enabled) { return; }
    console.log(this._tag(), ...args);
  }

  warn (...args) {
    if (!this.enabled) { return; }
    console.warn(this._tag(), ...args);
  }

  group (...args) {
    if (!this.enabled) { return; }
    console.group(this._tag(), ...args);
  }

  groupCollapsed (...args) {
    if (!this.enabled) { return; }
    console.groupCollapsed(this._tag(), ...args);
  }

  groupEnd () {
    if (!this.enabled) { return; }
    console.groupEnd();
  }
}

for (let label in levels) {
  Logger[label] = levels[label];
}

export default Logger;
