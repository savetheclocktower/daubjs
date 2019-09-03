import { EVerboseRegExp as re } from '../utils';
import { default as Lexer } from '../lexer';

const JAVASCRIPT = new Lexer([]);

const ESCAPE = new Lexer([
  {
    name: 'escape',
    pattern: re`\\.`
  }
]);

const REGEX = new Lexer([
  {
    name: 'escape',
    pattern: re`\\.`
  },
  {
    name: 'exclude from group begin',
    pattern: re`\\\(`,
    raw: true
  },
  {
    name: 'group-begin',
    pattern: re`\(`
  },
  {
    name: 'group-end',
    pattern: re`\)`,
    final: true
  }
]);

const TEMPLATE_STRING_INTERPOLATION = new Lexer([
  {
    name: 'exclude escaped closing brace',
    pattern: re`\\\}`,
    raw: true
  },
  {
    name: 'interpolation-end',
    pattern: re`\}`,
    final: true
  }
]);

const TEMPLATE_STRING = new Lexer([
  {
    name: 'interpolation-start',
    pattern: re`(\$\{)`,
    inside: {
      name: 'interpolation',
      lexer: TEMPLATE_STRING_INTERPOLATION
    }
  },
  {
    name: 'exclude escaped backtick',
    pattern: re`\\\x60`,
    raw: true
  },
  {
    name: 'string-end',
    pattern: re`\x60`,
    final: true
  }
]);

// TODO: Parameters.

const STRING = new Lexer([
  {
    name: 'string-escape',
    pattern: re`\\.`,
  },
  {
    name: 'string-end',
    pattern: re`('|")`,
    test: (pattern, text, context) => {
      let char = context.get('string-begin');
      let match = pattern.exec(text);
      if (!match) { return false; }
      if (match[1] !== char) { return false; }
      context.set('string-begin', null);
      return match;
    },
    final: true
  }
]);

const COMMENT_MULTILINE = new Lexer([
  // TODO
]);

const VALUES = new Lexer([
]);

const IMPORT_DESTRUCTURING_STATEMENT = new Lexer([
  {
    name: 'punctuation',
    pattern: re`^\s*(?=\,|\})`,
    final: true
  },
  {
    name: 'keyword keyword-default',
    pattern: re`^[\s\n]*\bdefault(?=\s)`
  },
  {
    name: 'keyword keyword-as',
    pattern: re`^\s*as(?=\s)`
  },
  {
    name: 'variable variable-import',
    pattern: re`^[\s\n]*[A-Za-z][A-Za-z0-9_$]*(?=\s|\,|\n)`,
  }
]);

const IMPORT_DESTRUCTURING = new Lexer([
  {
    name: 'punctuation',
    pattern: re`^\{`
  },
  {
    pattern: re`^\s*\}`,
    final: true
  },
  {
    pattern: re`^\s*,\s*\n*`,
    after: {
      name: 'import-destructuring-statement',
      lexer: IMPORT_DESTRUCTURING_STATEMENT
    }
  },
  {
    pattern: re`\s*(?=[^\s\}])`,
    after: {
      name: 'import-destructuring-statement',
      lexer: IMPORT_DESTRUCTURING_STATEMENT
    }
  },
]);

const IMPORT = new Lexer([
  {
    name: 'keyword keyword-wildcard',
    pattern: re`^\s*\*(?=\s)`
  },
  {
    name: 'keyword keyword-as',
    pattern: re`^\s*as(?=\s)`
  },
  {
    name: 'keyword keyword-from',
    pattern: re`^\s*from(?=\s)`,
    // When we get to the string, we know that's the resource name.
    after: {
      name: 'import-resource',
      lexer: new Lexer([
        {
          pattern: re`^\s*('|")`,
          test: (pattern, text, context) => {
            let match = pattern.exec(text);
            if (!match) { return false; }
            context.set('string-begin', match[1]);
            return match;
          },
          inside: {
            name: 'string import-resource',
            lexer: STRING
          }
        },
        {
          pattern: re`^\s*\x60`,
          inside: {
            name: 'string import-resource',
            lexer: TEMPLATE_STRING
          }
        }
      ])
    }
  },
  {
    name: 'variable variable-import',
    pattern: re`^[\s\n]*[A-Za-z][A-Za-z0-9_$]*(?=\s)`,
  },
  {
    name: '',
    pattern: re`^\s*(?=\{)`,
    inside: {
      name: 'import-destructuring',
      lexer: IMPORT_DESTRUCTURING
    }
  },
  {
    name: 'punctuation',
    pattern: re`^\s*;|(?=\n)`,
    final: true
  }
]);

