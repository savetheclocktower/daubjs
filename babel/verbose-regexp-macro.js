/* eslint-env node */

const { VerboseRegExp } = require('../src/utils/verbose-regexp');

// A very small Babel plugin that invokes `VerboseRegExp` at compile time
// instead of at runtime. This is pretty silly, but it ends up saving me ~2k
// after gzipping.
//
// If it ever stops working for whatever reason, I can just disable it and
// fall back to runtime behavior.

function isOurs (path) {
  if (!path || !path.node || !path.node.tag) { return false; }
  return path.node.tag.name === 'VerboseRegExp';
}

function verboseRegExpPlugin (babel) {
  return {
    name: 'verbose-regexp',
    visitor: {
      TaggedTemplateExpression (path, state) {
        if (!isOurs(path)) { return; }
        handleReference(path, state, babel);
      }
    }
  };
}

function handleReference (path, state, babel) {
  let { types } = babel;
  let { quasi } = path.node;

  if (quasi.expressions && quasi.expressions.length > 0) {
    // We can't pre-compile any template strings that contain interpolations.
    // Return and let them get handled at runtime.
    return;
  }

  let escapedTemplateString = quasi.quasis[0].value.raw;

  // Build the arguments that `VerboseRegExp` expects.
  let str = { raw: [escapedTemplateString] };

  let pattern = VerboseRegExp(str);

  // `RegExpLiteral` expects a string.
  pattern = pattern.toString().slice(1, -1);

  path.get('quasi').parentPath.replaceWith(
    types.RegExpLiteral(pattern)
  );
}

module.exports = verboseRegExpPlugin;
