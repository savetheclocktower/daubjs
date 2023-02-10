import e from"../grammar.js";import{w as t,b as a}from"../utils-be932c53.js";import{VerboseRegExp as r}from"../utils/verbose-regexp.js";import"../template.js";import"../context.js";const n=new e({interpolation:{pattern:/\{(\d*)\}/},"escape escape-hex":{pattern:/\\x[0-9a-fA-F]{2}/},"escape escape-octal":{pattern:/\\[0-7]{3}/},escape:{pattern:/\\./}}),s=new e({lambda:{pattern:/(lambda)(\s+)(.*?)(:)/,captures:{1:"keyword storage",3:()=>p}},"string string-triple-quoted":{pattern:/"""[\s\S]*?"""/,before:(e,t)=>{e[0]=n.parse(e[0],t)}},"string string-raw string-single-quoted":{pattern:/([urb]+)(')(.*?[^\\]|[^\\]*)(')/,replacement:"<span class='storage string'>#{1}</span><span class='#{name}'>#{2}#{3}#{4}</span>",captures:{3:()=>n}},"string string-single-quoted":{pattern:/([ub])?(')((?:[^'\\]|\\.)*)(')/,replacement:"#{1}<span class='#{name}'>#{2}#{3}#{4}</span>",captures:{1:"storage string",3:()=>n}},"string string-double-quoted":{pattern:/([ub])?(")((?:[^"\\]|\\.)*)(")/,replacement:"#{1}<span class='#{name}'>#{2}#{3}#{4}</span>",captures:{1:"storage string",3:()=>n}},constant:{pattern:/\b(self|None|True|False)\b/,before(e,a){e[1]=t(e[1],`constant constant-${e[1].toLowerCase()}`)},replacement:"#{1}"},"constant constant-assignment":{pattern:/^([A-Z][A-Za-z\d_]*)(\s*)(?=\=)/,replacement:"<span class='#{name}'>#{1}</span>#{2}"},"constant constant-named":{pattern:/\b([A-Z_]+)(?!\.)\b/},"variable variable-assignment":{pattern:/([a-z_][[A-Za-z\d_]*)(\s*)(?=\=)/,replacement:"<span class='#{name}'>#{1}</span>#{2}"},number:{pattern:/(\b|-)((0(x|X)[0-9a-fA-F]+)|([0-9]+(\.[0-9]+)?))\b/},"number number-binary":{pattern:/0b[01]+/},"number number-octal":{pattern:/0o[0-7]+/}}),o=new e({"meta: parameter with default":{pattern:/(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*?)(?=,|$)/,captures:{2:"variable variable-parameter",3:"keyword punctuation",4:s}}}).extend(s),p=new e({"meta: parameter":{pattern:/(\s*)(\*\*?)?([A-Za-z0-9_]+)(?=,|$)/,captures:{2:"keyword operator",3:"variable variable-parameter"}}}),i=new e({"meta: parameter with default":{pattern:/(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*?)(?=,|$)/,captures:{2:"variable variable-parameter",3:"keyword punctuation",4:()=>s}}}).extend(p),c=new e("python",{"storage storage-type support":{pattern:/(int|float|bool|chr|str|bytes|list|dict|set)(?=\()/},"meta: exclude format method on strings":{pattern:/(\.)(format)\b/,captures:{}},"support support-builtin":{pattern:r`
      \b(?:
        abs|aiter|all|any|anext|ascii|bin|breakpoint|bytearray|
        callable|classmethod|compile|complex|delattr|dir|divmod|
        enumerate|eval|exec|filter|format|frozenset|getattr|globals|
        hasattr|hash|help|hex|id|input|isinstance|issubclass|iter|len|
        locals|map|max|memoryview|min|next|object|oct|open|ord|pow|
        print|property|range|repr|reversed|round|setattr|slice|sorted|
        staticmethod|sum|super|tuple|type|vars|zip|__import__
      )\b(?=\()
    `},"meta: from/import/as":{pattern:/(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(\s+)(as)(\s+)(.*?)(?=\n|$)/,captures:{1:"keyword",5:"keyword",9:"keyword"}},"meta: from/import":{pattern:/(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(?=\n|$)/,captures:{1:"keyword",5:"keyword"}},"meta: subclass":{pattern:/(class)(\s+)([\w\d_]+)(\()([\w\d_]*)(\))(\s*)(:)/,captures:{1:"keyword",3:"entity entity-class",4:"punctuation",5:"entity entity-class entity-superclass",6:"punctuation",8:"punctuation"}},"meta: class":{pattern:/(class)(\s+)([\w\d_]+)(:)/,captures:{1:"keyword",3:"entity entity-class",4:"punctuation"}},comment:{pattern:/#[^\n]*(?=\n)/},"keyword storage":{pattern:/\b(?:global|nonlocal)\b/},keyword:{pattern:/\b(?:if|else|elif|print|class|pass|from|import|raise|while|try|finally|except|return|for|in|del|with)\b/},"meta: method definition":{pattern:r`
      (def)             # 1: keyword
      (\s+)             # 2: space
      ([A-Za-z0-9_!?]+) # 3: method name
      (\s*)             # 4: space
      (\()              # 5: open paren
      (.*?)?            # 6: parameters (optional)
      (\))              # 7: close paren
    `,captures:{1:"keyword",3:"entity",5:"punctuation",6:i,7:"punctuation"}},"meta: method invocation":{pattern:r`
      ([A-Za-z0-9_!?]+)  # 1: method name
      (\s*)              # 2: optional space
      (\()               # 3: opening paren
      (\s*)              # 4: optional space
      ([\s\S]*)          # 5: inside parens (greedy)
      (\s*\))            # 6: closing paren
    `,index:e=>a(e,")","(",e.indexOf("(")),captures:{3:"punctuation",5:()=>o,6:"punctuation"}},"keyword operator operator-logical":{pattern:/\b(and|or|not)\b/},"keyword operator operator-bitwise":{pattern:/(?:&|\||~|\^|>>|<<)/},"keyword operator operator-assignment":{pattern:/=/},"keyword operator operator-comparison":{pattern:/(?:>=|<=|!=|==|>|<)/},"keyword operator operator-arithmetic":{pattern:/(?:\+=|\-=|=|\+|\-|%|\/\/|\/|\*\*|\*)/}});c.extend(s);export{c as default};
