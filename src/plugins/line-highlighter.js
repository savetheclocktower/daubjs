
// LINE HIGHLIGHTER
// ================

// Allows you to highlight particular lines in your code blocks by annotating
// your `pre` or `code` with `data-lines` attributes.
//
// <pre data-lines="3">  (will highlight the third line)
//
// <pre data-lines="3,5"> (will highlight the third and fifth lines)
// <pre data-lines="3, 5-7, 10-12"> (you get the idea)
//
// The plugin will figure out the necessary plumbing CSS; all you need to do is
// style the class `daub-line-highlight` with a `background-color` of your
// choice. But make sure it's an `rgba` value with a low alpha; an opaque
// `background-color` will cover your code entirely.
//
//
// CAVEATS:
//
// * Ensure your preformatted lines are of a fixed height; don't do weird stuff
//   with font size such that your line-height can vary from line to line.
//
// * If you're also using the whitespace-normalizer plugin, make sure the
//   values in `data-lines` refer to the line numbers _after_ normalization, not
//   before.
//
function getLineHeight (el) {
  let style = getComputedStyle(el);
  return parseFloat(style.lineHeight);
}

function getTopOffset(code, pre) {
  let dummy = document.createElement('span');
  dummy.setAttribute('class', 'daub-line-highlight-dummy');
  dummy.setAttribute('aria-hidden', 'true');
  dummy.textContent = ' ';
  code.insertBefore(dummy, code.firstChild);

  let preRect = pre.getBoundingClientRect();
  let codeRect = dummy.getBoundingClientRect();
  let delta = preRect.top - codeRect.top;

  code.removeChild(dummy);

  return Math.abs(delta);
}

function handleAttribute(str) {
  if (!str) { return null; }
  function handleUnit (unit) {
    let result = {};
    if (unit.indexOf('-') > -1) {
      let [start, end] = unit.split('-').map((u) => Number(u));
      result.start = start;
      result.lines = end + 1 - start;
    } else {
      result.start = Number(unit);
      result.lines = 1;
    }
    return result;
  }

  let units = str.split(/,\s*/).map(handleUnit);
  return units;
}

function makeLine(range, lh, topOffset) {
  let span = document.createElement('mark');
  span.setAttribute('class', 'daub-line-highlight');
  span.setAttribute('aria-hidden', 'true');

  span.textContent = (new Array(range.lines).join('\n')) + ' ';
  let top = topOffset + ((range.start - 1) * lh) - 2;

  Object.assign(span.style, {
    position: 'absolute',
    top: top + 'px',
    left: '0',
    right: '0',
    lineHeight: 'inherit'
  });
  return span;
}

function handler (event) {
  let code = event.target;
  let pre = code.parentNode;
  let { fragment } = event.detail;

  let lineAttr = code.getAttribute('data-lines') || pre.getAttribute('data-lines');
  if (!lineAttr) { return; }
  let ranges = handleAttribute(lineAttr);
  if (!ranges) return;

  pre.style.position = 'relative';

  let lh = getLineHeight(code);
  let to = getTopOffset(code, pre);

  ranges.forEach((r) => {
    let span = makeLine(r, lh, to);
    fragment.appendChild(span);
  });
}

function init () {
  document.addEventListener('daub-will-highlight', handler);
  return cleanup;
}

function cleanup () {
  document.removeEventListener('daub-will-highlight', handler);
}

export default init;
