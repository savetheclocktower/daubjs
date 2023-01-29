
import { Grammar, Utils } from '../daub';
const { balance, compact, VerboseRegExp } = Utils;

let PARAMETERS = new Grammar({
  'meta: parameter': {
    pattern: VerboseRegExp`
      (?:\b|^)
      (
        (?:
          (?:[A-Za-z_$][\w\d]*)\s
        )*
      )                     # 1: variable type
      (\s*)                     # 2: whitespace
      ([a-zA-Z_$:][\w\d]*)      # 3: variable name
      (?=,|$)     # 4: end of parameter/signature
    `,
    captures: {
      '1': () => STORAGE,
      '3': 'variable variable-parameter'
    }
  }
});

let ESCAPES = new Grammar({
  escape: {
    pattern: /\\./
  }
});

const DECLARATIONS = new Grammar({
  'meta: function': {
    pattern: VerboseRegExp`
      ([A-Za-z_$]\w*)   # 1: return type
      (\s+)             # 2: space
      ([a-zA-Z_$:]\w*)  # 3: function name
      (\s*)             # 4: space
      (\()              # 5: open parenthesis
      (.*)              # 6: raw params
      (\))              # 7: close parenthesis
      (\s*)             # 8: optional whitespace
      (?={)             # 9: open brace
    `,
    index (match) {
      let parenIndex = balance(
        match, ')', '(',
        { startIndex: match.indexOf('(') }
      );
      // Find the index just before the opening brace after the parentheses are
      // balanced.
      return match.indexOf('{', parenIndex) - 1;
    },
    // replacement: "<b>#{1}#{2}#{3}#{4}#{5}#{6}#{7}#{8}</b>",
    captures: {
      '1': 'storage storage-type storage-return-type',
      '3': 'entity',
      '6': () => PARAMETERS
    }
  },

  'meta: bare declaration': {
    pattern: VerboseRegExp`
      \b([A-Za-z_$][\w\d]*) # 1: type
      (\s+)                 # 2: whitespace
      ([A-Za-z_$][\w\d]*)   # 3: identifier
      (\s*)                 # 4: optional whitespace
      (?=;)                 # followed by semicolon
    `,
    captures: {
      '1': 'storage storage-type',
      '3': 'variable'
    }
  },

  'meta: declaration with assignment': {
    pattern: VerboseRegExp`
      \b([A-Za-z_$][\w\d]*) # 1: type
      (\s+)                 # 2: whitespace
      ([A-Za-z_$][\w\d]*)   # 3: identifier
      (\s*)                 # 4: optional whitespace
      (=)                   # 5: equals sign
    `,
    captures: {
      '1': 'storage storage-type',
      '3': 'variable',
      '5': 'operator'
    }
  },

  'meta: array declaration': {
    pattern: VerboseRegExp`
      \b([A-Za-z_$][\w\d]*) # 1: type
      (\s+)                 # 2: whitespace
      ([A-Za-z_$][\w\d]*)   # 3: identifier
      (\[)                  # 4: open bracket
      (\d+)                 # 5: number
      (\])                  # 6: close bracket
    `,
    captures: {
      '1': 'storage storage-type',
      '3': 'variable',
      '4': 'punctuation',
      '5': 'number',
      '6': 'punctuation'
    }
  },

  'meta: declaration with parens': {
    pattern: VerboseRegExp`
      \b([A-Za-z_$][\w\d]*) # 1: type
      (\s+)                 # 2: whitespace
      ([A-Za-z_$][\w\d]*)   # 3: identifier
      (\s*)                 # 4: optional whitespace
      (\()                  # 5: open paren
      ([\s\S]*)             # 6: arguments
      (\))                  # 7: close paren
      (;)                   # 8: semicolon
    `,

    index (match) {
      let balanceIndex = balance(match, ')', '(') + 1;
      return match.indexOf(';', balanceIndex);
    },
    captures: {
      '1': 'storage storage-type',
      '3': 'variable',
      '5': 'punctuation',
      '6': () => VALUES,
      '7': 'punctuation'
    }
  },

  'meta: class declaration': {
    pattern: VerboseRegExp`
      \b(class|enum)            # 1: keyword
      (\s+)                     # 2: whitespace
      ([A-Za-z][A-Za-z0-9:_$]*) # 3: identifier
      (\s*)                     # 4: optional whitespace
      ({)                       # 5: opening brace
    `,
    captures: {
      '1': 'storage storage-type',
      '3': 'entity entity-class'
    }
  }
});


