(function(Prism) {
  var javascript = Prism.util.clone(Prism.languages.javascript);

  Prism.languages.jsx = Prism.languages.extend('markup', javascript);
  Prism.languages.jsx.tag.pattern= /<\/?(?:[\w.:-]+\s*(?:\s+(?:[\w.:-]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s{'">=]+|\{(?:\{(?:\{[^}]*\}|[^{}])*\}|[^{}])+\}))?|\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}))*\s*\/?)?>/i;

  Prism.languages.jsx.tag.inside['tag-start'].pattern = /^<\/?[^\s>\/]*/i;
  Prism.languages.jsx.tag.inside['attr-value'].pattern = /=(?!\{)(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">]+)/i;
  Prism.languages.jsx.tag.inside['tag-start'].inside['class-name'] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
  Prism.languages.jsx.tag.inside['tag-start'].inside['tag-name'] = /^[a-z][a-z\-]*$/;



  Prism.languages.insertBefore('inside', 'attr-name', {
    'spread': {
      pattern: /\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}/,
      inside: {
        'punctuation': /\.{3}|[{}.]/,
        'attr-value': /\w+/
      }
    }
  }, Prism.languages.jsx.tag);

  Prism.languages.insertBefore('inside', 'attr-value', {
    'script': {
      // Allow for two levels of nesting
      pattern: /=(\{(?:\{(?:\{[^}]*\}|[^}])*\}|[^}])+\})/i,
      inside: {
        'script-punctuation': {
          pattern: /^=(?={)/,
          alias: 'punctuation'
        },
        rest: Prism.languages.jsx
      },
      'alias': 'attr-value attr-value-embedded language-javascript'
    }
  }, Prism.languages.jsx.tag);

  // The following will handle plain text inside tags
  var stringifyToken = function (token) {
    if (!token) {
      return '';
    }
    if (typeof token === 'string') {
      return token;
    }
    if (typeof token.content === 'string') {
      return token.content;
    }
    return token.content.map(stringifyToken).join('');
  };

  var visitTokenContent = function (token, callback) {
    var content = token.content;
    if (typeof content === 'string' || !content.length) { return; }
    for (var i = 0; i < content.length; i++) {
      callback(content[i], i);
    }
  };

  var replaceContent = function (content, indices, transformer) {
    let slice = content.slice(indices.start, indices.end + 1);
    let plainText = slice.reduce(function (str, item) {
      return str + stringifyToken(item);
    }, '');
    let replacement = transformer(slice, plainText);
    content.splice(
      indices.start,
      (indices.end + 1) - indices.start,
      replacement
    );
  };

  var TOKEN_HANDLERS = {
    'attr-value': function (token) {
      let stringIndices = {};
      let delimiterCharacter = null;
      let separatorIndex;
      visitTokenContent(token, function (t, index) {
        if (t.content === '=') {
          t.type += ' attr-value-separator';
          separatorIndex = index;
        }
        if (index === separatorIndex + 1 && (/^(?:"|')$/).test(t.content)) {
          // Opening quote.
          stringIndices.start = index;
          delimiterCharacter = t.content;
          t.type += ' attr-value-delimiter';
        }
        if (index === token.content.length - 1 && t.content === delimiterCharacter) {
          stringIndices.end = index;
          t.type += ' attr-value-delimiter';
        }
      });
      if (typeof stringIndices.start === 'number' && typeof stringIndices.end === 'number') {
        replaceContent(
          token.content,
          stringIndices,
          function (slice, plainText) {
            return new Prism.Token(
              'string',
              slice,
              undefined,
              plainText,
              false
            );
          }
        );
      }
    },
    'script': function (token) {
      console.log('HANDLER for attr-value-embedded');
      let indices = {};
      let separatorIndex;
      visitTokenContent(token, function (t, index) {
        if (t.content === '=') {
          t.type += ' attr-value-separator';
          separatorIndex = index;
        }
        if (index === separatorIndex + 1 && t.content === '{') {
          // Opening brace.
          indices.start = index;
        }
        if (index === token.content.length - 1 && t.content === '}') {
          indices.end = index;
        }
      });
      console.log('indices:', indices);

      replaceContent(
        token.content,
        indices,
        function (slice, plainText) {
          return new Prism.Token('embedded', slice, undefined, plainText, false);
        }
      );
    },
    'destructuring': function (token) {
      token.content.forEach(function (t, index) {
        if (typeof t === 'string') {
          var nextToken = token.content[index + 1];
          if (!nextToken || !nextToken.content) { return; }
          if (nextToken.content.match(/,|:|}|]|=/)) {
            // Replace this string with a variable token.
            token.content[index] = new Prism.Token(
              'variable',
              t,
              undefined,
              t,
              false
            );
          }
        }
      });
    }
  };

  var handleToken = function (token) {
    if (typeof token === 'string') { return; }
    let handler = TOKEN_HANDLERS[token.type];
    if (!handler) { return; }
    handler(token);
  };

  var PAIRED = { '{': '}', '[': ']' };

  var getNextTokenIndex = function (tokens, index) {
    index++;
    while (index < tokens.length) {
      if (typeof tokens[index] !== 'string') {
        return index;
      }
      index++;
    }
    return null;
  };

  var walkTokens = function (tokens) {
    var openedTags = [];
    var interpolationIndices = [];
    var interpolationIndexObj = {};
    var destructuringIndices = [];
    var destructuringClosingPunctuation = null;
    var destructuringIndexObj = {};
    var token;
    var notTagNorBrace;
    var nextToken;
    var nextTokenIndex;

    for (var i = 0; i < tokens.length; i++) {
      token = tokens[i];
      notTagNorBrace = false;

      if (typeof token !== 'string') {
        // First handle variable declarations; they might need destructuring.
        if (token.type.includes('storage-declaration')) {
          nextTokenIndex = getNextTokenIndex(tokens, i);
          if (!nextTokenIndex) { continue; }
          nextToken = tokens[nextTokenIndex];
          console.log('candidate?', token, nextToken);
          if (nextToken.content === '{' || nextToken.content === '[') {
            console.log('AHA!');
            // A destructuring is about to begin!
            destructuringIndexObj.start = i + 1;
            destructuringClosingPunctuation = PAIRED[nextToken.content];
            nextToken.type += ' destructuring-start';
          }
        } else if (token.type === 'punctuation' && token.content === destructuringClosingPunctuation) {
          token.type += ' destructuring-end';
          destructuringIndexObj.end = i;
          destructuringIndices.push(destructuringIndexObj);
          destructuringClosingPunctuation = null;
          destructuringIndexObj = {};
        };

        if (token.type === 'tag' && token.content[0] && token.content[0].type === 'tag-start') {
          // We found a tag, now find its kind

          if (token.content[0].content[0].content === '</') {
            // Closing tag
            if (openedTags.length > 0 && openedTags[openedTags.length - 1].tagName === stringifyToken(token.content[0].content[1])) {
              // Pop matching opening tag
              openedTags.pop();
            }
          } else {
            if (token.content[token.content.length - 1].content === '/>') {
              // Autoclosed tag, ignore
            } else {
              // Opening tag
              openedTags.push({
                tagName: stringifyToken(token.content[0].content[1]),
                openedBraces: 0
              });
            }
          }
        } else if (openedTags.length > 0 && token.type === 'punctuation' && token.content === '{') {
          interpolationIndexObj.start = i;
          token.type = 'punctuation interpolation-open';

          // Here we might have entered a JSX context inside a tag
          openedTags[openedTags.length - 1].openedBraces++;

        } else if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces > 0 && token.type === 'punctuation' && token.content === '}') {
          if (typeof interpolationIndexObj.start === 'number') {
            interpolationIndexObj.end = i;
            interpolationIndices.push(interpolationIndexObj);
            interpolationIndexObj = {};
          }
          token.type = 'punctuation interpolation-close';
          // Here we might have left a JSX context inside a tag
          openedTags[openedTags.length - 1].openedBraces--;
        } else {
          notTagNorBrace = true;
        }
      }
      if (notTagNorBrace || typeof token === 'string') {
        if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces === 0) {
          // Here we are inside a tag, and not inside a JSX context.
          // That's plain text: drop any tokens matched.
          var plainText = stringifyToken(token);

          // And merge text with adjacent text
          if (i < tokens.length - 1 && (typeof tokens[i + 1] === 'string' || tokens[i + 1].type === 'plain-text')) {
            plainText += stringifyToken(tokens[i + 1]);
            tokens.splice(i + 1, 1);
          }
          if (i > 0 && (typeof tokens[i - 1] === 'string' || tokens[i - 1].type === 'plain-text')) {
            plainText = stringifyToken(tokens[i - 1]) + plainText;
            tokens.splice(i - 1, 1);
            i--;
          }

          tokens[i] = new Prism.Token('plain-text', plainText, null, plainText);
        }
      }

      if (token.content && typeof token.content !== 'string') {
        handleToken(token);
        walkTokens(token.content);
      }
    }

    var pair;
    for (var k = destructuringIndices.length - 1; k >= 0; k--) {
      if (k === -1) { break; }
      pair = destructuringIndices[k];
      replaceContent(tokens, pair, (slice, plainText) => {
        let token = new Prism.Token('destructuring', slice, undefined, plainText, false);
        // TODO: Traverse it.
        handleToken(token);
        return token;
      });
    }
    for (var j = interpolationIndices.length - 1; j >= 0; j--) {
      if (j === -1) { break; }
      pair = interpolationIndices[j];
      replaceContent(tokens, pair, (slice, plainText) => {
        let token = new Prism.Token('embedded', slice, undefined, plainText, false);
        handleToken(token);
        return token;
      });
    }
  };

  Prism.hooks.add('after-tokenize', function (env) {
    if (env.language !== 'jsx' && env.language !== 'tsx') {
      return;
    }
    console.log('TOKENS:', env.tokens);

    walkTokens(env.tokens);
  });

}(Prism));
