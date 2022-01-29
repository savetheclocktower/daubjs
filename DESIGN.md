
# Daub: Design notes

Daub is a passion project; if it weren’t, I’m not sure it would justify its own existence. For me, it has solved a very specific problem of my own creation. But it’s also been a lot of fun to work on, somehow, and has exposed me to a lot of technical problems I hadn’t encountered before.

In this document I’ll try to capture those challenges and my reasoning around their solutions. This is mainly for the benefit of my future self, but others may also find it interesting if they’re as weird as I am.

## Why?

Honestly, I’m not sure. Most people seem content to have their strings and keywords highlighted and stop there; they use [Prism][] and get on with their lives. But I highlight a great many tokens, and my brain relies on those cosmetic differences. I wanted my own code samples on my weblog to look as similar as possible to how I see them in my IDE.

I also just wanted to see if I could do it. Fluorescence predated Prism; I was curious to see how it would be different if it were written from the ground up in the ES6 era.

Also, I needed a lockdown project.

## Core approach

Daub is a specialized find-and-replace engine. At its simplest, it merely transforms (e.g.) `true` into `<span class="boolean">true</span>`. To make this happen, you find the grammar you need — an instance of `Grammar` with rules that suit the language in question — and you call `someGrammar.parse(text)`.

### Grammars

Each rule in a grammar defines a regular expression as a pattern. The grammar combines them, rewriting as necessary, into one gigantic regular expression with alternations, which it then applies over and over again against the input string until no matches are left.

```js
let JS = new Grammar({
  'boolean': {
    pattern: /(?:true|false)/
  },
  'number': {
    pattern: /(?:-?\d+(?:\.\d+)?)/
  }
});

JS.pattern; // -> /((?:true|false))|((?:-?\d+(?:\.\d+)?))/m
```

Believe it or not, combining the patterns into one pattern gains us a lot in conceptual simplicity. We don’t have to waste time manually trying to match a bunch of different patterns against a string and then choosing a winner; the regular expression chooses its own winner. The combined pattern implicitly favors earlier rules over later rules.

This means, of course, that order is meaningful in the grammar. Patterns that capture a large amount of text will need to exist earlier in the grammar than patterns that match small, common tokens.

To make it easier to build grammars in meaningful order, `Grammar` instances can call `extend` with other grammars, or with object literals, in order to add those rules to the end of their rules list:

```js
let VALUES = new Grammar({
  // Rules for strings, numbers, and whatnot; these exist as a separate grammar
  // so that we can do contextual parsing later.
  // ...
});

let MAIN = new Grammar({
  // Complex rules that match large portions of the text should go up front.
});

// Folding in these rules will cause them to match after anything already
// declared in MAIN...
MAIN.extend(VALUES);

// ...but before any of these rules:

MAIN.extend({
  // ...
});
```

In the future, I might allow rules that directly “include” other grammars so that this sort of ordering can be achieved a bit more naturally.

### Rules

A grammar consists of zero or more rules. The initial argument to the `Grammar` constructor is an object whose keys are rule names and whose values are rule literals.

What’s a “rule literal”? You don’t instantiate a `Rule` directly; this is done internally by the grammar. A “rule literal” is any plain object that satisfies the contract described below:

```js
{
  // REQUIRED:

  pattern: RegExp,

  // OPTIONAL:

  // Will be used to build a `Template`. Default value varies based
  // on other properties.
  replacement: String,

  // If present, will be used after a match to decide how much of the match
  // should be consumed.
  index: Function,

  // If present, will be called before replacement (but after `captures`).
  // Called with two arguments: (1) the match data (in the form returned by
  // String#match) and (2) a `Context` instance. Can mutate the match data in
  // place or substitute it with a new array.
  before: Function,

  // If present, will be called after replacement. Called with two arguments:
  // (1) the transformed text in flat string form and (2) a `Context` instance.
  // Can substitute the transformed text with a different string.
  after: Function,

  // An object whose keys are integers and whose values are strings or
  // instances of `Grammar`. If present, will perform substitutions on capture
  // groups right before the `before` callback is invoked.
  captures: Object,

  // Whether the replacement template should wrap the entire match in "<span
  // class=#{name}>"/"</span>". Ignored unless `captures` is present; defaults
  // to `false`. Further explanation below.
  wrapReplacement: Boolean
}
```

