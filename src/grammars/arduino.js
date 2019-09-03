
import { Grammar, Utils } from '../daub';
const { balance, compact, VerboseRegExp, wrap } = Utils;

let PARAMETERS = new Grammar({
  'parameter': {
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
    replacement: compact(`
      <span class="parameter">
        <span class="storage storage-type">#{1}</span>
        #{2}
        <span class="variable">#{3}</span>
      </span>
    `),
    before: r => {
      r[1] = STORAGE.parse(r[1]);
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
      ([A-Za-z_$]\w*) # 1: return type
      (\s+)             # 2: space
      ([a-zA-Z_$:]\w*)  # 3: function name
      (\s*)             # 4: space
      (\()              # 5: open parenthesis
      (.*)             # 6: raw params
      (\))              # 7: close parenthesis
      (\s*)             # 8: optional whitespace
      (?={)               # 9: open brace
    `,
    index: match => {
      let parenIndex = balance(
        match, ')', '(', { startIndex: match.indexOf('(') }
      );
      // Find the index just before the opening brace after the parentheses are balanced.
      return match.indexOf('{', parenIndex) - 1;
    },
    replacement: "<b><span class='storage storage-type storage-return-type'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}#{8}</b>",
    before (r, context) {
      if (r[3]) r[3] = wrap(r[3], 'entity');
      // console.log('about to parse for params:', r[6]);
      r[6] = PARAMETERS.parse(r[6], context);
      return r;
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

    replacement: compact(`
      <span class="storage storage-type">#{1}</span>
      #{2}
      <span class="variable">#{3}</span>
      #{4}
    `)
  },

  'meta: declaration with assignment': {
    pattern: VerboseRegExp`
      \b([A-Za-z_$][\w\d]*) # 1: type
      (\s+)                 # 2: whitespace
      ([A-Za-z_$][\w\d]*)   # 3: identifier
      (\s*)                 # 4: optional whitespace
      (=)                   # 5: equals sign
    `,
    replacement: compact(`
      <span class="storage storage-type">#{1}</span>
      #{2}
      <span class="variable">#{3}</span>
      #{4}
      <span class="operator">#{5}</span>
    `)
  },

  'meta: array declaration': {
    pattern: VerboseRegExp`
      \b([A-Za-z_$][\w\d]*) # 1: type
      (\s+)                 # 2: whitespace
      ([A-Za-z_$][\w\d]*)   # 3: identifier
      (\[)                   # 4: open bracket
      (\d+)                 # 5: number
      (\])                   # 6: close bracket
    `,

    replacement: compact(`
      <span class="storage storage-type">#{1}</span>
      #{2}
      <span class="variable">#{3}</span>
      <span class="punctuation">#{4}</span>
      <span class="number">#{5}</span>
      <span class="punctuation">#{6}</span>
    `)
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

    index: match => {
      let balanceIndex = balance(match, ')', '(') + 1;
      let index = match.indexOf(';', balanceIndex);
      return index;
    },
    replacement: compact(`
      <span class="storage storage-type">#{1}</span>
      #{2}
      <span class="variable">#{3}</span>
      #{4}
      <span class="punctuation">#{5}</span>
      #{6}
      <span class="punctuation">#{7}</span>
      #{8}
    `),

    before: (r, context) => {
      r[6] = VALUES.parse(r[6], context);
    }
  },

  'meta: class declaration': {
    pattern: VerboseRegExp`
      \b(class|enum)                # 1: keyword
      (\s+)                    # 2: whitespace
      ([A-Za-z][A-Za-z0-9:_$]*) # 3: identifier
      (\s*)                    # 4: optional whitespace
      ({)                      # 5: opening brace
    `,
    replacement: compact(`
      <span class="storage storage-type">#{1}</span>
      #{2}
      <span class="entity entity-class">#{3}</span>
      #{4}#{5}
    `)
  }
});


const VALUES = new Grammar({
  'constant': {
    pattern: /\b[A-Z_]+\b/
  },

  'meta: lambda': {
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
    index: match => {
      return balance(
        match, '}', '{', { startIndex: match.indexOf('{') }
      );
    },
    replacement: compact(`
      <span class="lambda">
        <span class="punctuation">#{1}</span>#{2}
        <span class="punctuation">#{3}</span>
        #{4}
        <span class="punctuation">#{5}</span>
        #{6}
        <span class="punctuation">#{7}</span>
        #{8}
        <span class="punctuation">#{9}</span>
      </span>
    `),
    before: (r, context) => {
      r[4] = PARAMETERS.parse(r[4], context);
      r[8] = MAIN.parse(r[8], context);
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
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      r[2] = ESCAPES.parse(r[2], context);
    }
  },

  'string string-double-quoted': {
    // In capture group 2 we want zero or more of:
    // * any non-quotes and non-backslashes OR
    // * an even number of consecutive backslashes OR
    // * any backslash-plus-quote pair.
    pattern: /(")((?:[^"\\]|\\\\|\\")*)(")/,
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      r[2] = ESCAPES.parse(r[2], context);
    },
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

    before: (r, context) => {
      r[4] = MACRO_VALUES.parse(r[4], context);
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
      (\s+)                     # 2: whitespace
      (\w+)                     # 3: token
    `,
    replacement: compact(`
      <span class="keyword keyword-macro">#{1}</span>
      #{2}
      <span class="entity entity-macro">#{3}</span>
    `)
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
