import t from"../grammar.js";import{c as n}from"../utils-be932c53.js";import{VerboseRegExp as e}from"../utils/verbose-regexp.js";import"../template.js";import"../context.js";const r=new t({variable:{pattern:/(\$[\d\w_\-]+)\b/}}),a=new t({"meta: unquoted IP address string":{pattern:/(\s|^)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\:\d+)?)/,captures:{2:"string string-unquoted string-ip-address"}},"string string-unquoted string-url":{pattern:/\bhttps?:\/\/.*?(?=;|\s|$)/},"meta: unquoted path string":{pattern:e`
      (\s+|^) # preceding space or beginning of line
      (
        (?:[A-Za-z0-9_\-]+)? # possible name before first slash, if a relative path
        \/            # leading path separator
        (?:\\\s|.)+?    # any characters other than spaces, but allowing escaped spaces
        (?=\s|$)      # space or end of string
      )
    `,captures:{2:"string string-unquoted string-path"}},"meta: number":{pattern:/(\s|^)(\d[\d\.]*)/,captures:{2:"number number-integer"}},"meta: string":{pattern:e`
      (                 # group 1: whitespace or control characters
        (?:^|[^\\])
        (?:\\\\)*
      )
      (                 # group 2: entire string
        "            # group 3: leading punctuation
        (?:[^"\\]|\\.|\n)*
        "            # group 4: trailing punctuation
        |
        '            # group 5: leading punctuation
        (?:[^'\\]|\\.|\n)*
        '             # group 6: trailing punctuation
      )
    `,before(t){t[2]=function(t){let e=t.charAt(0),a=r.parse(t.slice(1,-1));return n(`\n    <span class="string string-quoted">\n      <span class="punctuation">${e}</span>\n      ${a}\n      <span class="punctuation">${e}</span>\n    </span>\n  `)}(t[2])},replacement:"#{1}#{2}"},variable:{pattern:/\$[A-Za-z_][A-Za-z0-9_]*/},"meta: boolean":{pattern:/(\s)(off|on)(?!\S)/,captures:{2:"constant constant-boolean"}}});const s=new t({}).extend(a).extend({"entity entity-function-with-block":{pattern:/^(?:server|location|events|http|upstream|types)(?!\S)/},"support support-function":{pattern:/^\S+/}}),p=new t("nginx",{"comment comment-line":{pattern:/(^|[\s{};])#.*$/},"meta: directive":{pattern:e`
      (^|\s)
      (
        \w(?:
          [^;{}"'\\\s]|
          \\.|
          "(?:
            [^"\\]|
            \\.
          )*"|
          '(?:
            [^'\\]|
            \\.
          )*'|
          \s+(?:
            \#.*(?!.)|
            (?![\#\s])
          )
        )*?
      )
      (?=\s*[;{])
    `,captures:{2:s}}});export{p as default};
