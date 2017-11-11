let findBalancedTokenWithPattern = (token, pairPattern, string, startIndex, considerEscapes = true) => {
  let stackSize = 0;
  startIndex++;

  function regexToString (re) {
    let str = re.toString();
    str = str.replace(/^\//, '');
    str = str.replace(/\/[mgiy]*$/, '');
    return str;
  }

  let pattern = token + '|' + regexToString(pairPattern);
  if (considerEscapes) pattern = '(^\\\\)' + pattern;

  let combinedPattern = new RegExp(pattern);

  let match;
  let haystack = string.slice(startIndex);
  let index = startIndex;
  while ( match = haystack.match(combinedPattern) ) {
    let m = match[0];
    if (m === token) {
      if (stackSize === 0) {
        return startIndex + match.index;
      }
      stackSize--;
    } else {
      stackSize++;
    }
    haystack = haystack.slice(match.index);
  }
  return -1;

};