Any unrecognized properties will be ignored.

### Replacements

Fluorescence, Daub’s predecessor, depended on Prototype, and leveraged some of Prototype’s built-in features. One of them was the `Template` class, which scraches the same itch as [Underscore’s `template` function](https://underscorejs.org/#template).

```js
let adage = new Template('#{0}, #{1}, and #{2}');
adage.evaluate(['lock', 'stock', 'barrel']);
// -> "lock, stock, and barrel"

let greeting = new Template('#{name} has #{messages} messages.');
greeting.evaluate({ name: 'Andrew', messages: 4 });
// -> "Andrew has 4 messages."
```

Templates were a natural fit in Fluorescence; they’re a terse way of describing how to transform a matched string in a regular expression. Indeed, `String#gsub` — Prototype’s enhanced version of `String#replace` — interpreted its second argument as a `Template`:

```js
var markdown = '![a pear](/img/pear.jpg) ![an orange](/img/orange.jpg)';
markdown.gsub(/!\[(.*?)\]\((.*?)\)/, '<img alt="#{1}" src="#{2}" />');

// -> '<img alt="a pear" src="/img/pear.jpg" /> <img alt="an orange" src="/img/orange.jpg" />'
```

When I wrote Daub, I stole the `Template` class from Prototype. I also stole `String#gsub` and made it a standalone function.

If a rule specifies a `replacement` string, that string will be used to build an instance of `Template` that is responsible for performing the replacement. Its `evaluate` function will be called with an array of matches, where `0` is the entire match and any subsequent items are capture group matches. The array will also have a `name` property; that’s the name of the rule.

```js
let BOOLEAN = new Grammar({
  boolean: {
    pattern: /\b(?:true|false)\b/
  }
});

// The rule named `boolean` will use the implicit default template, which is
// `<span class="#{name}">#{0}</span>`.

BOOLEAN.parse("true");
// -> '<span class="boolean">true</span>'
```

Instead of relying on the default, a custom `replacement` can use any of the array indices or the `name` property:

```js
let BOOLEAN = new Grammar({
  boolean: {
    pattern: /\b(?:true|false)\b/,
    replacement: `<span class="boolean-wrapper"><span class="#{name}">#{0}</span></span>`
  }
});

BOOLEAN.parse("true");
// -> '<span class="boolean-wrapper"><span class="boolean">true</span></span>'
```

## The problems

In an ideal world, I’d want a client-side version of TextMate’s language grammars. They make heavy use of regular expressions in order to tokenize source code into logical units. But TextMate grammars can also be highly contextually aware. That’s crucial when `>` can mean something completely different in an attribute value than it does elsewhere.

But TextMate (and Atom after it) use the powerful [Oniguruma][] regex library, and I don’t. The main challenges when trying to replicate TextMate grammars in a client-side JavaScript world are as follows:

### No lookbehind

JavaScript `RegExp`s don’t support positive or negative lookbehind.

#### Workaround

Generally speaking, I haven’t needed one. In the few cases where I really need some sort of lookbehind, I’ve been able to work around it through some combination of `index` or `before` callbacks (which are described below).

I could fix it by adopting [XRegExp][], and I may do so in the future. But even with a workaround — and even in the future, when JavaScript will support lookbehind — lookbehinds wouldn’t be able to “see” any characters that were already consumed by a different rule. I can’t think of an easy way around that. Good thing I don’t need lookbehind.

### Not enough data on capture groups

In TextMate grammars, it’s easy to define a pattern like this:

```
{
  name = 'meta.module-definition.ruby';
  match = '(module)\s+(A-Za-z_\w*)';
  captures = {
    1 = { name = 'keyword.control.module.ruby'; };
    2 = { name = 'entity.name.type.module.ruby'; };
  };
},
```

So `module` gets annotated with a scope, as does the name of the module, while the one-or-more spaces in between are left intact. For this to be possible in JavaScript _in the general case_, `RegExp#exec` (or `String#match`) would need to report the index not just for the match itself but _also_ for each of its capture groups. XRegExp’s maintainer [explains it better](https://github.com/slevithan/xregexp/issues/217#issuecomment-361022813) than I do.

#### Workaround

If we want to capture _any_ chunks of the string for transformation, we must ensure that the rule’s pattern is written such that _every_ token that we want in the output is captured in one group or another. So the pattern above becomes:

```javascript
/(module)(\s+)(A-Za-z_\w*)/
```

Then, instead of using `#{0}` in the replacement, we concatenate the individual capture groups: `#{1}#{2}#{3}`.

We don’t have to do anything explicit with the second group, but we need it as its own atom so that it can be included on its own in the replacement.

### Backreferences

Wherever there are capture groups, backreferences aren’t far behind. They’re used occasionally in Daub grammars, usually to require that delmiters match. A string that begins with `'` won’t end with `"`, after all.

But since each rule’s pattern is joined with other patterns into one grotesque behemoth of a regular expression, these backreferences will cease to point to the right thing. Unless we renumber them.

#### Workaround

Yeah, I wrote code to count and renumber backreferences in an arbitrary regular expression. It didn’t feel great while I was doing it, but it felt great when I saw that it worked and I didn’t have to think about it anymore.

## Other creative solutions

There aren’t a lot of advantages we have, but one of them is that Daub grammars can incorporate arbitrary code. We can start out with something that generally feels like a TextMate grammar and then bring in arbitrary code where we need help.

### Balancing

Regular expressions, as academically defined, are famously incapable of matching “balanced” tokens like parentheses or other character pairs. This need comes up _rather often_ when writing grammars.

Here's an example:

```ruby
UH_OH = %Q{
  this { \{ #{thing} will be } a problem.
}
```

Ruby's `%Q` literal syntax lets you declare a multi-line string. The literal itself can be delimited with brackets, parentheses, or braces, among other things. But if we use braces, we run into trouble, because we're also using braces inside of the literal.

Ruby knows not to end the literal until the braces are balanced. But with a regex, you're stuck: a greedy capture group will match too much, but a non-greedy capture group will match too little.

The way Daub gets around this is to define a callback (called `index`) that lets the rule retroactively decide to match a smaller amount of the string than the pattern asked for. In other words, the rule can choose the greedy approach, receive the whole match in a function, and then use whatever approach it likes to identify where the rule should _actually_ stop. The remainder of the string is retroactively un-consumed, and pattern-matching continues from the beginning of that remainder.

The `index` callback is our most powerful tool to break out of the regex jail. It lets us introduce more sophisticated parsing approaches on an as-needed basis.

### Context awareness

TextMate grammars can do this:

```
literal-template-string = {
  name = 'string.quoted.other.template.js';
  begin = '(`)';
  end = '(`)';
  beginCaptures = { 1 = { name = 'punctuation.definition.template.begin.js'; }; };
  endCaptures = { 1 = { name = 'punctuation.definition.template.end.js'; }; };
  contentName = 'meta.embedded.interpolated-string.js';
  patterns = (
    {	include = '#string-content'; },
    {	name = 'constant.character.escape.js';
      match = '\\`';
    },
    {	begin = '\${';
      end = '}';
      beginCaptures = { 0 = { name = 'keyword.other.substitution.begin.js'; }; };
      endCaptures = { 0 = { name = 'keyword.other.substitution.end.js'; }; };
      patterns = ( { include = '#expression'; } );
    },
  );
};
```

We’ll return to this example in a bit, but for now, just notice this: two tokens that are meaningful only in a specific context — escaped backticks and template string interpolation delimiters — are defined as meaningful patterns _only_ within their relevant context. Outside of a template string, neither pattern will match.

Daub grammars do a version of this.

```javascript

