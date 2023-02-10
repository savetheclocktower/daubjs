import t from"../grammar.js";import{c as e,a as n}from"../utils-be932c53.js";import a from"../lexer.js";import{VerboseRegExp as s}from"../utils/verbose-regexp.js";import"../template.js";import"../context.js";const p=new a([{name:"string-escape",pattern:/\\./},{name:"string-end",pattern:/('|")/,test:(t,e,n)=>{let a=n.get("string-begin");return t[1]===a&&(n.set("string-begin",null),t)},final:!0}],"string",{scopes:"string"}),r=new a([{name:"string-begin",pattern:/^\s*('|")/,test:(t,e,n)=>(n.set("string-begin",t[1]),t),inside:{name:"string",lexer:p}}],"attribute-value"),l=new a([{name:"punctuation",pattern:/^=/,after:{name:"attribute-value",lexer:r}}],"attribute-separator"),i=new a([{name:"tag tag-html tag-html-custom",pattern:/^[a-zA-Z][a-zA-Z-:]*(?=\s|>|&gt;)/},{name:"tag tag-html",pattern:/^[a-zA-Z][a-zA-Z:]*(?=\s|>|&gt;)/},{name:"attribute-name",pattern:/^\s*(?:\/)?[a-zA-Z][a-zA-Z-:]*(?=\=)/,after:{name:"attribute-separator",lexer:l}},{name:"punctuation",pattern:/\/(?:>|&gt;)/,final:!0},{name:"punctuation",pattern:/(>|&gt;)/,final:!0}],"tag"),c=new a([{name:"punctuation",pattern:/^(?:<|&lt;)/,after:{name:"tag",lexer:i}}],"tag-start",{scopes:"element element-opening"}),m=new t({string:{pattern:/('[^']*[^\\]'|"[^"]*[^\\]")/},attribute:{pattern:/\b([a-zA-Z][a-zA-Z-:]*)(=)/,captures:{1:"attribute-name",2:"punctuation"}}}),o=new t({"constant constant-html-entity constant-html-entity-named":{pattern:/(&amp;)[a-z]+;/},"constant constant-html-entity constant-html-entity-numeric":{pattern:s`
      (&amp;)
      \#
      (
        [0-9]+|          # decimal OR
        [xX][0-9a-fA-F]+  # hexadecimal
      )
      ;
    `}}),g=new t("html",{"embedded embedded-javascript":{pattern:s`
      (&lt;|<)(script|SCRIPT) # 1, 2: opening script element
      (\s+.*?)?               # 3: space and optional attributes
      (&gt;|>)                # 4: end opening element
      ([\s\S]*?)              # 5: contents
      ((?:&lt;|<)\/)(script|SCRIPT)(&gt;|>) # 6, 7, 8: closing script element
    `,replacement:e("\n      <span class='element element-opening'>\n        <span class='punctuation'>#{1}</span>\n        <span class='tag'>#{2}</span>#{3}\n        <span class='punctuation'>#{4}</span>\n      </span>\n        #{5}\n      <span class='element element-closing'>\n        <span class='punctuation'>#{6}</span>\n        <span class='tag'>#{7}</span>\n        <span class='punctuation'>#{8}</span>\n      </span>\n    "),captures:{3:m},before:(t,e)=>{e.highlighter&&(t[5]=e.highlighter.parse(t[5],"javascript",e))}},"element element-opening":{pattern:s`
      (<|&lt;)       # 1: opening angle bracket
      ([a-zA-Z][a-zA-Z-:]*)   # 2: any tag name (hyphens are allowed in web component tag names)
      (?:
        (\s+)          # 3: space
        ([\s\S]*)      # 4: middle-of-tag content
      )?
      (.)            # 5: last character before closing bracket
      (&gt;|>)       # 6: closing bracket
    `,replacement:e("\n      <span class='#{name}'>\n        <span class='punctuation'>#{1}</span>\n        <span class='tag tag-html'>#{2}</span>\n        #{3}#{4}#{5}\n        <span class='punctuation'>#{6}</span>\n      </span>\n    "),index(t,e){let{index:a,highlighted:s}=n(t,c,e);return e.set("lexer-highlighted",s),a},after(t,e){let n=e.get("lexer-highlighted");return e.set("lexer-highlighted",!1),n||t}},"element element-closing element-closing-custom":{pattern:/((?:<|&lt;)\/)([a-zA-Z:\-]+)(>|&gt;)/,captures:{1:"punctuation",2:"tag tag-html tag-html-custom",3:"punctuation"},wrapReplacement:!0},"element element-closing":{pattern:/((?:<|&lt;)\/)([a-zA-Z:]+)(>|&gt;)/,captures:{1:"punctuation",2:"tag tag-html",3:"punctuation"},wrapReplacement:!0},"element element-doctype":{pattern:s`
      ((?:<|&lt;)!) # 1: opening punctuation
      (DOCTYPE)     # 2
      (\s+)         # 3
      (html)        # 4
      ([\s\S]*?)    # 5: optional stuff
      (>|&gt;)      # 6: closing punctuation
    `,captures:{1:"punctuation",2:"keyword special",4:"keyword special",5:m,6:"punctuation"},wrapReplacement:!0},comment:{pattern:/(?:<|&lt;)!\s*(--([^-]|[\r\n]|-[^-])*--\s*)(?:>|&gt;)/}},{encode:!0});g.extend(o);export{g as default};
