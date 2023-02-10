import e from"../grammar.js";import{s as t,d as n,a,c as r,w as i,b as s}from"../utils-be932c53.js";import o from"../lexer.js";import{VerboseRegExp as p}from"../utils/verbose-regexp.js";import"../template.js";import"../context.js";const l=new o([{name:"string-escape",pattern:/\\./},{name:"string-end",pattern:/('|")/,test:(e,t,n)=>{let a=n.get("string-begin");return e[1]===a&&(n.set("string-begin",null),e)},final:!0}],"string",{scopes:"string"}),c=new o([{name:"exclude escaped punctuation",pattern:/\\\{/,raw:!0},{name:"punctuation",pattern:/\{/,inside:{name:"inside-brace",lexer:()=>c}},{name:"punctuation",pattern:/\}/,final:!0}],"balance-braces"),d=new o([{name:"exclude escaped punctuation",pattern:/\\\{/,raw:!0},{name:"punctuation",pattern:/\{/,inside:{name:"inside-brace",lexer:c}},{name:"exclude escaped closing brace",pattern:/\\\}/,raw:!0},{name:"punctuation interpolation-end",pattern:/\}/,final:!0}],"template-string-interpolation"),u=new o([{name:"interpolation-start",pattern:/(\$\{)/,inside:{name:"interpolation",lexer:d},final:!0}],"template-string-interpolation-start"),m=new o([{name:"interpolation-start",pattern:/(\$\{)/,inside:{name:"interpolation",lexer:d}},{name:"exclude escaped backtick",pattern:/\\\x60/,raw:!0},{name:"string-end",pattern:/\x60/,final:!0}],"template-string"),g=new o([{name:"string-start",pattern:/\x60/,final:!0,after:{name:"string string-template",lexer:m}}],"template-string-start"),w=new o([{name:"punctuation interpolation-begin",pattern:/\{/,inside:{lexer:c}},{name:"exclude escaped closing brace",pattern:/\\\}/,raw:!0},{name:"string-begin",pattern:/^\s*('|")/,win(e,t,n){n.set("string-begin",e[1])},inside:{name:"string",lexer:l}},{name:"template-string-begin",pattern:/\x60/,inside:{name:"template-string",lexer:m}},{name:"punctuation interpolation-end",pattern:/\}/,final:!0}],"jsx-interpolation",{highlight:(e,n)=>{let a=e.pop(),r=t(e);return[P.parse(r,n),a]},scopes:"embedded jsx-interpolation"}),f=new o([{name:"punctuation interpolation-begin",pattern:/^\{/,inside:{name:"interpolation",lexer:w}}],"before-jsx-interpolation"),b=new o([{name:"punctuation interpolation-begin",pattern:/^\{/,inside:{name:"interpolation",lexer:w},final:!0},{name:"string-begin",pattern:/^\s*('|")/,win(e,t,n){n.set("string-begin",e[1])},inside:{name:"string",lexer:l}}],"attribute-value"),x=new o([{name:"punctuation",pattern:/^=/,after:{name:"attribute-value",lexer:b}}],"attribute-separator"),y=new o([{name:"tag HTML",scopes:"tag tag-html",pattern:/^[a-z]+(?=&gt;|>)/},{name:"tag JSX",scopes:"tag tag-jsx",pattern:/^[A-Z][A-Za-z0-9_$\.]*(?=&gt;|>)/},{name:"punctuation",pattern:/^\s*(?:>|&gt;)/,win(e,t,n){let a=n.get("jsx-tag-depth");if(a<1)throw new Error("Depth error!");a--,n.set("jsx-tag-depth",a)},trim:!0,final:!0}],"jsx-closing-tag",{scopes:"jsx-element element element-closing"}),h=new o([{name:"punctuation interpolation-begin",pattern:/^\s*\{/,inside:{name:"interpolation",lexer:w},trim:!0},{name:"attribute-name",pattern:/^\s*[a-zA-Z][a-zA-Z0-9_$-]+(?=\=)/,after:{name:"attribute-separator",lexer:x},trim:!0},{name:"attribute-name",pattern:/^\s*[a-zA-Z][a-zA-Z0-9_$-]+(?=\s)/,trim:!0},{name:"punctuation punctuation-self-closing",pattern:/^\s*\/(?:>|&gt;)/,win(e,t,n){n.set("is-opening-tag",null)},trim:!0,final:e=>e.get("is-root")},{name:"punctuation",pattern:/^\s*(>|&gt;)/,test(e,t,n){let a=n.get("jsx-tag-depth");return a+=n.get("is-opening-tag")?1:-1,0!==a},win(e,t,n){let a=n.get("jsx-tag-depth");return a+=n.get("is-opening-tag")?1:-1,n.set("jsx-tag-depth",a),n.set("is-opening-tag",null),e},trim:!0,final:e=>{let t=e.get("jsx-tag-depth");return e.get("only-opening-tag")||0===t},skipSubRulesIfFinal:!0,after:{name:"jsx-contents",lexer:()=>k}}],"inside-tag"),k=new o([{name:"punctuation",pattern:/^\s*(?:<|&lt;)(?!\/)/,trim:!0,after:{name:"tag",lexer:()=>$}},{name:"punctuation",pattern:/(?:<|&lt;)\/(?=[A-Za-z])/,inside:{name:"element jsx-element",lexer:y},final:!0},{name:"punctuation interpolation-begin",pattern:/\{/,inside:{name:"interpolation",lexer:w}}],"within-tag"),$=new o([{name:"tag tag-html",pattern:/^[a-z\-]+(?=\s|(?:>|&gt;))/,test:(e,t,n)=>(n.set("is-opening-tag",!0),"number"!=typeof n.get("jsx-tag-depth")&&n.set("jsx-tag-depth",0),e),trim:!0,after:{name:"jsx-tag-contents",lexer:h},final:e=>e.get("only-opening-tag")},{name:"tag tag-jsx",pattern:/^[A-Z][\w\d$\.]*(?=\s|(?:>|&gt;))/,test:(e,t,n)=>(n.set("is-opening-tag",!0),"number"!=typeof n.get("jsx-tag-depth")&&n.set("jsx-tag-depth",0),e),after:{name:"jsx-tag-contents",lexer:h}}],"tag-name"),v=new o([{name:"punctuation",pattern:/^\s*(?:<|&lt;)(?!\/)/,test:(e,t,n)=>(n.set("only-opening-tag",!0),e),trim:!0,after:{name:"tag",lexer:$,silent:!0},final:!0}],"tag-open-start"),j=new o([{name:"punctuation",pattern:/^\s*(?:<|&lt;)(?!\/)/,test:(e,t,n)=>(n.set("is-root",!0),e),trim:!0,after:{name:"tag",lexer:$,silent:!0}}],"tag-root",{scopes:"jsx-element element element-opening"});let A=new e({escape:{pattern:/\\./}}),Z=new e({escape:{pattern:/\\./},"exclude from group begin":{pattern:/(\\\()/,replacement:"#{1}"},"group-begin":{pattern:/(\()/,replacement:'<b class="group">#{1}'},"group-end":{pattern:/(\))/,replacement:"#{1}</b>"}}),z=new e({interpolation:{pattern:/(\$\{)(.*)(\})/,index:(e,t)=>n(e,u,t),captures:{1:"punctuation interpolation-start",2:()=>P,3:"punctuation interpolation-end"},wrapReplacement:!0}}).extend(A);const _=new e({"meta: parameter with default":{pattern:/([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,captures:{1:"variable parameter",2:"keyword operator",3:()=>F}},"keyword operator":{pattern:/\.{3}/},operator:{pattern:/=/},"variable variable-parameter":{pattern:/[A-Za-z$_][$_A-Za-z0-9_]*/}});let R=new e({"string string-template":{pattern:/(`)([\s\S]*)(`)/,index:(e,t)=>n(e,g,t),captures:{1:"punctuation string-start",2:z,3:"punctuation string-end"},wrapReplacement:!0},"string string-single-quoted":{pattern:/(')((?:[^'\\]|\\\\|\\.)*)(')/,replacement:"<span class='#{name}'>#{1}#{2}#{3}</span>",captures:{2:A}},"string string-double-quoted":{pattern:/(")((?:[^"\\]|\\\\|\\.)*)(")/,captures:{2:A},wrapReplacement:!0}}),S=new e({"embedded jsx-interpolation":{pattern:/(\{)([\s\S]*)(\})/,index:e=>n(e,f),captures:{1:"punctuation embedded-start",2:()=>P,3:"punctuation embedded-end"},wrapReplacement:!0}}),q=new e({string:{pattern:/('[^']*[^\\]'|"[^"]*[^\\]")/},attribute:{pattern:/\b([a-zA-Z-:]+)(=)/,captures:{1:"attribute-name",2:"punctuation"},wrapReplacement:!0}}).extend(S),E=new e({});E.extend(q),E.extend(S),E.extend({"punctuation punctuation-tag-close":{pattern:/>|\/>/}});let I=new e({jsx:{pattern:p`
      (<|&lt;) # opening angle bracket
      ([a-zA-Z_$][a-zA-Z0-9_$\.]*\s*) # any valid identifier as a tag name
      ([\s\S]*) # middle-of-tag content (will be parsed later)
      (&gt;|>)
    `,index:(e,t)=>{let{index:n,highlighted:r}=a(e,j,t);return t.set("lexer-highlighted",r),n},replacement:"<span class='jsx'>#{0}</span>",after:(e,t)=>t&&t.get("lexer-highlighted")||e}});function O(e){return e.match(/^[A-Z]/)?i(e,"tag tag-jsx"):i(e,"tag tag-html")}let H=new e({"meta: opening tag without attributes":{pattern:p`
      (<|&lt;) # 1: opening angle bracket
      ([\w$][\w\d$\.]*) # 2: any valid identifier as a tag name
      (&gt;|>) # 3: closing bracket
    `,replacement:r("\n      <span class='jsx-element element element-opening'>\n        <span class='punctuation'>#{1}</span>\n        #{2}\n        <span class='punctuation'>#{3}</span>\n      </span>\n    "),before(e,t){e[2]=O(e[2])}},"tag tag-open":{pattern:p`
      (<|&lt;) # 1: opening angle bracket
      ([\w$][\w\d$\.]*) # 2: any valid identifier as a tag name
      (\s+) # 3: space after the tag name
      ([\s\S]*) # 4: middle-of-tag content (will be parsed later)
      (.) # 5: the last character before the closing bracket
      (&gt;|>)
    `,replacement:r("\n      <span class='#{name}'>\n        <span class='punctuation'>#{1}</span>\n        #{2}#{3}#{4}#{5}\n        <span class='punctuation'>#{6}</span>\n      </span>\n    "),index:e=>n(e,v),before(e,t){e.name="jsx-element element element-opening",e[2]=O(e[2]),e[5]&&("/"===e[5]?(e.name=e.name.replace("element-opening","element-self"),e[5]=i(e[5],"punctuation")):(e[4]+=e[5],e[5]="")),e[4]=q.parse(e[4],t)}},"tag tag-close":{pattern:p`
      ((?:<|&lt;)\/) # 1: opening angle bracket and slash
      ([\w$][\w\d_$\.]*) # 2: any valid identifier as a tag name
      (\s*) # 3: optional space
      (&gt;|>) # 4: closing angle bracket
    `,before(e,t){e[2]=O(e[2])},replacement:r("\n      <span class='jsx-element element element-closing'>\n        <span class='punctuation'>#{1}</span>\n        #{2}#{3}\n        <span class='punctuation'>#{4}</span>\n      </span>\n    ")}});new e({}).extend(S,H);let T=new e({params:{pattern:p`
      (\()    # 1: opening paren
      ([^)]+) # 2: contents of params
      (\))    # 3: closing paren
    `,wrapReplacement:!0,captures:{1:"punctuation",2:_,3:"punctuation"}},"variable variable-parameter":{pattern:/[\w$][\w\d_$]*/}}),D=new e({"meta: single-parameter multiline arrow function":{pattern:p`
      ([\w$][\w\d$]*) # any single identifier
      (\s*)           # optional space
      (=(?:>|&gt;))   # arrow function operator!
    `,captures:{1:T,3:"operator"}},"meta: arrow function with params in parentheses":{pattern:p`
      (       # 1:
        \(    # optional opening paren
        [^)]+ # contents of params
        \)    # optional closing paren
      )
      (\s*)         # 2: optional space
      (=(?:>|&gt;)) # arrow function operator!
    `,captures:{1:T,3:"operator"}},"single line arrow function":{pattern:p`
      ( # EITHER:
        \(? # optional opening paren
        [^)] # contents of params
        \)? # optional closing paren
        | # OR:
       [a-zA-Z_$][a-zA-Z0-9_$]* # any single identifier
      )
      (\s*) # optional space
      (=(?:>|&gt;)) # arrow function operator!
      (\s*) # optional space
    `,captures:{1:T,3:"operator"}}}),F=new e({});F.extend({constant:{pattern:/\b(?:arguments|this|false|true|super|null|undefined)\b/},"number number-binary-or-octal":{pattern:/0[bo]\d+/},number:{pattern:/(?:\d*\.?\d+)/}}),F.extend(D),F.extend(R),F.extend({comment:{pattern:/(\/\/[^\n]*(?=\n|$))|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/},regexp:{pattern:/(\/)(.*?[^\\])(\/)([mgiy]*)/,captures:{2:Z,4:"keyword regexp-flags"},wrapReplacement:!0}});let J=new e({alias:{pattern:/([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,captures:{1:"entity"}},variable:{pattern:/[A-Za-z$_][$_A-Za-z0-9_]*/},operator:{pattern:/=/}}),L=new e("import specifiers",{ordinary:{pattern:p`
      (^|,) # 1: beginning of string or comma
      ([\s\n]*) # 2: space
      ([A-Za-z_$][A-Za-z_$0-9]*) # 3: identifier
      (\s*) # 4: optional space
      (?=$|,) # followed by end of string or comma
    `,captures:{1:"punctuation",3:"variable variable-import"}},"default as":{pattern:p`
      (^|,)     # 1: beginning of string or comma
      ([\s\n]*)     # 2: space
      (default) # 3: "default"
      (\s*)     # 4: space
      (as)      # 5: "as"
      (\s*)     # 6: space
      ([\w$][\w\d$]*) # 7: identifier
      (\s*)     # 8: space
      (?=$|,) # followed by end of string or comma
    `,captures:{1:"punctuation",3:"keyword keyword-default",5:"keyword keyword-as",7:"variable variable-import"}},"foo as bar":{pattern:p`
      (^|,)     # 1: beginning of string or comma
      ([\s\n]*)     # 2: space
      ([\w$][\w\d$]*) # 3: identifier
      (\s+)     # 4: space
      (as)      # 5: "as"
      (\s+)     # 6: space
      ([\w$][\w\d$]*) # 7: identifier
      (\s*)     # 8: space
      (?=$|,) # followed by end of string or comma
    `,captures:{1:"punctuation",3:"variable variable-import",5:"keyword keyword-as",7:"variable variable-import"}}}),M=new e("import specifier",{"implicit default specifier":{pattern:p`
      ^(\s*) # 1: optional space anchored to beginning of import
      ([A-Za-z_$][A-Za-z_$0-9]*) # 2: identifier
      (\s*)
      (?=,|$) # followed by comma or end of string
    `,captures:{2:"variable variable-import"}},specifiers:{pattern:p`
      (\{)(\s*) # opening brace
      ([^}]+) # stuff in the middle
      (}) # closing brace
    `,captures:{3:L}}}),X=new e({"import with destructuring":{pattern:p`
      (^\s*)
      (import)(\s*)
      (?=\{) # lookahead: opening brace
      ([\s\S]*?)(\s*)
      (from)(\s*)
      (.*?)
      (?=;|\n) # ending with a newline or semicolon
    `,captures:{2:"keyword keyword-import",4:M,6:"keyword keyword-from",8:R}},"import with source":{pattern:p`
      (^\s*)
      (import)(\s*)
      (.*?)(\s*)
      (from)(\s*)
      (.*?)
      (?=;|\n) # ending with a newline or semicolon
    `,captures:{2:"keyword keyword-import",4:()=>M,6:"keyword keyword-from",8:()=>R}},"import without source":{pattern:p`
      (^\s*)   # 1: optional leading space
      (import) # 2: keyword
      (\s*)    # 3: space
      (?=\`|'|") # (lookahead) when we see an opening string delimiter...
      (.*?)    # 4: capture everything, including the delimiter...
      (?=;|\n) # (lookahead) ...until the end of the line
    `,captures:{2:"keyword keyword-import",4:()=>R}}}),B=new e("export specifiers",{ordinary:{pattern:p`
      (^|,) # 1: beginning of string or comma
      (\s*) # 2: optional space
      ([A-Za-z_$][A-Za-z_$0-9]*) # 3: identifier
      (\s*) # 4: optional space
      (?=$|,) # followed by end of string or comma
    `,captures:{1:"punctuation",3:"variable variable-export"}},"as default":{pattern:p`
      (^|,)     # 1: beginning of string or comma
      (\s*)     # 2: space
      ([\w$][\w\d$]*) # 3: identifier
      (\s*)     # 4: space
      (as)      # 5: "as"
      (\s*)     # 6: space
      (default) # 7: "default"
      (\s*)     # 8: space
      (?=$|,) # followed by end of string or comma
    `,captures:{1:"punctuation",3:"variable variable-export",5:"keyword keyword-as",7:"keyword keyword-default"}},"as [identifier]":{pattern:p`
      (^|,)     # 1: beginning of string or comma
      (\s*)     # 2: space
      ([\w$][\w\d$]*) # 3: identifier
      (\s*)     # 4: space
      (as)      # 5: "as"
      (\s*)     # 6: space
      ([\w$][\w\d$]*) # 7: identifier
      (\s*)     # 8: space
      (?=$|,) # followed by end of string or comma
    `,captures:{1:"punctuation",3:"variable variable-import",5:"keyword keyword-as",7:"variable variable-export"}}}),C=new e("export specifier",{specifiers:{pattern:p`
      (\{)(\s*) # opening brace
      ([^}]+) # stuff in the middle
      (}) # closing brace
    `,captures:{3:B}}}),G=new e("exports",{"export with destructuring":{pattern:p`
      (^\s*)
      (export)(\s*)
      (?=\{) # lookahead: opening brace
      ([\s\S]*?\s*\}) # ending with a closing brace
    `,captures:{2:"keyword keyword-export",4:C}},"export default with identifier":{pattern:p`
      (^\s*)   # 1: optional leading space
      (export) # 2: keyword
      (\s+)    # 3: space
      (default) # 4: "default" keyword
      (\s+)    # 5: space
      ([\w$][\w\d$]*) # 6: identifier
    `,captures:{2:"keyword keyword-export",4:"keyword keyword-default",6:"variable variable-export"}},"export by itself or with default":{pattern:p`
      (^\s*)   # 1: optional leading space
      (export) # 2: keyword
      (\s+)    # 3: space
      (default)? # 4: optional "default" keyword
      (\s*) # 5: zero or more spaces (since default is optional)
      (?=let|const|var|function|\[|\{) # (lookahead) a token that would distinguish from the identifier scenario
    `,captures:{2:"keyword keyword-export",4:"keyword keyword-default"}}}),K=new e({"keyword operator":{pattern:/\|\||&&|&amp;&amp;|!==?|={1,3}|(?:>=|&gt;=)|(?:<=|&lt;=)|\+\+|\+|--|-|\*|[\*\+-\/]=|\.{3}|\b(?:instanceof|in|of)\b|!|void|\.|(?:>|&gt;)|(?:<|&lt;)/},"meta: ternary colon":{pattern:p`
      (\s+)
      (\?|:)
      (\s+)
    `,captures:{2:"keyword operator operator-ternary"}}}),N=new e({});N.extend(H),N.extend(F),N.extend(D),N.extend(K);let P=new e("javascript-jsx",{},{alias:["react","javascript","js"]});P.extend(I),P.extend(X),P.extend(G),P.extend(F),P.extend({"meta: exclude digits in the middle of identifiers":{pattern:/\$\d/,replacement:"#{0}"},"meta: properties with keyword names":{pattern:/(\.)(for|if|while|switch|catch|return)\b/,replacement:"#{0}"},"meta: functions with keyword names":{pattern:/(\s*)\b(for|if|while|switch|catch)\b/,replacement:"#{1}<span class='keyword'>#{2}</span>"},"meta: new keyword plus identifier":{pattern:p`
      (new)                  # 1: keyword
      (\s+)                  # 2: space
      ((?:[\w$][\w\d$]*\.)*) # 3: any number of object properties
      ([\w$][\w\d$]*)        # 4: class
      (?=\()                 # (lookahead) open paren
    `,captures:{1:"keyword keyword-new",3:()=>K,4:"entity-class"}},"meta: variable declaration":{pattern:/\b(var|let|const)(\s+)([\w$][\w\d$]*?)(\s*)(?=\s|=|;|,)/,captures:{1:"storage",3:"variable"}},"meta: variable assignment":{pattern:/(\s+|,)([A-Za-z_$][\w\d$]*?)(\s*)(?==)(?!=(?:>|&gt;))/,captures:{2:"variable"}},"meta: destructuring assignment":{pattern:p`
      (let|var|const) # storage
      (\s+) # mandatory space
      (\{|\[) # opening brace or bracket
      ([\s\S]*) # a bunch of stuff
      (\}|\]) # closing brace or bracket
      (\s*)
      (=) # followed by an equals sign
    `,index:e=>{let t=/(let|var|const|)(\s+)(\{|\[)/.exec(e)[3],n=s(e,{"{":"}","[":"]"}[t],t),a=e.indexOf("=",n);return e.slice(0,a+1),a},captures:{1:"storage",4:J,7:"operator"}},"function function-expression":{pattern:p`
      \b(function)
      (\s*)
      ([a-zA-Z_$]\w*)? # function name (optional)
      (\s*)
      (\()             # open parenthesis
      (.*?)            # raw params
      (\))             # close parenthesis
    `,captures:{1:"keyword keyword-function",3:"entity",5:"punctuation",6:_,7:"punctuation"}},"function function-literal-shorthand-style":{pattern:p`
      (^\s*)            # 1: space
      (get|set|static)? # 2: annotation
      (\s*)             # 3: space
      ([\w$][\w\d$]*)   # 4: function name
      (\s*)             # 5: space
      (\()              # 6: open parenthesis
      (.*?)             # 7: raw params
      (\))              # 8: close parenthesis
      (\s*)             # 9: space
      (?=\{)            # (lookahead) brace
    `,captures:{2:"storage",4:"entity",6:"punctuation",7:_,8:"punctuation"}},"meta: function shorthand with computed property name":{pattern:p`
      (])    # 1: closing bracket (signifying possible computed property name)
      (\s*)  # 2: space
      (\()   # 3: open paren
      (.*?)  # 4: raw params
      (\))   # 5: close paren
      (\s*)  # 6: space
      (?=\{) # (lookahead) opening brace
    `,captures:{3:"punctuation",4:_,5:"punctuation",7:"punctuation"}},"function function-assigned-to-variable":{pattern:p`
      \b
      ([\w$][\w\d$]*) # 1: variable name
      (\s*)      # 2: space
      (=)        # 3: equals sign
      (\s*)      # 4: space
      (function) # 5: keyword
      (\s*)      # 6: space
      (\()       # 7: open paren
      (.*?)      # 8: raw params
      (\))       # 9: close paren
    `,captures:{1:"variable",3:"operator",5:"keyword",7:"punctuation",8:_,9:"punctuation"}},"meta: property then function":{pattern:/([A-Za-z_$][A-Za-z0-9_$]*)(:)(\s*)(?=function)/,captures:{1:"entity",2:"punctuation"}},entity:{pattern:/([A-Za-z_$][A-Za-z0-9_$]*)(?=:)/},"meta: class definition":{pattern:p`
      (class)                # 1: storage
      (?:                    # begin optional class name
        (\s+)                # 2: space
        ([A-Z][A-Za-z0-9_]*) # 3: class name
      )?                     # end optional class name
      (?:                    # begin optional 'extends' keyword
        (\s+)                # 4: space
        (extends)            # 5: storage
        (\s+)                # 6: space
        ([A-Z][A-Za-z0-9_$\.]*) # 7: superclass name
      )?                     # end optional 'extends' keyword
      (\s*)                  # 8: space
      ({)                    # 9: opening brace
    `,index:e=>s(e,"}","{",{startIndex:e.indexOf("{")+1}),captures:{1:"storage",3:"entity entity-class",5:"storage",7:"entity entity-class entity-superclass"}},storage:{pattern:/\b(?:var|let|const|class|extends|async|static)\b/},keyword:{pattern:/\b(?:try|catch|finally|if|else|do|while|for|break|continue|case|switch|default|return|yield|throw|await)\b/}}).extend(K);export{P as default};