let JS_INSIDE_TEMPLATE_STRINGS = new Grammar({
  'interpolation': {
    pattern: /(\$\{)(.*?)(\})/,
    wrapReplacement: true,
    captures: {
      '1': 'punctuation interpolation-start',
      '2': () => JS_MAIN,
      '3': 'punctuation interpolation-end'
    }
  }
});

let JS_MAIN = new Grammar({
  'template-string': {
    pattern: /(`)((?:[^`\\]|\\\\|\\.)*)(`)/,
    captures: {
      '1': 'punctuation string-start',
      '2': JS_INSIDE_TEMPLATE_STRINGS,
      '3': 'punctuation string-end'
    }
  }
})
```

The `captures` property lets us do two things with tokens:

1. We can give a string value to represent the class names of a `span` which will wrap the token.
2. We can give a reference to a different grammar to specify that the text in this capture group should be _parsed again_ using that grammar.

In the second form, the value can be either an instance of `Grammar` _or_ a function that _returns_ an instance of `Grammar`. This is necessary for the interpolation rule because `JS_MAIN` hasn't been defined yet; referencing it while it's in the **TEMPORAL DEAD ZONE** will trigger an error. But it’s not necessary when the main grammar references `JS_INSIDE_TEMPLATE_STRINGS` because that variable has already been defined.

## Other half-baked ideas

### Balancing strategies

Imagine we’re parsing destructuring assignment in ES6:

```javascript
function onLoad (response, options) {
  let {
    results: searchResults,
    meta: { page, cursor }
    error
  } = response;
  let { silent } = options;
  if (error) {
    throw new APIError(error);
  }
  // ...

}
```

We want to match everything in between the opening brace on line 1 (after `let`) and the closing brace on line 5 (before `= response`).

There are patterns we could write that would match the right thing for this specific example. We could do something like `/let {([\s\S]+?)}\s*(?==)/` — in other words, start right after `let` and stop when you encounter a brace that is followed by `=`.

But that won’t work in the general case. Consider that destructuring syntax also lets us define default values:

```javascript
let {
  transform = ((bundle) => {
    let { text } = bundle;
    // ...
  })
} = options;
```

This might be ill-advised, but it’s valid ES6.

Instead, let’s write a pattern that will prefer matching too much over too little. To do this, we’ll remove the “ungreedy” quantifier from the last pattern: `/let {([\s\S]+)}\s*(?==)/`. This will match too much:

```
let {
  results: searchResults,
  meta: { page, cursor }
  error
} = response;
let { silent }
```

But we can use a token-balancing strategy in our `index` callback to identify where the match should really stop:

```javascript

let grammar = new Grammar({
  'destructuring': {
    pattern: /let {([\s\S]+)}\s*(?==)/,
    index: (text) => {
      return balance(text, '}', '{', {
        startIndex: text.indexOf('{'),
        startDepth: 1
      });
    }
  }
});
```

For this example, imagine that `balance` is a function that:

* starts at the specified index and with the specified “depth”;
* searches the string character-by-character, incrementing the depth value if it finds `{`, and decrementing it if it finds `}`; and
* returns the current index once it finds a `}` that returns the depth level to `0`.

This hypothetical function is available in Daub in the `Utils` module. It can balance paired characters of arbitrary length and can understand backslash escapes.

### Lexer (an alternate approach)

Another the thing I like about TextMate grammars is demonstrated in the “Context awareness” snippet above.

Notice how they can describe a beginning token and an ending token, and can then enforce that only certain patterns are allowed within. The best aspect of this is that, once the `begin` pattern matches, the internal `patterns` are attempted _before_ the `end` pattern. The `end` pattern doesn’t need a lookbehind to make sure it isn’t consuming an escaped backtick.

I probably should’ve incorporated this approach from the beginning, but Daub’s `Lexer` class is a preliminary application of this idea. Daub grammars currently require you to match the beginning and the end in one pattern, at which point you can decide how to treat the contents. But `Lexer` introduces a form of parsing in which certain tokens can trigger “modes” that continue indefinitely.

I started writing the `Lexer` class to see if it could be a legitimate alternative to the constraints of `Grammar` classes. It’s designed to produce an abstract tree of tokens rather than a serialized HTML string. After some experimentation, I doubt it will replace `Grammar`, but the alternative approach has come in handy when depoyed in targeted situations.

Consider this JSX snippet:

```javascript
function Badge (items) {
  return (
    <div className="badge">
      <Pluralize prefix="Your total -->" plural={items > 1}>item</Pluralize>
    </div>
  );
}
```

This is contrived, but bear with me. The `items > 1` comparison on line 4 is a problem for Daub; I’m not sure it’s possible in the general case to write a regular expression that would match all of `<Pluralize plural={items > 1}>`.

A more sensible way to approach this would be something like this:

1. Encounter the `<` on line 4; recognize that it’s opening a JSX tag.
2. Start looking for a `>` to end the opening tag, but also look for other patterns which would signify a shift in parser mode.
3. Upon reaching `"` just after `prefix=`, switch to a string-parsing lexer mode until further notice.
4. Parse the string. Look for another `"`, but also look for `\\"`, since an escaped quote would not end the string. Ignore the `>` in the string; string-parsing mode doesn’t give that character special meaning.
5. Upon reaching `"` at the end of `"Total:"`, revert to JSX-tag-parsing mode.
6. Upon reaching `{` just after `plural=`, switch to a JSX-interpolation-parsing lexer mode until further notice.
7. Parse the interpolation. Ignore the `>` in `items > 1`; it’s not relevant to you in this mode¹. Look for the `}` that will end the interpolation, but also look for `{`, since encountering one would change the meaning of the next `}` you encounter.
8. Upon reaching `}` at the end of the interpolation, revert to JSX-tag-parsing mode.
9. Finally encounter the `>` after the interpolation. JSX-tag-parsing mode recognizes it as the end of the tag. Stop.

¹ The `>` token has meaning in JavaScript code, of course. A lexer-only approach to syntax highlighting would recognize that meaning and annotate it along the way, but the lexer I’m describing cares only about finding the JSX tag boundaries.

In fact, that’s roughly how Daub parses JSX. Finding the end of the JSX tag in this example is too complex for a `Grammar` to do on its own, and it’s also too complex for the simple string-based balancing logic used elsewhere. So a lexer is deployed, and however far it reaches into the string is the extent of what the rule should match:

```js
// Define a lexer that expects to be invoked at the beginning of a tag and
// keeps consuming until it reaches a balanced closing tag.
let LEXER_TAG_ROOT = new Lexer([/* ... */]);

let JSX_TAG_ROOT = new Grammar({
  'jsx': {
    pattern: VerboseRegExp`
      (<|&lt;) # opening angle bracket
      ([a-zA-Z_$][a-zA-Z0-9_$\.]*\s*) # any valid identifier as a tag name
      ([\s\S]*) # middle-of-tag content (will be parsed later)
      (&gt;|>)
    `,
    index: (text) => {
      return balanceByLexer(text, LEXER_TAG_ROOT);
    },
    replacement: compact(`
      <span class='jsx'>#{0}</span>
    `),
    before: (m) => {
      m[0] = JSX_CONTENTS.parse(m[0]);
    }
  }
});
```

I realize I’ve hidden the lexing itself, which is the hard part of this whole thing. But the purpose of this example is to show that (a) the grammar is responsible for matching _at least_ as much as we’ll need here; (b) the lexer is responsible for identifying the true length of the match; (c) the grammar is responsible for taking that matched string and applying highlighting.

### Before and After callbacks: the behind-the-scenes heroes

There are two crucial hooks into the rule-application process that drive most of Daub’s intelligence. The `before` callback occurs just before replacement, and is called with two parameters: (a) the array of matches, including capture groups, and (b) an instance of `Daub.Context` that is shared throughout an entire highlighting attempt.

The power of the `before` callback lies in its ability to _alter_ the match data array — or return a new array altogether. If the `captures` feature didn’t exist, one could implement captures using `before`:

```js
let JS_MAIN = new Grammar({
  'template-string': {
    pattern: /(`)((?:[^`\\]|\\\\|\\.)*)(`)/,
    // captures: {
    //   '1': 'punctuation string-start',
    //   '2': JS_INSIDE_TEMPLATE_STRINGS,
    //   '3': 'punctuation string-end'
    // },
    before (m, context) {
      if (m[1]) { m[1] = wrap('punctuation string-start'); }
      if (m[2]) { m[2] = JS_INSIDE_TEMPLATE_STRINGS.parse(m[2], context); }
      if (m[3]) { m[3] = wrap('punctuation string-end'); }
    }
  }
});
```

Here, the work done in the `before` callback is 100% equivalent to the work described by the commented-out `captures`.

Where does `context` come in? `Daub.Context` is a thin wrapper class around `Map`. Its purpose is to make parsing stateful across grammars. The `template-string` rule above delegates part of its parsing task to another grammar, but when it calls `JS_INSIDE_TEMPLATE_STRINGS.parse`, it passes the existing `context` instance as the second argument so that the latter grammar can see any relevant state.

### VerboseRegExp

Unlike some other languages, JavaScript has no built-in “verbose” or “extended” regular expression syntax in which literal whitespace is ignored and comments are allowed. And because of the constraints we’re under when writing patterns in Daub grammars, annotated patterns are often sorely needed.

But building regular expressions out of strings involves having to double-escape every backslash in your regular expression. `/\}/` becomes `new RegExp("\\}")`. A maching a literal escape sequence like "\t" becomes `/\\t/` in a regex literal, but `new RegExp("\\\\t")` in its string form. I hate it.

ES6’s tagged template literals offer a way out: they can access the “raw” form of the string in which every backslash is interpreted as a literal backslash, rather than an escape character:

```js
let ordinaryEscapedBrace = /\\}/;
function re1 (str) {
  return new RegExp(str);
}
let annoyingEscapedBrace = reAnnoying`\\\\}`;

