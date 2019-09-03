
# Daub: Design notes

## Why?

Honestly, I’m not sure. Sane people just use [Prism][] for their syntax highlighting and then get on with their lives.

Most people seem content to have their strings and keywords highlighted and stop there, but I highlight a great many tokens, and my brain relies on those cosmetic differences. I wanted my own code samples on my weblog to look as similar as possible to how I see them in my IDE.

I also just wanted to see if I could do it. Fluorescence predated Prism; I was curious to see how it would be different if it were written from the ground up in the ES6 era.

## Technical challenges

In an ideal world, I wanted a client-side version of TextMate’s language grammars. They make heavy use of regular expressions in order to tokenize source code into logical units. But TextMate grammars can also be highly contextually aware. That’s crucial when `>` can mean something completely different in an attribute value than it does elsewhere.

But TextMate (and Atom after it) use the powerful Oniguruma regex library, and I don’t. The main challenges when trying to replicate TextMate grammars in a client-side JavaScript world are as follows:

### No lookbehind

JavaScript `RegExp`s don’t support positive or negative lookbehind. So far, this has not been a gigantic problem; I could fix it by adopting [XRegExp][], and I may do so in the future

### Not enough data on capture groups

In TextMate grammars, it’s easy to define a pattern like this:

```
{
  name = 'comment.block.html.js';
  match = '(module)\s*(A-Za-z_\w*)';
  captures = {
    1 = { name = 'keyword.controle.module.ruby'; };
    2 = { name = 'entity.name.type.module.ruby'; };
  };
},
```

So `module` gets annotated with a scope, as does the name of the module, while the space in between is left intact. For this to be possible in JavaScript _in the general case_, `RegExp#exec` (or `String#match`) would need to report the index not just for the match itself but _also_ for each of its capture groups. XRegExp’s maintainer [explains it better](https://github.com/slevithan/xregexp/issues/217#issuecomment-361022813) than I do.

The workaround needed here is to ensure that patterns are written such that every token that we want in the output is captured in one group or another. So the pattern above becomes:

```javascript
/(module)(\s*)(A-Za-z_\w*)/
```

We don’t have to do anything explicit with the second group, but we need it as its own atom so that it can be included on its own in the replacement.

## Technical approaches

There aren’t a lot of advantages we have, but one of them is that Daub grammars can incorporate arbitrary code. We can start out with something that generally feels like a TextMate grammar and then bring in arbitrary code where we need help.

### Core approach

Daub is a specialized find-and-replace engine. At its simplest, it merely transforms (e.g.) `true` into `<span class="boolean">true</span>`.

Each rule in a grammar defines a regular expression as a pattern. The grammar combines them, rewriting as necessary, into one gigantic regular expression with alternations, which it then applies over and over again against the input string until no matches are left.

This means that order is meaningful in the grammar. Earlier rules will match before later rules. Patterns that capture a large amount of text will need to exist earlier in the grammar than patterns that match small, common tokens.

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

In the second form, the value can be either an instance of `Grammar` _or_ a function that _returns_ an instance of grammar. This is necessary for the interpolation rule because `JS_MAIN` hasn't been defined yet; referencing it while it's in the **TEMPORAL DEAD ZONE** will trigger an error. But it’s not necessary when the main grammar references `JS_INSIDE_TEMPLATE_STRINGS` because that variable has already been defined.

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

In fact, that’s roughly how Daub parses JSX. Finding the end of the JSX tag in this example is too complex for the simple balancing logic used elsewhere, so the `Lexer` class is an exploration of a more sophisticated approach.

Right now, its use is limited to finding the correct boundary; once it’s done so, the JSX Daub grammar parses the match further.
