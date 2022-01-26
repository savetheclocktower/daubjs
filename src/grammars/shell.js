import { Grammar } from '../daub';

const INSIDE_STRINGS = new Grammar({
  variable: {
    pattern: /(\$[\d\w_\-]+)\b|(\$\{[\d\w_\-]+\})/
  }
});

const INSIDE_SHELL_COMMANDS = new Grammar({
  variable: {
    pattern: (/(\$[\w_\-]+)\b/)
  }
});

const MAIN = new Grammar('shell', {
  comment: {
    pattern: /#[^\n]*(?=\n|$)/
  },

  string: {
    pattern: /(?:'[^']*'|"[^"]*")/,
    before: (r, context) => {
      r[0] = INSIDE_STRINGS.parse(r[0], context);
    }
  },

  function: {
    pattern: /(\w[\w\d_\-]+)(?=\()/
  },

  'shell-command shell-command-backticks': {
    pattern: /`[^`]*`/,
    before: (r, context) => {
      r[0] = INSIDE_SHELL_COMMANDS.parse(r[0], context);
    }
  },

  'shell-command': {
    pattern: /\$\(.*?\)/,
    before: (r, context) => {
      r[0] = INSIDE_SHELL_COMMANDS.parse(r[0], context);
    }
  },

  'support support-builtin': {
    pattern: /\b(?:sudo|chmod|cd|mkdir|ls|cat|echo|touch|mv|cp|rm|ln|sed|awk|tr|xargs|yes|pbcopy|pbpaste)\b/
  },

  'support support-other': {
    pattern: /\b(?:ruby|gem|rake|python|pip|easy_install|node|npm|php|perl|bash|sh|zsh|gcc|go|mate|subl|atom)(?=\s)/
  },

  number: {
    pattern: /\b(?:[0-9]+(\.[0-9]+)?)\b/
  },

  constant: {
    pattern: /\b(?:false|true)\b/
  },

  'constant constant-home': {
    pattern: /(^|\s*|\n)~(?=\b|\/)/
  },

  keyword: {
    pattern: /\b(?:if|fi|case|esac|for|do|else|then|while|exit|done|shift)\b/
  },

  operator: {
    pattern: />|&gt;|&&|&amp;&amp;|&|&amp;/
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

export default MAIN;