function re2 (str) {
  return RegExp(str.raw[0]);
}
let farPreferableEscapedBrace = re2`\\}`;
```

With this, it’s pretty easy to write a specialized tagged template function that allows me to annotate regular expressions with comments:

```js
function VerboseRegExp (str) {
  let raw = str.raw[0];

  let pattern = raw.split(/\n/)
    .map((line) => {
      // Remove everything from `#` (our comment character) to the end of the
      // line, making sure we ignore `\#`.
    })
    .join('')
    // Remove all remaining literal whitespace.
    .replace(/\s/g, '');

  return new RegExp(pattern);
}
```

It ends up being slightly more complex than this, but you get the idea.

“This is great,” you say, “and I’d like to use this as a standalone import outside of Daub.” Don’t; it’s only simple because I’ve punted on a couple aspects:

1. Template strings also allow for interpolations. `VerboseRegExp` doesn’t handle interpolations because I don’t need them for the purpose of writing patterns for grammars. Supporting them would be easy enough, but would thwart my transpiling strategy as explained below.
2. Regular expressions accept flags, and `VerboseRegExp` does not. It doesn’t accept flags because they’re irrelevant for my purposes; each of the patterns I generate will have its flags discarded when it is combined with its siblings into one gigantic `RegExp`.

If you want a generalized version of `VerboseRegExp`, look at [XRegExp.tag](https://github.com/slevithan/xregexp/blob/master/src/addons/build.js#L75-L103). The syntax is a bit rougher because tagged template functions aren’t designed to take extra flags, but you can write wrapper functions around it if need be. Or you can use [this wrapper library](https://qiita.com/aliceklipper/items/94716a5ebdf07623e848) which takes a different approach with flags.

#### Transpiling VerboseRegExp at build time

So much verbosity in my patterns is great when I’m writing grammars, but bad when I’m sending patterns over the wire. They might as well be ordinary `RegExp` literals once I stop looking at them. The savings in file size won’t be huge, but it will accumulate.

So there’s a babel plugin at `babel/verbose-regexp-macro.js` that transpiles `VerboseRegExp` invocations to ordinary `RegExp` literals at build time. This is why `src/utils/verbose-regexp.js` is a CommonJS module; this plugin needs to be able to import it in a Node context.

This is the other reason why `VerboseRegExp` doesn’t handle interpolations — the stuff inside the interpolation can be arbitrary JavaScript, so any tagged template literal that uses interpolations can’t be transpiled through mere static analysis. I throw an error in the plugin to make this clear; if I _did_ need interpolations in `VerboseRegExp`, I’d just make it so that the plugin ignored any usage that included interpolations so that they could be handled at runtime.

## Usage

Daub was written in ES6 because I wanted to write something in ES6. I wanted template strings so that I could write a tagged template literal that would allow me to write readable regular expressions without having to double-escape everything. I wanted classes and subclasses. I wanted fat-arrow functions.

But this package is meant to be run in the browser, and secondarily in server-side Node environments — neither of which is hospitable to ES6 imports.

Daub uses [Rollup][] to generate builds. Rollup can generate a UMD build for browsers, a CommonJS build for Node contexts, and an ESM build for ESM projects that want to import it directly.

### All, none, or some

This is complicated enough already. But most of my headaches have come from the packaging of the built-in grammars themselves. The grammars that exist now are the ones that _I’ve_ needed; importing every single one works well enough for me, but the average consumer of this library would certainly want to pick and choose.

How do I let the user pick and choose? A few options come to mind:

* Though I admire Prism a great deal, I’d do anything to avoid [its download experience](https://prismjs.com/download.html) — check some boxes and have a black box dumped into your browser for downloading.
* Publishing each grammar as its own package, thereby turning this repo into a [monorepo](https://github.com/lerna/lerna#about), is a possibility, but I don’t like how it complicates things for the user.
* Publishing each grammar as a direct import, such that one can do `import Ruby from 'daub/grammars/ruby'`, would be ideal. But I haven’t figured out how to do that while _also_ exporting the right version for the consumer’s environment — CommonJS by default, but ESM for loaders like Rollup that are ESM-aware.

One of the reasons why Rollup is compelling to me is that it offers a theoretical fourth option: export everything, let the consumer import what they want in their own code, and then rely on Rollup to tree-shake the rest out of their built JavaScript.

But in order to get _this_ to work, I think I’d have to do one of two things.

I could export _everything_ as a flat list from the main entry point:

```js
// import * as grammars from './grammars/';

