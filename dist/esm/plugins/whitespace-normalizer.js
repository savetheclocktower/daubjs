"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Given a document fragment, find the first text node in the tree,
// depth-first, or `null` if none is found.
function findFirstTextNode(fragment) {
  let {
    childNodes: nodes
  } = fragment;

  if (nodes.length === 0) {
    return null;
  }

  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];

    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }

    let descendant = findFirstTextNode(node);

    if (descendant) {
      return descendant;
    }
  }

  return null;
}

function findLastTextNode(fragment) {
  let {
    childNodes: nodes
  } = fragment;

  if (nodes.length === 0) {
    return null;
  }

  for (let i = nodes.length - 1; i >= 0; i--) {
    let node = nodes[i];

    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }

    let descendant = findFirstTextNode(node);

    if (descendant) {
      return descendant;
    }
  }

  return null;
} // eslint-disable-next-line no-unused-vars


function findAllTextNodes(fragment) {
  let walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT);
  let results = [];

  while (walker.nextNode()) {
    results.push(walker.currentNode);
  }

  return results;
}

function handler(event) {
  let {
    fragment
  } = event.detail;
  let firstTextNode = findFirstTextNode(fragment);

  if (firstTextNode) {
    let value = firstTextNode.nodeValue;

    if (value && value.match(/^(\s*\n)/)) {
      value = value.replace(/^(\s*\n)/, '');
    }

    firstTextNode.parentNode.replaceChild(document.createTextNode(value), firstTextNode);
  }

  let lastTextNode = findLastTextNode(fragment);

  if (lastTextNode) {
    let value = lastTextNode.nodeValue;

    if (value && value.match(/(\s*\n)+$/)) {
      value = value.replace(/(\s*\n)+$/, '');
    }

    lastTextNode.parentNode.replaceChild(document.createTextNode(value), lastTextNode);
  }
}

function init() {
  document.addEventListener('daub-will-highlight', handler);
}

function cleanup() {
  document.removeEventListener('daub-will-highlight', handler);
}

var _default = init;
exports.default = _default;