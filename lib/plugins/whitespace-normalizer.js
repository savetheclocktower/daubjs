// WHITESPACE NORMALIZER
// =====================
//
// Trims any leading and trailing newlines from inside of a `pre > code`
// element. This lets you write your HTML like this:
//
// <pre><code>
// function foo () {
//   return "bar";
// }
// </code></pre>
//
// Instead of this:
//
// <pre><code>function foo () {
//   return "bar";
// }</code></pre>
//
//
// This plugin is adapted from the excellent (MIT-licensed) Prism plugin:
// https://github.com/PrismJS/prism/tree/master/plugins/normalize-whitespace
// 

// Given a document fragment, find the first text node in the tree,
// depth-first, or `null` if none is found.
function findFirstTextNode (fragment) {
  let { childNodes: nodes } = fragment;
  if (nodes.length === 0) { return null; }
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    if (node.nodeType === Node.TEXT_NODE) { return node; }
    let descendant = findFirstTextNode(node);
    if (descendant) { return descendant; }
  }
  return null;
}

function findLastTextNode (fragment) {
  let { childNodes: nodes } = fragment;
  if (nodes.length === 0) { return null; }
  for (let i = nodes.length - 1; i >= 0; i--) {
    let node = nodes[i];
    if (node.nodeType === Node.TEXT_NODE) { return node; }
    let descendant = findFirstTextNode(node);
    if (descendant) { return descendant; }
  }

  return null;
}

function handler (event) {
  let { fragment } = event.detail;

  let firstTextNode = findFirstTextNode(fragment);
  if (firstTextNode) {
    let value = firstTextNode.nodeValue;
    if (value && value.match(/^(\s*\n)/)) {
      value = value.replace(/^(\s*\n)/, '');
    }

    firstTextNode.parentNode.replaceChild(
      document.createTextNode(value),
      firstTextNode
    );
  }

  let lastTextNode = findLastTextNode(fragment);
  if (lastTextNode) {
    let value = lastTextNode.nodeValue;
    if (value && value.match(/(\s*\n)+$/)) {
      value = value.replace(/(\s*\n)+$/, '');
    }

    lastTextNode.parentNode.replaceChild(
      document.createTextNode(value),
      lastTextNode
    );
  }
}

/**
 * A plugin that strips leading and trailing newlines from the contents of any
 * `code` element within a `pre` element.
 *
 * @alias whitespace-normalizer
 */
function init () {
  document.addEventListener('daub-will-highlight', handler);
  return cleanup;
}

function cleanup () {
  document.removeEventListener('daub-will-highlight', handler);
}

export { init as default };
