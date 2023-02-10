import e from"../grammar.js";import{c as a,w as n,b as t}from"../utils-be932c53.js";import{VerboseRegExp as s}from"../utils/verbose-regexp.js";import"../template.js";import"../context.js";let r=new e({escape:{pattern:/\\./}}),p=new e({escape:{pattern:/\\./},"exclude from group begin":{pattern:/(\\\()/,replacement:"#{1}"},"group-begin":{pattern:/(\()/,replacement:'<b class="group">#{1}'},"group-end":{pattern:/(\))/,replacement:"#{1}</b>"}});function o(e,a){return i.parse(e,a)}let c=new e({interpolation:{pattern:/(\$\{)(.*?)(\})/,replacement:"<span class='#{name}'><span class='punctuation'>#{1}</span><span class='interpolation-contents'>#{2}</span><span class='punctuation'>#{3}</span></span>",before:(e,a)=>{e[2]=f.parse(e[2],a)}}}).extend(r);const i=new e({"parameter parameter-with-default":{pattern:/([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,replacement:a('\n      <span class="parameter">\n        <span class="variable">#{1}</span>\n        <span class="operator">#{2}</span>\n      #{3}\n      </span>\n    '),before:(e,a)=>{e[3]=m.parse(e[3],a)}},"keyword operator":{pattern:/\.{3}/},"variable parameter":{pattern:/[A-Za-z$_][$_A-Za-z0-9_]*/}});let l=new e({"string string-template embedded":{pattern:/(`)([^`]*)(`)/,replacement:"<span class='#{name}'>#{1}#{2}#{3}</span>",before:(e,a)=>{e[2]=c.parse(e[2],a)}},"string string-single-quoted":{pattern:/(')((?:[^'\\]|\\\\|\\[^'])*)(')/,replacement:"<span class='#{name}'>#{1}#{2}#{3}</span>",before:(e,a)=>{e[2]=r.parse(e[2],a)}},"string string-double-quoted":{pattern:/(")((?:[^"\\]|\\\\|\\[^"])*)(")/,replacement:"<span class='#{name}'>#{1}#{2}#{3}</span>",before:(e,a)=>{e[2]=r.parse(e[2],a)}}}),m=new e({constant:{pattern:/\b(?:arguments|this|false|true|super|null|undefined)\b/},"number number-binary-or-octal":{pattern:/0[bo]\d+/},number:{pattern:/(?:\d*\.?\d+)/},...l.toObject(),comment:{pattern:/(\/\/[^\n]*(?=\n|$))|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/},regexp:{pattern:/(\/)(.*?[^\\])(\/)([mgiy]*)/,replacement:"<span class='regexp'>#{1}#{2}#{3}#{4}</span>",before:(e,a)=>{e[2]=p.parse(e[2],a),e[4]&&(e[4]=n(e[4],"keyword regexp-flags"))}}}),d=new e({alias:{pattern:/([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,replacement:"<span class='entity'>#{1}</span>#{2}#{3}#{4}"},variable:{pattern:/[A-Za-z$_][$_A-Za-z0-9_]*/}}),f=new e("javascript",{},{alias:["js"]});f.extend(m),f.extend({"meta: digits in the middle of identifiers":{pattern:/\$\d/,replacement:"#{0}"},"meta: properties with keyword names":{pattern:/(\.)(for|if|while|switch|catch|return)\b/,replacement:"#{0}"},"meta: functions with keyword names":{pattern:/(\s*)\b(for|if|while|switch|catch)\b/,replacement:"#{1}<span class='keyword'>#{2}</span>"},"meta: fat arrow function, one arg, no parens":{pattern:/([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*)(=(?:&gt;|>))/,replacement:"#{1}#{2}#{3}",before:(e,a)=>{e[1]=o(e[1],a)}},"meta: fat arrow function, args in parens":{pattern:s`
      (\()            # 1: open paren
      ([^\)]*?)       # 2: raw params
      (\))            # 3: close paren
      (\s*)           # 4: space
      (=(?:&gt;|>))   # 5: fat arrow
    `,replacement:"#{1}#{2}#{3}#{4}#{5}",before:(e,a)=>{e[2]=o(e[2],a)}},"keyword keyword-new":{pattern:/new(?=\s[A-Za-z_$])/},"variable variable-declaration":{pattern:/\b(var|let|const)(\s+)([A-Za-z_$][_$A-Z0-9a-z]*?)(?=\s|=|;|,)/,replacement:"<span class='storage'>#{1}</span>#{2}<span class='#{name}'>#{3}</span>"},"variable variable-assignment":{pattern:/(\s+|,)([A-Za-z_$][\w\d$]*?)(\s*)(?==)/,replacement:"#{1}<span class='#{name}'>#{2}</span>#{3}"},"meta: destructuring assignment":{pattern:/(let|var|const)(\s+)(\{|\[)([\s\S]*)(\}|\])(\s*)(?==)/,index:e=>{let a=/(let|var|const|)(\s+)(\{|\[)/.exec(e)[3];return t(e,a,{"{":"}","[":"]"}[a],{startIndex:e.indexOf(a)+1})},replacement:"<span class='storage'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",before:(e,a)=>{e[4]=d.parse(e[4],a)}},"function function-expression":{pattern:s`
      \b(function)
      (\s*)
      ([a-zA-Z_$]\w*)? # function name (optional)
      (\s*)
      (\()             # open parenthesis
      (.*?)            # raw params
      (\))             # close parenthesis
    `,replacement:"<span class='keyword keyword-function'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",before:function(e,a){return e[3]&&(e[3]=`<span class='entity'>${e[3]}</span>`),e[6]=o(e[6],a),e}},"function function-literal-shorthand-style":{pattern:s`
      (^\s*)
      (get|set|static)? # 1: annotation
      (\s*)             # 2: space
      ([a-zA-Z_$][a-zA-Z0-9$_]*) # 3: function name
      (\s*)             # 4: space
      (\()              # 5: open parenthesis
      (.*?)             # 6: raw params
      (\))              # 7: close parenthesis
      (\s*)             # 8: space
      (\{)              # 9: opening brace
    `,replacement:"#{1}#{2}#{3}<span class='entity'>#{4}</span>#{5}#{6}#{7}#{8}#{9}#{10}",before:(e,a)=>{e[2]&&(e[2]=`<span class='storage'>${e[1]}</span>`),e[7]=o(e[7],a)}},"function function-assigned-to-variable":{pattern:s`
      \b
      ([a-zA-Z_?\.$]+\w*) # variable name
      (\s*)
      (=)
      (\s*)
      (function)
      (\s*)
      (\()
      (.*?)       # raw params
      (\))
    `,replacement:"<span class='variable'>#{1}</span>#{2}#{3}#{4} <span class='keyword'>#{5}</span>#{6}#{7}#{8}#{9}",before:(e,a)=>{e[8]=o(e[8],a)}},"meta: property then function":{pattern:/([A-Za-z_$][A-Za-z0-9_$]*)(:)(\s*)(?=function)/,replacement:"<span class='entity'>#{1}</span>#{2}#{3}"},entity:{pattern:/([A-Za-z_$][A-Za-z0-9_$]*)(?=:)/},"meta: class definition":{pattern:s`
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
    `,index:e=>t(e,"}","{",{startIndex:e.indexOf("{")+1}),replacement:a('\n      <span class="storage">#{1}</span>\n      #{2}#{3}\n      #{4}#{5}#{6}#{7}\n      #{8}#{9}\n    '),before:e=>{e[3]&&(e[3]=n(e[3],"entity entity-class")),e[5]&&(e[5]=n(e[5],"storage")),e[7]&&(e[7]=n(e[7],"entity entity-class entity-superclass"))}},storage:{pattern:/\b(?:var|let|const|class|extends|async)\b/},keyword:{pattern:/\b(?:try|catch|finally|if|else|do|while|for|break|continue|case|switch|default|return|yield|throw|await)\b/},"keyword operator":{pattern:/!==?|={1,3}|>=?|<=?|\+\+|\+|--|-|\*|[\*\+-\/]=|\?|\.{3}|\b(?:instanceof|in|of)\b/}});export{f as default};
