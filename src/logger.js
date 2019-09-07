/* eslint-disable no-console */

let levels = {
  DEBUG: 0,
  INFO:  1,
  LOG:   2,
  WARN:  3,
  ERROR: 4
};

class Logger {
  constructor (tag = null) {
    this.tag = tag;
  }

  _tag () {
    return `[${this.tag}]`;
  }

  debug (...args) {
    console.debug(this._tag(), ...args);
  }

  info (...args) {
    console.info(this._tag(), ...args);
  }

  log (...args) {
    console.log(this._tag(), ...args);
  }

  warn (...args) {
    console.warn(this._tag(), ...args);
  }

  group (...args) {
    console.group(this._tag(), ...args);
  }

  groupCollapsed (...args) {
    console.groupCollapsed(this._tag(), ...args);
  }

  groupEnd () {
    console.groupEnd();
  }
}

for (let label in levels) {
  Logger[label] = levels[label];
}

export default Logger;
