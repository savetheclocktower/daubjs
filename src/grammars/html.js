import { Grammar, Utils } from '../daub';

const { compact, VerboseRegExp } = Utils;

const ATTRIBUTES = new Grammar({
  string: {
    pattern: /('[^']*[^\\]'|"[^"]*[^\\]")/
  },

  attribute: {
    pattern: /\b([a-zA-Z-:]+)(=)/,
    replacement: compact(`
      <span class='attribute'>
        <span class='#{name}'>#{1}</span>
        <span class='punctuation'>#{2}</span>
      </span>
    `)
  }
});

const MAIN = new Grammar('html', {
  doctype: {
    pattern: /&lt;!DOCTYPE([^&]|&[^g]|&g[^t])*&gt;/
  },

  'embedded embedded-javascript': {
    pattern: VerboseRegExp`
      (&lt;|<)(script|SCRIPT) # 1, 2: opening script element
      (\s+.*?)?               # 3: space and optional attributes
      (&gt;|>)                # 4: end opening element
      ([\s\S]*?)              # 5: contents
      ((?:&lt;|<)\/)(script|SCRIPT)(&gt;|>) # 6, 7, 8: closing script element
    `,
    replacement: compact(`
      <span class='element element-opening'>
        <span class='punctuation'>#{1}</span>
        <span class='tag'>#{2}</span>#{3}
        <span class='punctuation'>#{4}</span>
      </span>
        #{5}
      <span class='element element-closing'>
        <span class='punctuation'>#{6}</span>
        <span class='tag'>#{7}</span>
        <span class='punctuation'>#{8}</span>
      </span>
    `),
    before: (r, context) => {
      if (r[3]) {
        r[3] = ATTRIBUTES.parse(r[3], context);
      }
      r[5] = context.highlighter.parse(r[5], 'javascript', context);
    }
  },

  'tag tag-open': {
    pattern: /((?:<|&lt;))([a-zA-Z0-9:]+\s*)(.*?)(\/)?(&gt;|>)/,
    replacement: compact(`
      <span class='element element-opening'>
        <span class='punctuation'>#{1}</span>
        <span class='tag'>#{2}</span>#{3}
        <span class='punctuation'>#{4}#{5}</span>
      </span>
    `),
    before: (r, context) => {
      r[3] = ATTRIBUTES.parse(r[3], context);
    }
  },

  'tag tag-close': {
    pattern: /(&lt;\/)([a-zA-Z0-9:]+)(&gt;)/,
    replacement: compact(`
      <span class='element element-closing'>
        <span class='punctuation'>#{1}</span>
        <span class='tag'>#{2}</span>
        <span class='punctuation'>#{3}</span>
      </span>
    `)
  },

  comment: {
    pattern: /&lt;!\s*(--([^-]|[\r\n]|-[^-])*--\s*)&gt;/
  }
}, { encode: true });

export default MAIN;
