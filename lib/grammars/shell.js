(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('../daub')) :
	typeof define === 'function' && define.amd ? define(['../daub'], factory) :
	(global.daub = global.daub || {}, global.daub.shell = factory(global.daub));
}(this, (function (daub) { 'use strict';

var INSIDE_STRINGS = new daub.Grammar({
  variable: {
    pattern: /(\$[\d\w_\-]+)\b|(\$\{[\d\w_\-]+\})/
  }
});

var INSIDE_SHELL_COMMANDS = new daub.Grammar({
  variable: {
    pattern: /(\$[\w_\-]+)\b/
  }
});

var MAIN = new daub.Grammar('shell', {
  comment: {
    pattern: /#[^\n]*(?=\n|$)/
  },

  string: {
    pattern: /(?:'[^']*'|"[^"]*")/,
    before: function before(r, context) {
      r[0] = INSIDE_STRINGS.parse(r[0], context);
    }
  },

  function: {
    pattern: /(\w[\w\d_\-]+)(?=\()/
  },

  'shell-command shell-command-backticks': {
    pattern: /`[^`]*`/,
    before: function before(r, context) {
      r[0] = INSIDE_SHELL_COMMANDS.parse(r[0], context);
    }
  },

  'shell-command': {
    pattern: /\$\(.*?\)/,
    before: function before(r, context) {
      r[0] = INSIDE_SHELL_COMMANDS.parse(r[0], context);
    }
  },

  number: {
    pattern: /\b(?:[0-9]+(\.[0-9]+)?)\b/
  },

  constant: {
    pattern: /\b(?:false|true)\b/
  },

  keyword: {
    pattern: /\b(?:if|fi|case|esac|for|do|else|then|while|exit|done|shift)\b/
  },

  operator: {
    pattern: />|&gt;|&&|&amp;&amp;/
  },

  variable: {
    pattern: /(\$[\w_\-]+)\b/
  },

  'variable-assignment': {
    pattern: /([A-Za-z_][A-Za-z0-9_]*)(=)/,
    replacement: "<span class='variable'>#{1}</span><span class='operator'>#{2}</span>"
  },

  'variable variable-in-braces': {
    pattern: /\$\{.+?}(?=\n|\b)/
  }
}, { alias: ['bash'] });

return MAIN;

})));
