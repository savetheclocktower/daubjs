"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Context", {
  enumerable: true,
  get: function get() {
    return _context.default;
  }
});
Object.defineProperty(exports, "Grammar", {
  enumerable: true,
  get: function get() {
    return _grammar.default;
  }
});
Object.defineProperty(exports, "Highlighter", {
  enumerable: true,
  get: function get() {
    return _highlighter.default;
  }
});
Object.defineProperty(exports, "AsyncHighlighter", {
  enumerable: true,
  get: function get() {
    return _highlighter.AsyncHighlighter;
  }
});
Object.defineProperty(exports, "Lexer", {
  enumerable: true,
  get: function get() {
    return _lexer.default;
  }
});
exports.Utils = void 0;

var Utils = _interopRequireWildcard(require("./utils"));

exports.Utils = Utils;

var _context = _interopRequireDefault(require("./context"));

var _grammar = _interopRequireDefault(require("./grammar"));

var _highlighter = _interopRequireWildcard(require("./highlighter"));

var _lexer = _interopRequireDefault(require("./lexer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }