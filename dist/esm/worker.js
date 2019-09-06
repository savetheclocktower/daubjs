"use strict";

var _grammar = _interopRequireDefault(require("./grammar"));

var GRAMMARS = _interopRequireWildcard(require("./grammars"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env worker */
console.log('GRAMMARS:', _grammar.default.debug());

function postError(error) {
  postMessage({
    error
  });
}

onmessage = function onmessage(event) {
  console.log('[worker] Message:', event);
  let {
    type
  } = event.data;

  switch (type) {
    case 'parse':
      {
        let {
          language,
          text,
          id
        } = event.data;

        let grammar = _grammar.default.find(language);

        if (!grammar) {
          postError("No such grammar: ".concat(language));
          console.error("No such grammar: ".concat(language));
          return;
        }

        let source = grammar.parse(text);
        postMessage({
          id,
          language,
          source
        });
        break;
      }
  }
};