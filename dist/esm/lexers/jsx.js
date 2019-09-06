"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

var _lexer = _interopRequireDefault(require("../lexer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject46() {
  const data = _taggedTemplateLiteral(["\b(import)(?=s)"], ["\\b(import)(?=\\s)"]);

  _templateObject46 = function _templateObject46() {
    return data;
  };

  return data;
}

function _templateObject45() {
  const data = _taggedTemplateLiteral(["|||&&|&amp;&amp;|!==?|={1,3}|(?:>|&gt;)=?|(?:<|&lt;)=?|++|+|--|-|*|[*+-/]=|?|.{3}|\b(?:instanceof|in|of)\b"], ["\\|\\||&&|&amp;&amp;|!==?|={1,3}|(?:>|&gt;)=?|(?:<|&lt;)=?|\\+\\+|\\+|--|-|\\*|[\\*\\+-\\/]=|\\?|\\.{3}|\\b(?:instanceof|in|of)\\b"]);

  _templateObject45 = function _templateObject45() {
    return data;
  };

  return data;
}

function _templateObject44() {
  const data = _taggedTemplateLiteral(["/*"], ["\\/\\*"]);

  _templateObject44 = function _templateObject44() {
    return data;
  };

  return data;
}

function _templateObject43() {
  const data = _taggedTemplateLiteral(["(?:d*.?d+)"], ["(?:\\d*\\.?\\d+)"]);

  _templateObject43 = function _templateObject43() {
    return data;
  };

  return data;
}

function _templateObject42() {
  const data = _taggedTemplateLiteral(["0[bo]d+"], ["0[bo]\\d+"]);

  _templateObject42 = function _templateObject42() {
    return data;
  };

  return data;
}

function _templateObject41() {
  const data = _taggedTemplateLiteral(["^s*('|\")"], ["^\\s*('|\")"]);

  _templateObject41 = function _templateObject41() {
    return data;
  };

  return data;
}

function _templateObject40() {
  const data = _taggedTemplateLiteral(["\b(?:arguments|this|false|true|super|null|undefined)\b"], ["\\b(?:arguments|this|false|true|super|null|undefined)\\b"]);

  _templateObject40 = function _templateObject40() {
    return data;
  };

  return data;
}

function _templateObject39() {
  const data = _taggedTemplateLiteral(["/(?!/)"], ["\\/(?!\\/)"]);

  _templateObject39 = function _templateObject39() {
    return data;
  };

  return data;
}

function _templateObject38() {
  const data = _taggedTemplateLiteral(["(?:<|&lt;)(?=[A-Za-z])"]);

  _templateObject38 = function _templateObject38() {
    return data;
  };

  return data;
}

function _templateObject37() {
  const data = _taggedTemplateLiteral(["(>|&gt;)"]);

  _templateObject37 = function _templateObject37() {
    return data;
  };

  return data;
}

function _templateObject36() {
  const data = _taggedTemplateLiteral(["/(?:>|&gt;)"], ["\\/(?:>|&gt;)"]);

  _templateObject36 = function _templateObject36() {
    return data;
  };

  return data;
}

function _templateObject35() {
  const data = _taggedTemplateLiteral(["(?:<|&lt;)/(?=[A-Za-z])"], ["(?:<|&lt;)\\/(?=[A-Za-z])"]);

  _templateObject35 = function _templateObject35() {
    return data;
  };

  return data;
}

function _templateObject34() {
  const data = _taggedTemplateLiteral(["(?:<|&lt;)(?=[A-Za-z])"]);

  _templateObject34 = function _templateObject34() {
    return data;
  };

  return data;
}

function _templateObject33() {
  const data = _taggedTemplateLiteral(["^s*(?:/)?[a-z]+(=)"], ["^\\s*(?:\\/)?[a-z]+(=)"]);

  _templateObject33 = function _templateObject33() {
    return data;
  };

  return data;
}

function _templateObject32() {
  const data = _taggedTemplateLiteral(["^[A-Z][A-Za-z0-9_$.]*(?=s)"], ["^[A-Z][A-Za-z0-9_$\\.]*(?=\\s)"]);

  _templateObject32 = function _templateObject32() {
    return data;
  };

  return data;
}

function _templateObject31() {
  const data = _taggedTemplateLiteral(["^[a-z]+(?=s)"], ["^[a-z]+(?=\\s)"]);

  _templateObject31 = function _templateObject31() {
    return data;
  };

  return data;
}

function _templateObject30() {
  const data = _taggedTemplateLiteral(["(?:>|&gt;)"]);

  _templateObject30 = function _templateObject30() {
    return data;
  };

  return data;
}

function _templateObject29() {
  const data = _taggedTemplateLiteral(["^[A-Z][A-Za-z0-9_$.]*(?=>|&gt;)"], ["^[A-Z][A-Za-z0-9_$\\.]*(?=>|&gt;)"]);

  _templateObject29 = function _templateObject29() {
    return data;
  };

  return data;
}

function _templateObject28() {
  const data = _taggedTemplateLiteral(["^[a-z]+(?=s)"], ["^[a-z]+(?=\\s)"]);

  _templateObject28 = function _templateObject28() {
    return data;
  };

  return data;
}

function _templateObject27() {
  const data = _taggedTemplateLiteral(["^s*('|\")"], ["^\\s*('|\")"]);

  _templateObject27 = function _templateObject27() {
    return data;
  };

  return data;
}

function _templateObject26() {
  const data = _taggedTemplateLiteral(["^{"], ["^\\{"]);

  _templateObject26 = function _templateObject26() {
    return data;
  };

  return data;
}

function _templateObject25() {
  const data = _taggedTemplateLiteral(["}"], ["\\}"]);

  _templateObject25 = function _templateObject25() {
    return data;
  };

  return data;
}

function _templateObject24() {
  const data = _taggedTemplateLiteral(["^s*;|(?=\n)"], ["^\\s*;|(?=\\n)"]);

  _templateObject24 = function _templateObject24() {
    return data;
  };

  return data;
}

function _templateObject23() {
  const data = _taggedTemplateLiteral(["^s*(?={)"], ["^\\s*(?=\\{)"]);

  _templateObject23 = function _templateObject23() {
    return data;
  };

  return data;
}

function _templateObject22() {
  const data = _taggedTemplateLiteral(["^[s\n]*[A-Za-z][A-Za-z0-9_$]*(?=s)"], ["^[\\s\\n]*[A-Za-z][A-Za-z0-9_$]*(?=\\s)"]);

  _templateObject22 = function _templateObject22() {
    return data;
  };

  return data;
}

function _templateObject21() {
  const data = _taggedTemplateLiteral(["^s*from(?=s)"], ["^\\s*from(?=\\s)"]);

  _templateObject21 = function _templateObject21() {
    return data;
  };

  return data;
}

function _templateObject20() {
  const data = _taggedTemplateLiteral(["^s*as(?=s)"], ["^\\s*as(?=\\s)"]);

  _templateObject20 = function _templateObject20() {
    return data;
  };

  return data;
}

function _templateObject19() {
  const data = _taggedTemplateLiteral(["^s**(?=s)"], ["^\\s*\\*(?=\\s)"]);

  _templateObject19 = function _templateObject19() {
    return data;
  };

  return data;
}

function _templateObject18() {
  const data = _taggedTemplateLiteral(["s*(?=[^s}])"], ["\\s*(?=[^\\s\\}])"]);

  _templateObject18 = function _templateObject18() {
    return data;
  };

  return data;
}

function _templateObject17() {
  const data = _taggedTemplateLiteral(["^{"], ["^\\{"]);

  _templateObject17 = function _templateObject17() {
    return data;
  };

  return data;
}

function _templateObject16() {
  const data = _taggedTemplateLiteral(["^[s\n]*[A-Za-z][A-Za-z0-9_$]*(?=s|,|\n)"], ["^[\\s\\n]*[A-Za-z][A-Za-z0-9_$]*(?=\\s|\\,|\\n)"]);

  _templateObject16 = function _templateObject16() {
    return data;
  };

  return data;
}

function _templateObject15() {
  const data = _taggedTemplateLiteral(["^s*as(?=s)"], ["^\\s*as(?=\\s)"]);

  _templateObject15 = function _templateObject15() {
    return data;
  };

  return data;
}

function _templateObject14() {
  const data = _taggedTemplateLiteral(["^[s\n]*\bdefault(?=s)"], ["^[\\s\\n]*\\bdefault(?=\\s)"]);

  _templateObject14 = function _templateObject14() {
    return data;
  };

  return data;
}

function _templateObject13() {
  const data = _taggedTemplateLiteral(["^s*(?:,|})"], ["^\\s*(?:\\,|\\})"]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _templateObject12() {
  const data = _taggedTemplateLiteral(["('|\")"]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  const data = _taggedTemplateLiteral(["\\."], ["\\\\."]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  const data = _taggedTemplateLiteral(["`"], ["\\x60"]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  const data = _taggedTemplateLiteral(["\\`"], ["\\\\\\x60"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  const data = _taggedTemplateLiteral(["(${)"], ["(\\$\\{)"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  const data = _taggedTemplateLiteral(["}"], ["\\}"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  const data = _taggedTemplateLiteral(["\\}"], ["\\\\\\}"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  const data = _taggedTemplateLiteral(["("], ["\\("]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  const data = _taggedTemplateLiteral(["("], ["\\("]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  const data = _taggedTemplateLiteral(["\\("], ["\\\\\\("]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  const data = _taggedTemplateLiteral(["\\."], ["\\\\."]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  const data = _taggedTemplateLiteral(["\\."], ["\\\\."]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

const ESCAPE = new _lexer.default([{
  name: 'escape',
  pattern: (0, _utils.VerboseRegExp)(_templateObject())
}]);
const REGEX = new _lexer.default([{
  name: 'escape',
  pattern: (0, _utils.VerboseRegExp)(_templateObject2())
}, {
  name: 'exclude from group begin',
  pattern: (0, _utils.VerboseRegExp)(_templateObject3()),
  raw: true
}, {
  name: 'group-begin',
  pattern: (0, _utils.VerboseRegExp)(_templateObject4())
}, {
  name: 'group-end',
  pattern: (0, _utils.VerboseRegExp)(_templateObject5()),
  final: true
}]);
const TEMPLATE_STRING_INTERPOLATION = new _lexer.default([{
  name: 'exclude escaped closing brace',
  pattern: (0, _utils.VerboseRegExp)(_templateObject6()),
  raw: true
}, {
  name: 'interpolation-end',
  pattern: (0, _utils.VerboseRegExp)(_templateObject7()),
  final: true
}]);
const TEMPLATE_STRING = new _lexer.default([{
  name: 'interpolation-start',
  pattern: (0, _utils.VerboseRegExp)(_templateObject8()),
  inside: {
    name: 'interpolation',
    lexer: TEMPLATE_STRING_INTERPOLATION
  }
}, {
  name: 'exclude escaped backtick',
  pattern: (0, _utils.VerboseRegExp)(_templateObject9()),
  raw: true
}, {
  name: 'string-end',
  pattern: (0, _utils.VerboseRegExp)(_templateObject10()),
  final: true
}]); // TODO: Parameters.

const STRING = new _lexer.default([{
  name: 'string-escape',
  pattern: (0, _utils.VerboseRegExp)(_templateObject11())
}, {
  name: 'string-end',
  pattern: (0, _utils.VerboseRegExp)(_templateObject12()),
  test: (pattern, text, context) => {
    let char = context.get('string-begin');
    let match = pattern.exec(text);

    if (!match) {
      return false;
    }

    if (match[1] !== char) {
      return false;
    }

    context.set('string-begin', null);
    return match;
  },
  final: true
}]);
const COMMENT_MULTILINE = new _lexer.default([// TODO
]);
const VALUES = new _lexer.default([]);
const IMPORT_DESTRUCTURING_STATEMENT = new _lexer.default([{
  name: 'punctuation',
  pattern: (0, _utils.VerboseRegExp)(_templateObject13()),
  final: true
}, {
  name: 'keyword keyword-default',
  pattern: (0, _utils.VerboseRegExp)(_templateObject14())
}, {
  name: 'keyword keyword-as',
  pattern: (0, _utils.VerboseRegExp)(_templateObject15())
}, {
  name: 'variable variable-import',
  pattern: (0, _utils.VerboseRegExp)(_templateObject16())
}]);
const IMPORT_DESTRUCTURING = new _lexer.default([{
  name: 'punctuation',
  pattern: (0, _utils.VerboseRegExp)(_templateObject17())
}, {
  pattern: (0, _utils.VerboseRegExp)(_templateObject18()),
  after: {
    name: 'import-destructuring-statement',
    lexer: IMPORT_DESTRUCTURING_STATEMENT
  },
  final: true
}]);
const IMPORT = new _lexer.default([{
  name: 'keyword keyword-wildcard',
  pattern: (0, _utils.VerboseRegExp)(_templateObject19())
}, {
  name: 'keyword keyword-as',
  pattern: (0, _utils.VerboseRegExp)(_templateObject20())
}, {
  name: 'keyword keyword-from',
  pattern: (0, _utils.VerboseRegExp)(_templateObject21()),
  // When we get to the string, we know that's the resource name.
  after: {
    name: 'import-resource',
    lexer: new _lexer.default([{
      pattern: /^\s*('|")/,
      test: (pattern, text, context) => {
        let match = pattern.exec(text);

        if (!match) {
          return false;
        }

        context.set('string-begin', match[1]);
        return match;
      },
      inside: {
        name: 'string import-resource',
        lexer: STRING
      }
    }])
  }
}, {
  name: 'variable variable-import',
  pattern: (0, _utils.VerboseRegExp)(_templateObject22())
}, {
  name: '',
  pattern: (0, _utils.VerboseRegExp)(_templateObject23()),
  inside: {
    name: 'import-destructuring',
    lexer: IMPORT_DESTRUCTURING
  }
}, {
  name: 'punctuation',
  pattern: (0, _utils.VerboseRegExp)(_templateObject24()),
  final: true
}]);
const JSX_INTERPOLATION = new _lexer.default([{
  include: () => VALUES
}, {
  name: 'interpolation-end',
  pattern: (0, _utils.VerboseRegExp)(_templateObject25()),
  final: true
}]);
const JSX_ATTRIBUTE_VALUE = new _lexer.default([{
  name: 'interpolation-begin',
  pattern: (0, _utils.VerboseRegExp)(_templateObject26()),
  inside: {
    name: 'interpolation',
    lexer: JSX_INTERPOLATION
  },
  final: true
}, {
  name: 'string-begin',
  pattern: (0, _utils.VerboseRegExp)(_templateObject27()),
  test: (pattern, text, context) => {
    let match = pattern.exec(text);

    if (!match) {
      return false;
    }

    context.set('string-begin', match[1]);
    return match;
  },
  inside: {
    name: 'string',
    lexer: STRING
  }
}]);
const JSX_CONTENTS = new _lexer.default([// TODO
]);
const JSX_CLOSING_TAG = new _lexer.default([{
  name: 'tag tag-html',
  pattern: (0, _utils.VerboseRegExp)(_templateObject28())
}, {
  name: 'tag tag-jsx',
  pattern: (0, _utils.VerboseRegExp)(_templateObject29())
}, {
  // Tag-end with end-of-tag context.
  name: 'punctuation punctuation-tag-end',
  pattern: (0, _utils.VerboseRegExp)(_templateObject30()),
  test: (pattern, text, context) => {
    let match = pattern.exec(text);

    if (!match) {
      return false;
    }

    let wasOpeningTag = context.get('is-opening-tag');
    let depth = context.get('jsx-tag-depth');
    depth += wasOpeningTag ? 1 : -1; // This rule is designed to match situations where we're no longer in JSX
    // mode. Return false if the depth is greater than zero; the rule above
    // should've caught this.

    if (depth > 0) {
      return false;
    }

    context.set('jsx-tag-depth', depth);
    context.set('is-opening-tag', null);
  },
  final: true
}]);
const JSX_TAG = new _lexer.default([{
  name: 'tag tag-html',
  pattern: (0, _utils.VerboseRegExp)(_templateObject31())
}, {
  name: 'tag tag-jsx',
  pattern: (0, _utils.VerboseRegExp)(_templateObject32())
}, {
  name: 'attribute-name',
  pattern: (0, _utils.VerboseRegExp)(_templateObject33()),
  test: (pattern, text, context) => {
    let match = pattern.exec(text);

    if (!match) {
      return false;
    }

    context.set('is-opening-tag', match[1] !== '/');
  },
  after: {
    name: 'attribute-value',
    lexer: JSX_ATTRIBUTE_VALUE
  }
}, // The start of an opening tag.
{
  name: 'punctuation',
  pattern: (0, _utils.VerboseRegExp)(_templateObject34()),
  inside: {
    name: 'element jsx-element',
    lexer: JSX_TAG
  }
}, // The start of a closing tag.
{
  name: 'punctuation',
  pattern: (0, _utils.VerboseRegExp)(_templateObject35()),
  inside: {
    name: 'element jsx-element',
    lexer: JSX_CLOSING_TAG
  }
}, {
  // Self-closing tag.
  name: 'punctuation',
  pattern: (0, _utils.VerboseRegExp)(_templateObject36()),
  test: (pattern, text, context) => {
    let match = pattern.exec(text);

    if (!match) {
      return false;
    }

    context.set('is-opening-tag', null); // Don't increment the tag depth.
  }
}, {
  // Opening tag end with middle-of-tag context.
  name: 'punctuation',
  pattern: (0, _utils.VerboseRegExp)(_templateObject37()),
  test: (pattern, text, context) => {
    let match = pattern.exec(text);

    if (!match) {
      return false;
    }

    let wasOpeningTag = context.get('is-opening-tag');
    let depth = context.get('jsx-tag-depth');
    depth += wasOpeningTag ? 1 : -1; // This rule is designed to match situations where we're inside at least
    // one JSX tag, because in those cases we're still in JSX mode. So return
    // false if the new depth is now zero. The next rule will catch this.

    if (depth === 0) {
      return false;
    }

    context.set('jsx-tag-depth', depth);
    context.set('is-opening-tag', null);
  },
  after: {
    name: 'jsx-contents',
    lexer: JSX_CONTENTS
  },
  final: true
}]);
VALUES.addRules([{
  name: 'punctuation',
  pattern: (0, _utils.VerboseRegExp)(_templateObject38()),
  inside: {
    name: 'element jsx-element',
    lexer: JSX_TAG
  }
}, {
  name: 'regexp-begin',
  pattern: (0, _utils.VerboseRegExp)(_templateObject39()),
  inside: {
    name: 'regexp',
    lexer: REGEX
  }
}, {
  name: 'constant',
  pattern: (0, _utils.VerboseRegExp)(_templateObject40())
}, {
  name: 'string-begin',
  pattern: (0, _utils.VerboseRegExp)(_templateObject41()),
  test: (pattern, text, context) => {
    let match = pattern.exec(text);

    if (!match) {
      return false;
    }

    context.set('string-begin', match[1]);
    return match;
  },
  inside: {
    name: 'string',
    lexer: STRING
  }
}, {
  name: 'number number-binary-or-octal',
  pattern: (0, _utils.VerboseRegExp)(_templateObject42())
}, {
  name: 'number',
  pattern: (0, _utils.VerboseRegExp)(_templateObject43())
}, {
  name: 'comment-multiline-begin',
  pattern: (0, _utils.VerboseRegExp)(_templateObject44()),
  inside: {
    name: 'comment comment-multiline',
    lexer: COMMENT_MULTILINE
  }
}]);
const OPERATORS = new _lexer.default([{
  name: 'keyword operator',
  pattern: (0, _utils.VerboseRegExp)(_templateObject45())
}]); // const JSX_EXPRESSIONS = new Lexer([
//   { include: OPERATORS },
//   { include: VALUES }
// ]);

const JAVASCRIPT = new _lexer.default([{
  name: 'keyword keyword-import',
  pattern: (0, _utils.VerboseRegExp)(_templateObject46()),
  inside: {
    name: 'import-statement',
    lexer: IMPORT
  }
}, {
  include: VALUES
}]);
var _default = JAVASCRIPT;
exports.default = _default;