(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

// Given a document fragment, find the first text node in the tree,
// depth-first, or `null` if none is found.
function findFirstTextNode(fragment) {
  var nodes = fragment.childNodes;

  if (nodes.length === 0) {
    return null;
  }
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }
    var descendant = findFirstTextNode(node);
    if (descendant) {
      return descendant;
    }
  }
  return null;
}

function findLastTextNode(fragment) {
  var nodes = fragment.childNodes;

  if (nodes.length === 0) {
    return null;
  }
  for (var i = nodes.length - 1; i >= 0; i--) {
    var node = nodes[i];
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }
    var descendant = findFirstTextNode(node);
    if (descendant) {
      return descendant;
    }
  }

  return null;
}

document.addEventListener('daub-will-highlight', function (event) {
  var fragment = event.detail.fragment;


  var firstTextNode = findFirstTextNode(fragment);
  if (firstTextNode) {
    var value = firstTextNode.nodeValue;
    if (value && value.match(/^(\s*\n)/)) {
      value = value.replace(/^(\s*\n)/, '');
    }

    firstTextNode.parentNode.replaceChild(document.createTextNode(value), firstTextNode);
  }

  var lastTextNode = findLastTextNode(fragment);
  if (lastTextNode) {
    var _value = lastTextNode.nodeValue;
    if (_value && _value.match(/(\s*\n)+$/)) {
      _value = _value.replace(/(\s*\n)+$/, '');
    }

    lastTextNode.parentNode.replaceChild(document.createTextNode(_value), lastTextNode);
  }
});

})));
