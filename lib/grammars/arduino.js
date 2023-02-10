import e from"../grammar.js";import{b as t,c as a}from"../utils-be932c53.js";import{VerboseRegExp as n}from"../utils/verbose-regexp.js";import"../template.js";import"../context.js";let r=new e({"meta: parameter":{pattern:n`
      (?:\b|^)
      (
        (?:
          (?:[A-Za-z_$][\w\d]*)\s
        )*
      )                     # 1: variable type
      (\s*)                     # 2: whitespace
      ([a-zA-Z_$:][\w\d]*)      # 3: variable name
      (?=,|$)     # 4: end of parameter/signature
    `,captures:{1:()=>c,3:"variable variable-parameter"}}}),s=new e({escape:{pattern:/\\./}});const o=new e({"meta: function":{pattern:n`
      ([A-Za-z_$]\w*)   # 1: return type
      (\s+)             # 2: space
      ([a-zA-Z_$:]\w*)  # 3: function name
      (\s*)             # 4: space
      (\()              # 5: open parenthesis
      (.*)              # 6: raw params
      (\))              # 7: close parenthesis
      (\s*)             # 8: optional whitespace
      (?={)             # 9: open brace
    `,index(e){let a=t(e,")","(",{startIndex:e.indexOf("(")});return e.indexOf("{",a)-1},captures:{1:"storage storage-type storage-return-type",3:"entity",6:()=>r}},"meta: bare declaration":{pattern:n`
      \b([A-Za-z_$][\w\d]*) # 1: type
      (\s+)                 # 2: whitespace
      ([A-Za-z_$][\w\d]*)   # 3: identifier
      (\s*)                 # 4: optional whitespace
      (?=;)                 # followed by semicolon
    `,captures:{1:"storage storage-type",3:"variable"}},"meta: declaration with assignment":{pattern:n`
      \b([A-Za-z_$][\w\d]*) # 1: type
      (\s+)                 # 2: whitespace
      ([A-Za-z_$][\w\d]*)   # 3: identifier
      (\s*)                 # 4: optional whitespace
      (=)                   # 5: equals sign
    `,captures:{1:"storage storage-type",3:"variable",5:"operator"}},"meta: array declaration":{pattern:n`
      \b([A-Za-z_$][\w\d]*) # 1: type
      (\s+)                 # 2: whitespace
      ([A-Za-z_$][\w\d]*)   # 3: identifier
      (\[)                  # 4: open bracket
      (\d+)                 # 5: number
      (\])                  # 6: close bracket
    `,captures:{1:"storage storage-type",3:"variable",4:"punctuation",5:"number",6:"punctuation"}},"meta: declaration with parens":{pattern:n`
      \b([A-Za-z_$][\w\d]*) # 1: type
      (\s+)                 # 2: whitespace
      ([A-Za-z_$][\w\d]*)   # 3: identifier
      (\s*)                 # 4: optional whitespace
      (\()                  # 5: open paren
      ([\s\S]*)             # 6: arguments
      (\))                  # 7: close paren
      (;)                   # 8: semicolon
    `,index(e){let a=t(e,")","(")+1;return e.indexOf(";",a)},captures:{1:"storage storage-type",3:"variable",5:"punctuation",6:()=>p,7:"punctuation"}},"meta: class declaration":{pattern:n`
      \b(class|enum)            # 1: keyword
      (\s+)                     # 2: whitespace
      ([A-Za-z][A-Za-z0-9:_$]*) # 3: identifier
      (\s*)                     # 4: optional whitespace
      ({)                       # 5: opening brace
    `,captures:{1:"storage storage-type",3:"entity entity-class"}}}),p=new e({constant:{pattern:/\b[A-Z_]+\b/},lambda:{pattern:n`
      (\[\])     # 1: empty square brackets
      (\s*)      # 2: optional whitespace
      (\()       # 3: open paren
      ([\s\S]*)  # 4: parameters
      (\))       # 5: close paren
      (\s*)      # 6: optional whitespace
      ({)        # 7: opening brace
      ([\s\S]*)  # 8: lambda contents
      (})        # 9: closing brace
    `,index:e=>t(e,"}","{",{startIndex:e.indexOf("{")}),wrapReplacement:!0,captures:{1:"punctuation",3:"punctuation",4:()=>r,5:"punctuation",7:"punctuation",8:()=>u,9:"punctuation"}},"constant constant-boolean":{pattern:/\b(?:true|false)\b/},"string string-single-quoted":{pattern:/(')((?:[^'\\]|\\\\|\\')*)(')/,wrapReplacement:!0,captures:{2:()=>s}},"string string-double-quoted":{pattern:/(")((?:[^"\\]|\\[rnt]|\\\\|\\")*)(")/,wrapReplacement:!0,captures:{2:()=>s}},number:{pattern:/\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i}}),i=new e({comment:{pattern:/(\/\/[^\n]*(?=\n|$))|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/}}),c=new e({"storage storage-type":{pattern:/\b(?:u?int(?:8|16|36|64)_t|int|long|float|double|char(?:16|32)_t|char|class|bool|wchar_t|volatile|virtual|extern|mutable|const|unsigned|signed|static|struct|template|private|protected|public|mutable|volatile|namespace|struct|void|short|enum)/}}),l=new e({}).extend(i,p),d=new e({"macro macro-define":{pattern:n`
      ^(\#define)  # 1: define
      (\s+)        # 2: whitespace
      (\w+)        # 3: any token
      (.*?)$       # 4: any value
    `,replacement:a('\n      <span class="keyword keyword-macro">#{1}</span>#{2}\n      <span class="entity entity-macro">#{3}</span>\n      #{4}\n    '),captures:{1:"keyword keyword-macro",3:"entity entity-macro",4:()=>l}},"macro macro-include":{pattern:n`
      ^(\#include) # 1: include
      (\s+)        # 2: whitespace
      ("|<|&lt;)   # 3: punctuation
      (.*?)        # 4: import name
      ("|>|&gt;)   # 5: punctuation
      (?=\n|$)     # end of line
    `,replacement:a('\n      <span class="keyword keyword-macro">#{1}</span>#{2}\n      <span class="string string-include">\n        <span class="punctuation">#{3}</span>\n        #{4}\n        <span class="punctuation">#{5}</span>\n      </span>\n    ')},"macro macro-with-one-argument":{pattern:n`
      (\#(?:ifdef|ifndef|undef|if)) # 1: macro keyword
      (\s+)                         # 2: whitespace
      (\w+)                         # 3: token
    `,captures:{1:"keyword keyword-macro",3:"entity entity-macro"}},"macro macro-error":{pattern:/(#error)(\s*)(")(.*)(")/,replacement:a('\n      <span class="keyword keyword-macro">#{1}</span>\n      #{2}\n      <span class="string string-quoted">#{3}#{4}#{5}</span>\n    ')},"keyword keyword-macro":{pattern:/#(endif|else)/}}),u=new e("arduino",{"keyword keyword-control":{pattern:/\b(?:alignas|alignof|asm|auto|break|case|catch|compl|constexpr|const_cast|continue|decltype|default|delete|do|dynamic_cast|else|explicit|export|for|friend|goto|if|inline|new|noexcept|nullptr|operator|register|reinterpret_cast|return|sizeof|static_assert|static_cast|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|using|while)\b/},support:{pattern:/\b(?:printf|sprintf|strpos|strstr|strcat)/}}).extend(i,o);u.extend(d,p,c,{operator:{pattern:/--?|\+\+?|!=?|(?:<|&lt;){1,2}=?|(&gt;|>){1,2}=?|-(?:>|&gt;)|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|\|?|\?|\*|\/|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/}});export{u as default};