const VALUES = new Grammar({
  'constant': {
    pattern: /\b[A-Z_]+\b/
  },

  'lambda': {
    pattern: VerboseRegExp`
      (\[\])     # 1: empty square brackets
      (\s*)      # 2: optional whitespace
      (\()       # 3: open paren
      ([\s\S]*)  # 4: parameters
      (\))       # 5: close paren
      (\s*)      # 6: optional whitespace
      ({)        # 7: opening brace
      ([\s\S]*)  # 8: lambda contents
      (})        # 9: closing brace
    `,
    index (match) {
      return balance(
        match, '}', '{',
        { startIndex: match.indexOf('{') }
      );
    },
    wrapReplacement: true,
    captures: {
      '1': 'punctuation',
      '3': 'punctuation',
      '4': () => PARAMETERS,
      '5': 'punctuation',
      '7': 'punctuation',
      '8': () => MAIN,
      '9': 'punctuation'
    }
  },

  'constant constant-boolean': {
    pattern: /\b(?:true|false)\b/
  },

  'string string-single-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-apostrophes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-apostrophe pair.
    pattern: /(')((?:[^'\\]|\\\\|\\')*)(')/,
    wrapReplacement: true,
    captures: {
      '2': () => ESCAPES
    }
  },

  'string string-double-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-quotes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-quote pair.
    pattern: /(")((?:[^"\\]|\\\\|\\")*)(")/,
    wrapReplacement: true,
    captures: {
      '2': () => ESCAPES
    }
  },

  'number': {
    pattern: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i
  }
});

const COMMENTS = new Grammar({
  comment: {
    pattern: /(\/\/[^\n]*(?=\n|$))|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
  }
});

const STORAGE = new Grammar({
  'storage storage-type': {
    pattern: /\b(?:u?int(?:8|16|36|64)_t|int|long|float|double|char(?:16|32)_t|char|class|bool|wchar_t|volatile|virtual|extern|mutable|const|unsigned|signed|static|struct|template|private|protected|public|mutable|volatile|namespace|struct|void|short|enum)/
  }
});

const MACRO_VALUES = new Grammar({}).extend(COMMENTS, VALUES);

const MACROS = new Grammar({
  'macro macro-define': {
    pattern: VerboseRegExp`
      ^(\#define)  # 1: define
      (\s+)        # 2: whitespace
      (\w+)        # 3: any token
      (.*?)$       # 4: any value
    `,
    replacement: compact(`
      <span class="keyword keyword-macro">#{1}</span>#{2}
      <span class="entity entity-macro">#{3}</span>
      #{4}
    `),
    captures: {
      '1': 'keyword keyword-macro',
      '3': 'entity entity-macro',
      '4': () => MACRO_VALUES
    }
  },
  'macro macro-include': {
    pattern: VerboseRegExp`
      ^(\#include) # 1: include
      (\s+)        # 2: whitespace
      ("|<|&lt;)   # 3: punctuation
      (.*?)        # 4: import name
      ("|>|&gt;)   # 5: punctuation
      (?=\n|$)     # end of line
    `,
    replacement: compact(`
      <span class="keyword keyword-macro">#{1}</span>#{2}
      <span class="string string-include">
        <span class="punctuation">#{3}</span>
        #{4}
        <span class="punctuation">#{5}</span>
      </span>
    `)
  },

  'macro macro-with-one-argument': {
    pattern: VerboseRegExp`
      (\#(?:ifdef|ifndef|undef|if)) # 1: macro keyword
      (\s+)                         # 2: whitespace
      (\w+)                         # 3: token
    `,
    captures: {
      '1': 'keyword keyword-macro',
      '3': 'entity entity-macro'
    }
  },

  'macro macro-error': {
    pattern: /(#error)(\s*)(")(.*)(")/,
    replacement: compact(`
      <span class="keyword keyword-macro">#{1}</span>
      #{2}
      <span class="string string-quoted">#{3}#{4}#{5}</span>
    `)
  },

  'keyword keyword-macro': {
    pattern: /#(endif|else)/
  }
});

const MAIN = new Grammar('arduino', {
  'keyword keyword-control': {
    pattern: /\b(?:alignas|alignof|asm|auto|break|case|catch|compl|constexpr|const_cast|continue|decltype|default|delete|do|dynamic_cast|else|explicit|export|for|friend|goto|if|inline|new|noexcept|nullptr|operator|register|reinterpret_cast|return|sizeof|static_assert|static_cast|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|using|while)\b/
  }
}).extend(COMMENTS, DECLARATIONS);

MAIN.extend(MACROS, VALUES, STORAGE, {
  'operator': {
    pattern: /--?|\+\+?|!=?|(?:<|&lt;){1,2}=?|(&gt;|>){1,2}=?|-(?:>|&gt;)|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|\|?|\?|\*|\/|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/
  }
});

export default MAIN;