import JavaScriptGrammar from './grammars/javascript';
import PythonGrammar from './grammars/python';
import RubyGrammar from './grammars/ruby';
// et cetera

import Grammar from './grammar';
import Lexer from './lexer';
import Highlighter from './highlighter';
// et cetera

export {
  Grammar,
  Lexer,
  Highlighter,
  JavaScriptGrammar,
  PythonGrammar,
  RubyGrammar,
  // ...
};
```

I _think_ this would make tree-shaking possible, but I hate the idea of dumping every grammar (and every possible future built-in grammar) into the top-level namespace.

Instead of doing this, I could have a separate entry for the grammars:

```js
import * as grammars from './grammars/';
// Not sure this is valid export syntax, but you get the idea.
export grammars;
```

But, again, that’d have to be exposed to consumers as a different import target. I know how to make a single entry point available in both CommonJS and ESM: define both `main` and `module` in your `package.json`, and point them to the different respective files. But, [despite this article](https://levelup.gitconnected.com/code-splitting-for-libraries-bundling-for-npm-with-rollup-1-0-2522c7437697), I haven’t been able to get the same thing to work with multiple entry points.

### In the browser

The API for a grammar is dead simple: call its `parse` method with some text. Some other text is returned.

The way I use Daub in the browser is pretty straightforward. The `Highlighter` class takes care of the custodial work in a DOM environment — deciding which elements want their contents to be highlighted, and figuring out when to do it.

Performance is more than good enough for my use case: displaying a small handful of code snippets on a blog post — in total no more than 300 LOC per page. On desktop, even the more complex grammars like JSX take no more than 50ms to highlight on my test pages. There’s a special test page for stress-testing, and on that page I get about 200ms.

In extreme cases, like highlighting files of arbitrary length, you’ll always run the risk of locking up the browser while Daub does its work. I can think of two ways around that, and Daub plays well with either one:

1. Generate the highlighted code on the server side, provided your server environment is JavaScript. The downside here is that you’re sending more markup over the wire, though the extra markup is quite repetitive and probably gzips quite well.

2. Use a web worker to do the highlighting, so that the costly work is performed off of the main browser thread. The downside here is that there’s a noticeable “flash of un-highlighted content” here, even when the highlighting itself is fast, because of the inherent latency in communicating with a web worker asynchronously.

### Server-side rendering

I haven’t tried this and don’t know any of the pitfalls and possibilities. Let me know what you discover.

### Web worker

I’ve tried to make the web worker case a bit more straightforward by exporting a file that’s suitable for loading in a web worker (`dist/daub.worker.umd.js`). It pairs with `daub.AsyncHighlighter`, a class meant to be an almost-drop-in replacement for `daub.Highlighter` and meant to be run in the main window. Together the two handle the communication plumbing.

If you take this approach, you’ll want to import `AsyncHighlighter` _and nothing else_ in your main JavaScript bundle. There’s no corresponding UMD build, but if you use Rollup and don’t import anything else, then it… should… work? Again: let me know what you discover, hypothetical reader?

[prism]: https://prismjs.com
[xregexp]: http://xregexp.com
[oniguruma]: https://github.com/kkos/oniguruma
[rollup]: https://rollupjs.org