const JSX_INTERPOLATION = new Lexer([
  {
    include: () => VALUES
  },
  {
    name: 'interpolation-end',
    pattern: re`\}`,
    final: true
  }
]);

const JSX_ATTRIBUTE_VALUE = new Lexer([
  {
    name: 'interpolation-begin',
    pattern: re`^\{`,
    inside: {
      name: 'interpolation',
      lexer: JSX_INTERPOLATION
    },
    final: true
  },
  {
    name: 'string-begin',
    pattern: re`^\s*('|")`,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      context.set('string-begin', match[1]);
      return match;
    },
    inside: {
      name: 'string',
      lexer: STRING
    }
  }
]);

const JSX_ATTRIBUTE_SEPARATOR = new Lexer([
  {
    name: `punctuation`,
    pattern: re`^=`,
    after: {
      name: 'attribute-value',
      lexer: JSX_ATTRIBUTE_VALUE
    }
  }
]);

const JSX_CONTENTS = new Lexer([
  // TODO
]);

const JSX_CLOSING_TAG = new Lexer([
  {
    name: 'tag tag-html',
    pattern: re`^[a-z]+(?=\s)`
  },
  {
    name: 'tag tag-jsx',
    pattern: re`^[A-Z][A-Za-z0-9_$\.]*(?=>|&gt;)`
  },
  {
    // Tag-end with end-of-tag context.
    name: 'punctuation punctuation-tag-end',
    pattern: re`(?:>|&gt;)`,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      let wasOpeningTag = context.get('is-opening-tag');
      let depth = context.get('jsx-tag-depth');
      depth += wasOpeningTag ? 1 : -1;

      // This rule is designed to match situations where we're no longer in JSX
      // mode. Return false if the depth is greater than zero; the rule above
      // should've caught this.
      if (depth > 0) { return false; }
      context.set('jsx-tag-depth', depth);
      context.set('is-opening-tag', null);
    },
    final: true
  }
]);

const JSX_TAG = new Lexer([
  {
    name: 'tag tag-html',
    pattern: re`^[a-z]+(?=\s)`
  },
  {
    name: 'tag tag-jsx',
    pattern: re`^[A-Z][A-Za-z0-9_$\.]*(?=\s)`
  },
  {
    name: 'attribute-name',
    pattern: re`^\s*(?:\/)?[a-z]+(?=\=)`,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      context.set('is-opening-tag', match[1] !== '/');
    },
    after: {
      name: 'attribute-separator',
      lexer: JSX_ATTRIBUTE_SEPARATOR
    }
  },
  // The start of a closing tag.
  {
    name: 'punctuation',
    pattern: re`(?:<|&lt;)\/(?=[A-Za-z])`,
    inside: {
      name: 'element jsx-element',
      lexer: JSX_CLOSING_TAG
    }
  },
  {
    // Self-closing tag.
    name: 'punctuation',
    pattern: re`\/(?:>|&gt;)`,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      context.set('is-opening-tag', null);
      // Don't increment the tag depth.
    }
  },
  {
    // Opening tag end with middle-of-tag context.
    name: 'punctuation',
    pattern: re`(>|&gt;)`,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      let wasOpeningTag = context.get('is-opening-tag');
      let depth = context.get('jsx-tag-depth');
      depth += wasOpeningTag ? 1 : -1;

      // This rule is designed to match situations where we're inside at least
      // one JSX tag, because in those cases we're still in JSX mode. So return
      // false if the new depth is now zero. The next rule will catch this.
      if (depth === 0) { return false; }
      context.set('jsx-tag-depth', depth);
      context.set('is-opening-tag', null);
    },
    after: {
      name: 'jsx-contents',
      lexer: JSX_CONTENTS
    },
    final: true
  }
]);

JSX_TAG.addRules([
  // The start of an opening tag.
  {
    name: 'punctuation',
    pattern: re`(?:<|&lt;)(?=[A-Za-z])`,
    inside: {
      name: 'element jsx-element',
      lexer: JSX_TAG
    }
  }
]);

VALUES.addRules([
  {
    name: 'punctuation',
    pattern: re`(?:<|&lt;)(?=[A-Za-z])`,
    inside: {
      name: 'element jsx-element',
      lexer: JSX_TAG
    }
  },
  {
    name: 'regexp-begin',
    pattern: re`\/(?!\/)`,
    inside: {
      name: 'regexp',
      lexer: REGEX
    }
  },
  {
    name: 'constant',
    pattern: re`\b(?:arguments|this|false|true|super|null|undefined)\b`
  },
  {
    name: 'string-begin',
    pattern: re`^\s*('|")`,
    test: (pattern, text, context) => {
      let match = pattern.exec(text);
      if (!match) { return false; }
      context.set('string-begin', match[1]);
      return match;
    },
    inside: {
      name: 'string',
      lexer: STRING
    }
  },
  {
    name: 'number number-binary-or-octal',
    pattern: re`0[bo]\d+`
  },
  {
    name: 'number',
    pattern: re`(?:\d*\.?\d+)`
  },
  {
    name: 'comment-multiline-begin',
    pattern: re`\/\*`,
    inside: {
      name: 'comment comment-multiline',
      lexer: COMMENT_MULTILINE
    }
  }
]);

const OPERATORS = new Lexer([
  {
    name: 'keyword operator',
    pattern: re`\|\||&&|&amp;&amp;|!==?|={1,3}|(?:>|&gt;)=?|(?:<|&lt;)=?|\+\+|\+|--|-|\*|[\*\+-\/]=|\?|\.{3}|\b(?:instanceof|in|of)\b`
  }
]);

const FUNCTION_PARAMETERS = new Lexer([
  {
    name: 'variable variable-parameter',
    pattern: re`^[A-Za-z][A-Za-z0-9_$]*(?=,|\))`
  },
  {
    name: 'punctuation',
    pattern: re`^\s*,\s*`
  },
  {
    name: 'punctuation',
    pattern: re`^\s*\)`,
    after: {
      lexer: new Lexer([
        {
          name: 'punctuation',
          pattern: re`^\s*\{`,
          after: {
            lexer: new Lexer([
              { include: () => JAVASCRIPT },
              {
                name: 'punctuation',
                pattern: re`\}`,
                final: true
              }
            ])
          },
          final: true
        }
      ])
    }
  }
]);

const CLASS_BODY = new Lexer([
  {
    name: 'entity entity-function',
    pattern: re`[A-Za-z][A-Za-z0-9_$]*\s*(?=\()`,
    after: {
      lexer: new Lexer([
        {
          name: 'punctuation',
          pattern: re`^\(`,
          after: {
            name: 'function-parameters',
            lexer: FUNCTION_PARAMETERS
          }
        }
      ])
    },
    final: true
  }
]);

const CLASS_DECLARATION = new Lexer([
  {
    name: 'entity entity-class',
    pattern: re`[A-Za-z][A-Za-z0-9_$]*(?=\s)`
  },
  {
    name: 'keyword keyword-extends',
    pattern: re`^\s*(extends)(\s*)(?=\w)`,
    after: {
      name: 'entity entity-class',
      lexer: new Lexer([
        {
          pattern: re`^[A-Za-z][A-Za-z0-9_$\.]*(?=\s)`,
          final: true
        }
      ])
    }
  },
  {
    name: 'punctuation',
    pattern: re`^\s*\{`,
    after: {
      name: 'class-body',
      lexer: CLASS_BODY
    }
  }
]);

JAVASCRIPT.addRules([
  {
    name: 'keyword keyword-import',
    pattern: re`\b(import)(?=\s)`,
    inside: {
      name: 'import-statement',
      lexer: IMPORT
    }
  },
  {
    name: 'keyword keyword-class',
    pattern: re`\b(class)(?=\s)`,
    inside: {
      name: 'class-declaration',
      lexer: CLASS_DECLARATION
    }
  },
  { include: VALUES }
]);

export default JAVASCRIPT;
