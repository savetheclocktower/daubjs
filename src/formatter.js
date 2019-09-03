
class Formatter {
  format () {
    throw "Implement in subclass!";
  }
}

class HTMLFormatter extends Formatter {
  format (tokens) {
    let output = [];
    for (let token of tokens) {
      output.push(this.formatToken(token));
    }
    return output.join('');
  }

  formatToken (token) {
    if (typeof token === 'string') {
      return [token];
    }
    let output = [];
    if (token.name) {
      output.push(`<span class="${token.name}">`);
    }
    if (typeof token.content === 'string') {
      output.push(token.content);
    } else {
      output.push(...token.content.map(t => this.formatToken(t)));
    }
    if (token.name) {
      output.push(`</span>`);
    }
    let result = output.join('');
    return result;
  }
}

export {
  HTMLFormatter
};
