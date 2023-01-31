import Grammar from '#internal/grammar';
import { compact, VerboseRegExp, wrap } from '#internal/utils';

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

  'meta: function definition': {
    pattern: VerboseRegExp`
      \b(function)
      (\s+) # leading space
      ([a-zA-Z_$-]\w*) # function name
      (\s*) # trailing space
      (?={) # lookahead to open brace
    `,
    replacement: `<span class="keyword keyword-function">#{1}</span>#{2}<span class="entity">#{3}</span>#{4}`
  },

  'shell-command shell-command-backticks': {
    pattern: /(`)([^`]*)(`)/,
    replacement: `<span class="interpolation"><span class="punctuation">#{1}</span><span class="interpolation-contents">#{2}</span><span class="punctuation">#{3}</span></span>`,
    before: (r, context) => {
      r[2] = INSIDE_SHELL_COMMANDS.parse(r[2], context);
    }
  },

  'shell-command': {
    pattern: /(\$\()(.*?)(\))/,
    replacement: `<span class="interpolation"><span class="punctuation">#{1}</span><span class="interpolation-contents">#{2}</span><span class="punctuation">#{3}</span></span>`,
    before: (r, context) => {
      r[2] = INSIDE_SHELL_COMMANDS.parse(r[2], context);
    }
  },

  'support support-builtin': {
    pattern: /\b(?:sudo|chmod|cd|mkdir|ls|cat|echo|touch|mv|cp|rm|ln|sed|awk|tr|xargs|yes|pbcopy|pbpaste|trap)\b/
  },

  'support support-other': {
    pattern: /\b(?:ruby|gem|rake|python|pip|easy_install|node|npm|php|perl|bash|sh|zsh|gcc|go|mate|subl|atom|nano|pico)(?=\s)/
  },

  // Special-case IPs before we handle floats.
  'meta: handle ip address': {
    pattern: /\b([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\b/,
    replacement: "#{1}.#{2}.#{3}.#{4}",
    before: (r, context) => {
      for (let i = 1; i <= 4; i++) {
        r[i] = wrap(r[i], 'number');
      }
    }
  },

  number: {
    pattern: /\b(?:[0-9]+(\.[0-9]+)?)\b/
  },

  constant: {
    pattern: /\b(?:false|true|SIGTERM|SIGINT|SIGKILL)\b/
  },

  'constant constant-home': {
    pattern: /(^|\s*|\n)~(?=\b|\/)/
  },

  keyword: {
    pattern: /\b(?:if|fi|case|esac|for|do|else|then|while|exit|done|shift)\b/
  },

  operator: {
    pattern: />|&gt;|&amp;&amp;|&amp;|&&|&/
  },

  variable: {
    pattern: /(\$[\w_\-]+)\b/
  },

  'meta: subshell with $() notation': {
    pattern: VerboseRegExp`
      \b
      (\$\() # opening
      (.*?)
      (\)) # closing
    `,
    replacement: `<span class="interpolation"><span class="punctuation">#{1}</span><span class="interpolation-contents">#{2}</span><span class="punctuation">#{3}</span></span>`,
    before: (r, context) => {
      r[2] = MAIN.parse(r[2], context);
    }
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
