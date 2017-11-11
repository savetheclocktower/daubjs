// Some browsers round the line-height, others don't.
// We need to test for it to position the elements properly.
// let isLineHeightRounded = (function() {
//   let res;
//   return function() {
//     if (typeof res === 'undefined') {
//       var d = document.createElement('div');
//       d.style.fontSize = '13px';
//       d.style.lineHeight = '1.5';
//       d.style.padding = 0;
//       d.style.border = 0;
//       d.innerHTML = '&nbsp;<br />&nbsp;';
//       document.body.appendChild(d);
//       // Browsers that round the line-height should have offsetHeight === 38
//       // The others should have 39.
//       res = d.offsetHeight === 38;
//       document.body.removeChild(d);
//     }
//     return res;
//   };
// })();

function getLineHeight (el) {
  let style = window.getComputedStyle(el);
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

document.addEventListener('daub-will-highlight', (event) => {
  let code = event.target, pre = event.target.parentNode;
  let { fragment } = event.detail;

  let lineAttr = code.getAttribute('data-lines') ||
    pre.getAttribute('data-lines');
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
});
