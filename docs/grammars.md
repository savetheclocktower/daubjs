
# Writing a Daub grammar

If you’re like me, you’ve written at least one TextMate-style grammar in your life. But you’re probably _not_ like me; most people do _normal_ things in their spare time. So here’s a crash-course on how Daub grammars work.

This document assumes a moderate amount of familiarity with regular expressions. If you don’t have much experience with them, this topic might be challenging, but you’re welcome to treat it as a training exercise. A site like [regex101](https://regex101.com/) can help break down the parts of a given regular expression.

## Understanding the interface of a grammar

A Daub grammar is agnostic to its environment. It doesn’t know anything about the DOM, and therefore doesn’t care about whether it runs client-side or server-side. Its interface is simple: it exposes a `parse` method that will accept text and produce HTML-tokenized text.

```javascript
import Ruby from 'daub/grammars/ruby';

Ruby.parse(`module Foo\nend`);
// "<span class="keyword">module</span> <span class="entity">Foo</span>\n<span class="keyword">end</span>"
```

This will be useful to remember later on.

## Understand the naming conventions

TextMate grammars have influenced Daub not just in their architecture but also in their [scope naming conventions](https://macromates.com/manual/en/language_grammars#naming_conventions). They have also influenced the naming conventions of Atom, Sublime Text, and VSCode grammars, so this may be familiar to you already.

We don’t try to recreate the length and specificity of TM-style scope names, but we do borrow the basic naming strategy. Some conventions to keep in mind:

* `keyword`: Control words, operators, and the like. Examples: `if`, `else`, `==` (in C-like languages); `@media` (in CSS).
* `entity`: A function, class, or module name (when defined, not when invoked). Examples: `foo` in `function foo`, `Highlighter` in `class Highlighter`.
* `constant`: An invariant — e.g., a hex code, a constant, a symbol. Examples: `:something` (in Ruby), `PI`, `#fff`.
* `storage`: Type annotations and other modifiers. Examples:
  * JavaScript: `var`, `let`, `const`, `static`.
  * C: `unsigned`, `int`, `char`, `volatile`.
* `string`: Strings of all kinds. Optionally add a second class name for the kind: `string-single-quoted`, `string-double-quoted`, `string-unquoted`, et cetera.
* `support`: Common functions/classes/values in the standard library. Examples: `replaceChild` (in DOM/JavaScript), `strpos` (in PHP).
* `comment`: Comments  and other things that are ignored by the program.
* `regexp`: Regular expression literals.

Some stuff doesn't fit easily into this taxonomy, and that's fine. Simplicity is more important than fastidious order.

If you want more detail, you can add class names. For instance, just as strings may have a `class` value of `string string-unquoted`, you may want to annotate keywords as `keyword keyword-if`, `keyword keyword-for`, and so on.

Ultimately, you can choose whatever class names you want, since you’re also writing the theme. But the more you adhere to these guidelines, the easier it will be for your custom grammar to exist alongside the built-in grammars.

## Write some rules

Let’s say we have this ruby code:

```ruby
module Foo
end
```

How do we want this to be marked up? Well, `module` and `end` are keywords, and `Foo` is an identifier of some sort. So maybe:

```html
<span class="keyword">module</span> <span class="entity">Foo</span>
<span class="keyword">end</span>
```

That feels like it shouldn’t be hard. Let’s try to write some rules for that:

```javascript
import { Grammar } from 'daub';

let RUBY = new Grammar('ruby', {
  keyword: {
    pattern: /\b(?:if|else|elsif|case|when|then|for|while|until|unless)\b/
  },

  'module': {
    pattern: /(module)(\s+)(A-Za-z_\w*)/,
    replacement: `<span class="#{name}">#{1}</span>#{2}<span class="entity entity-module">#{3}</span>`
  }

  // ...
});

export default RUBY;
```

Here’s what we’ve done:

* We instantiated a `Grammar` with a name of `ruby`. The `name` argument is mandatory for your “main” grammar, the one you export, because that's how a `Highlighter` will match it to `<code class="ruby">` elements later on. For sub-grammars of the sort we’ll soon write, it can be omitted. The second argument is an object that defines the grammar’s rules.

* The first rule is named `keyword`. This rule will match any of the keywords listed here and wrap them with the default replacement: a `span` tag whose `class` is set to the name of the rule. In this case, it’ll find the `end` and turn it into `<span class="keyword">end</span>`.

* The second rule is named `module`. This rule uses capture groups because it matches more than one kind of thing and is going to apply different class names to different pieces of the match text. In this case, we’re matching an entire module definition — not just the `module` keyword, but the identifier after it. (That’s why `module` isn’t in the pattern for the `keyword` rule).

### Replacement strings

The `replacement` property lets us specify a custom replacement. The syntax of the replacement string is identical to that of a Prototype [Template](http://api.prototypejs.org/language/Template/index.html), and broadly similar to Underscore’s [_.template utility](https://underscorejs.org/#template); it describes how to interpolate an object’s values into a string.

Unlike JavaScript’s template literals, the interpolations aren’t evaluated immediately, and cannot contain arbitrary JavaScript — just the properties of an object.

In Daub’s case, the object includes the rule’s name (`#{name}`), the full text of the match (`#{0}`), and the match data for any capture groups (`#{1}`, `#{2}`, etc.). So when the rule we defined above is matched by our sample source code, `#{name}` is replaced with `module`; and `#{1}`/`#{2}`/`#{3}` with `module`, ` `, and `Foo`, respectively.

If you don’t specify `replacement`, the rule will fall back to the default replacement string: `<span class="#{name}">#{0}</span>`. That’s why we were able to omit it from the `keyword` rule.

### Capture groups

If you use capture groups, you’ll have to be careful in how you write your regular expressions. Let’s look more closely at the pattern we defined for the `module` rule:

```js
/(module)(\s+)(A-Za-z_\w*)/
```

We define capture groups for the `module` keyword and for the name of the module because we want to wrap them in `span` tags. But why is there another capture group for _the space in between_?

TextMate-style grammars are typically parsed with the robust [Oniguruma][] regular expression library. One of its features is the ability to report not just the index of the overall match within a string but _also_ the indices of all the matched capture groups.

JavaScript’s regex engine doesn’t support this. The match data given to us will only tell us the index of the overall match. This leaves us with no simple way of acting on the capture group matches while leaving the uncaptured remainder of the string intact.

The workaround, annoying as it may be, is this: if your pattern contains _any_ capture groups, ensure that _every part of the pattern_ is captured in its own group. You can see this reflected in the `module` rule: we capture `\s+` because we have to, and then we pass it along in the replacement string as `#{2}`, untransformed in any way.

The bad news is that a `replacement` string will need to use each individual capture group so that parts of the original input aren’t lost. The good news, though, is that you’ll rarely have to write your own `replacement` string.

### The ‘captures’ shorthand

In fact, there’s a shorthand for the `module` rule that allows us to skip a `replacement` property altogether:

```javascript
import { Grammar } from 'daub';

let RUBY = new Grammar('ruby', {
  // ...

  'module': {
    pattern: /(module)(\s+)(A-Za-z_\w*)/,
    captures: {
      '1': 'keyword',
      '3': 'entity entity-module'
    }
  }

  // ...
});

export default RUBY;
```

The `captures` property, if it exists, will be interpreted by Daub as follows:

1. First, it signals your intent to use capture groups. That means that the default replacement string, `<span class="#{name}">#{0}</span>`, won’t work; Daub understands you’ll need a replacement string that takes capture groups into account. In this case, since our pattern defines three capture groups, it’ll build a replacement string: `#{1}#{2}#{3}`. You’ll notice that this replacement string doesn’t have any HTML in it, but that’s because…

2. Daub will read the values of `captures` and understand them to be matching capture groups to class names. So for capture groups 1 and 3, the matches will be transformed _before_ the replacement string is considered. By the time the match data reaches the replacement string, `module` will already be `<span class="keyword">module</span>`, and so on.

Just keep these things in mind:

* In this example, the implied replacement string has no `span` element wrapping the whole match, because it usually isn’t needed when capture groups are involved. If you _do_ want such a span, you don’t need to specify `replacement` manually; just add `wrapReplacement: true` to the rule definition.
* This doesn’t free you from the burden of having to capture every part of your pattern, even the things that don’t need tokenizing. It just frees you from having to type (e.g.) `#{1}#{2}#{3}#{4}#{5}`.
* Each part of the pattern should be captured in _exactly one_ group. If, somehow, you have a need to write nested capture groups, you’ll have to specify `replacement` manually.

#### How replacements work

Here’s how Daub decides the replacement string for a given rule:

1. Is this a simple rule with only a `pattern` property and nothing else? Daub will use the default replacement — `<span class="#{name}">#{0}</span>` — where `#{0}` is the entire text of the match, ignoring capture groups.
2. If not, have you defined a custom `replacement` property? That’s what Daub will use.
3. If not, have you defined a `captures` property? Daub will infer that you want to use capture groups, and will default to a simple replacement with the exact number of capture groups that your pattern uses. If your pattern uses four capture groups, Daub will default to a replacement of `#{1}#{2}#{3}#{4}`. It _will not_ wrap the output in a `span` with a class name corresponding to the name of the rule, since that’s usually not what complex rules want.
4. But if you have _also_ defined a `wrapReplacement` property with a value of `true`, Daub _will_ wrap the entire replacement in a container — e.g., `<span class="#{name}">#{1}#{2}#{3}#{4}</span>`, to continue the example above. The `wrapReplacement` property only has an effect when `captures` is specified _and_ `replacement` is absent.

## Caveats and implementation details

### Rules with identical names

Let’s say you wanted to write a grammar as follows:

```javascript
let FOO = new Grammar({
  string: {
    pattern: /* ... */
  },
  string: {
    pattern: /* ... */
  }
});
```

Since the rules list is an object literal, this won’t work — the second `string` rule will overwrite the first. But rule names have meaning, so you can’t just rename one, right?

In these cases, use an explicit `name` property in the rule:

```javascript
let FOO = new Grammar({
  string1: {
    name: 'string',
    pattern: /* ... */
  },
  string2: {
    name: 'string',
    pattern: /* ... */
  }
});
```

When present, `name` is used as the rule’s name instead of the object key. This frees up the key to be any arbitrary unique string without it affecting the grammar.

### Other caveats

* Though you define a separate regular expression for each rule, Daub will assemble each regular expression into **one giant regular expression**. Each pattern gets concatenated together as an alternation (`|`).

  This is an _almost_ leakproof abstraction; capture groups work the way that they should, and you can even use backreferences if you need them; they’ll get renumbered to point to the right group. The only thing that you need to keep in mind is that **you shouldn’t put flags on your regular expressions**, since they’ll just get discarded. This means that **case insensitivity is all-or-nothing within a language**.

  In some languages, like HTML, this is probably what you want. In more complicated stuff like JavaScript, total case insensitivity won't work at all. If an individual rule needs to be case-insensitive, you'll have to get creative in how you write its regular expression.

* When Daub parses a block of text, it executes its giant regex agains the text over and over again. When it finds a match, it infers the matching rule, applies the replacement text, and adds it to the output string. It then consumes however much of the input string got matched, and executes the regex against the remainder, continuing until there are no more matches.

  This means that **all else being equal, earlier rules will match before later rules**. Typically you want simple, generic rules (like comment syntax) to come toward the end of the grammar so that all would-be false positives can get matched by other rules first.

* Finally, **be aware of HTML entities**. Depending on what language you're parsing and how your CMS works, some characters might be HTML-encoded before they get parsed. Any code block containing sample HTML will, for obvious reasons, already be encoded in an HTML context, and languages that use greater-than/less-than symbols and/or ampersands (i.e., most of them) are likely to encounter encoded versions of those symbols.

  Daub cannot abstract away this difference for you. The safest approach is to write your patterns in a way that can accept (e.g.) either `<` _or_ `&lt;` — _and_ return the same token in the output.


## Advanced features

### Sub-grammars

Within your grammar file, you can create sub-grammars for special purposes. Separate from our `RUBY` grammar, let’s create a new specialized grammar whose job is to highlight escape sequences within strings:

```javascript
let ESCAPES = new Grammar({
  escape: {
    pattern: /\\./
  }
});
```

Since this grammar won’t ever be used directly by a `Highlighter`, it doesn’t need a name, so you can specify the rules object as the first argument.

In Ruby, escape sequences like `\n` only have special meaning in double-quoted strings; in single-quoted strings they’re interpreted literally. So if we include this rule in the main `RUBY` grammar, it might match tokens outside of the context of a double-quoted string, and that’s not what we want. This rule should only ever try to match when we already know we’re in a double-quoted string.

So how might that work? Let’s go back to the main grammar and define some rules for strings.

```javascript
let RUBY = new Grammar('ruby', {
  // ...

  'string string-single-quoted': {
    pattern: /(')([^']*?)(')/
  },

  'string string-double-quoted': {
    pattern: (/(")(.*?[^\\])(")/),
    wrapReplacement: true,
    captures: {
      '2': ESCAPES
    }
  }

  // ...
});

```

The `captures` shorthand makes life easy once again! Earlier, we learned that when a value in `captures` is a string, it’s telling Daub to wrap the match in a `span` with the specified class names. Now we learn that when a value in `captures` is a _grammar_, it’s telling Daub to use that grammar to transform the match before continuing.

Of course, these two kinds of values can be mixed and matched. If you wanted to tokenize the string delimiters themselves, you’d do something like this.

```javascript
let RUBY = new Grammar('ruby', {
  // ...

  'string string-double-quoted': {
    pattern: (/(")(.*?[^\\])(")/),
    wrapReplacement: true,
    captures: {
      '1': 'punctuation punctuation-string-begin',
      '2': ESCAPES,
      '3': 'punctuation punctuation-string-end'
    }
  }

  // ...
});
```

### The ‘before’ and ‘after’ callbacks

This is a good time to peel back the curtain and show you the callbacks that underpin the `captures` feature.

A rule can specify `before` and `after` callbacks that run before and after replacement. Our `ESCAPES` sub-grammar example could be written _less_ tersely:

```javascript
import { wrap } from 'daub/utils';

let RUBY = new Grammar('ruby', {
  // ...

  'string string-double-quoted': {
    pattern: (/(")(.*?[^\\])(")/),
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (m, context) => {
      m[1] = wrap(m[1], 'punctuation punctuation-string-begin');
      // Capture #2 contains the contents of the string. We can parse that
      // fragment of the match on its own before it gets used in the
      // replacement string.
      m[2] = ESCAPES.parse(m[2], context);
      m[3] = wrap(m[3], 'punctuation punctuation-string-begin');
    }
  }

  // ...
});
```

Conceptually, this is almost exactly how the `captures` shorthand is implemented internally, except that `captures` acts on the match _immediately prior to_ the `before` callback.

This is another example of the shorthand solving the 95%-of-the-time use case, but there are times when you need to do something more unconventional. Here’s an example from the JSX grammar:

```javascript
import { wrap } from 'daub/utils';

function handleJsxOrHtmlTag (tagName) {
  if (tagName.match(/^[A-Z]/)) {
    return wrap(tagName, 'tag tag-jsx');
  } else {
    return wrap(tagName, 'tag tag-html');
  }
}

let JSX_TAGS = new Grammar({
  'tag tag-open': {
    pattern: /* ... */,
    replacement: /* ... */,
    before (r, context) {
      r[2] = handleJsxOrHtmlTag(r[2]);
    }
  }
});
```

You get the idea. Rather than specify two near-identical rules, one for JSX elements and one for HTML elements, we capture them both with the same rule, and then use `before` to inspect a capture group and apply the proper class names.

The `after` callback is similar, but its first parameter is simply a string representing the already-transformed text. If it returns something, Daub will understand that you want to use that text _instead of_ the text it gave you.

The `before` and `after` callbacks don’t have to do any transforming, though; they can also be treated as simple lifecycle hooks. As explained later, the `context` argument can be used to store or read state, so a rule can decide to act differently based on what previous rules have observed.

### The ‘index’ callback: escaping the regex jail

Here's an example of something that is incredibly hard to tokenize properly:

```ruby
UH_OH = %Q{
  this { \{ #{thing} will be } a problem.
}
```

This is valid code. Ruby's `%Q` literal syntax lets you declare a multi-line string. The literal itself can be delimited with brackets, parentheses, or braces, among other things. If we use braces as delimiters, Ruby will still allow us to use braces within the string _without escaping them_, as long as they’re balanced! On top of that, the interpolation in the middle of the string uses braces.

We’re in trouble here because it's notoriously impossible to match balanced braces (or other character pairs) with a regular expression. Ruby knows not to end the literal until the braces are balanced, but a regex in JavaScript doesn’t have that capability. A greedy capture group will match too much, but a non-greedy capture group will match too little.

The way Daub gets around this is through the `index` callback. Ordinarily, when a rule’s pattern matches, the entire match is assumed to be part of the rule; but when `index` is present, Daub will invoke it to find out exactly how much of the match text should _actually_ be consumed.

This frees us from having to write a pattern that matches the _exact_ text that should be consumed. Instead, we need only write a pattern that captures _at least as much_ text as needs to be consumed:

```javascript
const RUBY = new Grammar({
  'string percent-q percent-q-braces': {
    // Capture group 2 is greedy because we don't know how much of this
    // pattern is ours, so we ask for everything up until the last brace in
    // the text. Then we find the balanced closing brace and act upon that
    // instead.
    pattern: /(%Q\{)([\s\S]*)(\})/,

    index: (matchText) => {
      // Pretend this is a function that returns the string index at which the
      // balanced closing brace is encountered.
      return balance(matchText, '}', '{', {
        startIndex: matchText.indexOf('{')
      });
    },

    // When we receive matches here, they won't be against the entire string
    // that the pattern originally matched; they'll be against the segment of
    // the string that we later decided we cared about.
    captures: {
      '1' 'punctuation punctuation-brace-start',
      '2': STRINGS,
      '3': 'punctuation punctuation-brace-end'
    },

    wrapReplacement: true
  },

  // ...
});
```

As its name implies, the `index` callback is expected to return a string index. Daub is saying, “here’s a bunch of text, and the end of your rule’s match is definitely in there somewhere; just tell me the string index.” We’re free to use whatever approach we like to determine that index.

In this case, how would we find the end of the `%Q` literal? We’d probably want to start right before the first `{` and step through the string character by character. After that first `{`, if we encountered a `}`, we’d stop. But if we encountered another `{` first, we’d understand that we’d then need to see _two_ `}`s before we could stop. _And_ we’d want to ignore any `{`s or `}`s that had backslashes before them, because in this context those would be literal braces with no special meaning.

In this code example, all `index` does is call a hypothetical function named `balance`, which apparently does all this work on its own. The good news is that `balance` is _not_ hypothetical — it actually exists, and you can import it from `daub/utils`!

To summarize:

* If you return a number X from the `index` callback, the rule will re-match against only the first X characters of the string before proceeding. The part of the string you didn't want will remain unparsed and unconsumed.
* If you don't return anything from the callback, _or_ return a negative number, the return value will be ignored, and Daub will take that to mean that the full match should be consumed after all. (This allows you to, e.g., return the result of a `String#indexOf` call without guarding against `-1` first.)
* The index you return _must_ result in a substring _that will still get matched by the same rule_. If the substring matches a different rule in the grammar, or no rule at all, an error will be thrown.

### Deferred loading of values in ‘captures’

It’s great to be able to define a grammar that delegates some captures to other grammars — except for how it constrains the _order_ in which you define your grammars. Recalling our earlier example…

```javascript
let MAIN = new Grammar('javascript', {
  'string string-single': {
    pattern: (/(')(.*?[^\\])(')/),
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    captures: {
      '2': ESCAPES
    }
  }
});
```

…you might notice that this requires `ESCAPES` to be defined _earlier_ in the file. If it were defined later in the file, your JS engine would raise a `ReferenceError` to punish you for messing with the **TEMPORAL DEAD ZONE**.

In simple cases like this, it’s easy enough to define your sub-grammars before defining the grammars that depend on them. In more complex cases, various sub-grammars might depend on each other in a way that’s impossible to untangle. For those cases, you can pass a function instead:

```javascript
let MAIN = new Grammar('javascript', {
  'string string-single': {
    pattern: (/(')(.*?[^\\])(')/),
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    captures: {
      '2': () => ESCAPES
    }
  }
});
```

If a property value inside `captures` is a function, Daub will wait until parse time to evaluate that function and figure out what it returns. In this example, we’re now free to define `ESCAPES` _anywhere_ in the file.

This would also allow you to re-parse a capture group with _the very grammar you’re currently defining_, which could be useful in certain cases. But think it through — recursion is nothing to be cavalier about.

### The ‘context’ object

When a `Highlighter` class starts highlighting a specific element, it creates a new `Context` object. This object is passed to each callback to allow a grammar (and any sub-grammars) to share state during a highlighting operation.

You can use it in two ways.

#### context.highlighter

First: you can use a context's `highlighter` property to get a reference to the owning `Highlighter` instance, if one exists. This lets you invoke a different grammar by name. For instance:

```javascript
const HTML = new Grammar({
  'embedded embedded-javascript': {
    pattern: (/(&lt;)(script|SCRIPT)(\s+.*?)?(&gt;)([\s\S]*?)(&lt;\/)(script|SCRIPT)(&gt;)/),
    replacement: /* ... */,

    before: (r, context) => {
      if (r[3]) {
        r[3] = ATTRIBUTES.parse(r[3], context);
      }
      if (context.highlighter) {
        r[5] = context.highlighter.parse(r[5], 'javascript', context);
      }
    }
  }
});
```

In this example, if the highlighter exists and knows about a grammar named `javascript` — i.e., if one was supplied via `Highlighter#addGrammar` — it’ll highlight the contents using that grammar. If not, it’ll silently return the text it was given.

(We still check for `context.highlighter`’s presence because it’s not guaranteed to be there — e.g., when you’re parsing text manually by calling `Grammar#parse`.)

This lets the HTML grammar create a “soft” dependency on the JavaScript grammar without actually importing it. The user could opt out of syntax highlighting within `script` blocks simply by not adding any grammar named `javascript` to their highlighter instance. Or they could specify their own JavaScript grammar instead — which they wouldn’t be able to do if the built-in HTML grammar directly imported the built-in JavaScript grammar.

#### Context as ‘Map’

You can also use the context object to share state across rules. `Context` wraps an instance of `Map`; the `Context#set` and `Context#get` methods work almost exactly like their `Map` equivalents, except that `get` takes a second argument for a fallback value.

As an example of how this can be used, here's one way a grammar can resolve ambiguity when parsing tokens with multiple meanings:

```javascript
const RUBY = new Grammar('ruby', {
  'block block-braces': {
    pattern: /(\{)(\s*)(\|)([^|]*?)(\|)/,
    replacement: "<b class='#{name}'><span class='punctuation brace brace-begin'>#{1}</span>#{2}<span class='punctuation pipe'>#{3}</span>#{4}<span class='punctuation pipe'>#{5}</span>",
    before: (r, context) => {
      // Keep a LIFO stack of scopes. When we encounter a brace that
      // we don't recognize later on, we'll pop the last scope off of the
      // stack and highlight it thusly.
      let stack = context.get('bracesStack', []);
      stack.push('punctuation brace brace-end');

      // Parse the parameters inside the block.
      r[4] = parseParameters(r[4], BLOCK_PARAMETERS, context);
    }
  },

  // (other rules that consume opening braces, then…)

  'meta: close brace': {
    pattern: /\}/,
    replacement: "#{0}",
    after: (text, context) => {
      let stack = context.get('bracesStack', []);
      let scope = stack.pop();
      if (!scope) return;
      return `<span class='${scope}'>${text}</span></b>`;
    }
  }
});
```

This is an offbeat approach, but it lets us employ a different sort of brace-balancing strategy than the `index`-callback approach we used earlier. The `block-braces` will match an opening brace that is followed by block parameters, but we don't try to match the closing brace; we simply push a scope onto the shared `bracesStack` array to serve as a marker for the closing brace we’re expecting later.

In this grammar, any other rules that deal with braces would _either_ (a) consume both the opening brace and the closing brace _or_ (b) behave similarly to the `block-braces` rule by consuming only the opening brace and adding a scope to the `bracesStack` array.

The `meta: close brace` rule, then, ends up acting as a catch-all that can close the blocks that other rules opened. It will match whenever we encounter a closing brace that hasn't already been matched by a more specific rule. When that happens, we pop the last item off of `bracesStack` to determine how to annotate the closing brace.

(Note how, in this example, we use a `b` element for groups instead of `span`: `b` is also nonsemantic, and we can style it as `font-weight: normal` in the theme. Using a different tag for the groups should result in much less confusion when you’re looking at the grammar a year afterward — you won’t wonder “…why does this rule close more `spans` than it opened?”)

Contexts are not shared across elements. A new context is created whenever Daub begins highlighting a particular element with a particular language — or you can pass an existing context as the second argument to `Grammar#parse` (or the third argument to `Highlighter#parse`). The `captures` shorthand does this automatically, but if you invoke your sub-grammars manually as part of a `before` callback, you’ll have to remember to pass that `context` argument yourself.

### The ‘extend’ method

If you’re writing several grammars, you might want some of them to share rules. Instead of duplicating them, you can use `Grammar#extend` to copy rules from another grammar:

```javascript
// "Values" are valid on the right side of default params.
let VALUES = new Grammar({ /* */ });

// But they're valid everywhere else, too.
let MAIN = new Grammar('ruby', { /* */ });

// So we can copy them into the main grammar.
MAIN.extend(VALUES);
```

In this example, the `MAIN` grammar is modified in place, but `VALUES` is not. Each of the rules in `VALUES` will be added to the end of `MAIN`'s rules list. (Remember: order matters in grammars. All else being equal, earlier patterns will match before later ones.)

### Lexers

As described earlier, `index` callbacks let you use any strategy you want to determine where a match ends. The `balance` utility functions as a sort of rudimentary lexer, stepping through a string and changing its internal state based on what it encounters, until it reaches a token that satisfies its balancing criteria.

For more complex scenarios, you can use Daub to write more advanced lexers that do more complex tokenization. The `Lexer` class was invented for the purpose of matching where JSX blocks begin and end, but has since been employed in the HTML grammar and elsewhere.

It’s too big of a topic for this document, but you can [read more about lexers](./lexers.md) if you like.


## Utilities

Daub defines a `Utils` module with a few helper functions. Most users won't need to think about these, but they'll come in handy for grammar authors.

### balance(source, token, paired[, options])

Given text `source`, will search for a “balanced” occurrence of `token`. If it encounters the `paired` token (e.g., an opening brace), it will increase its “stack” size by 1. If it encounters `token` (e.g., a closing brace) while its stack size is greater than `0`, it will decrement the stack and keep searching. If it encounters `token` while its stack size is equal to `0`, it will declare victory and return the index of the start of that token. Both `token` and `paired` can be of arbitrary length.

As the name implies, this is useful for balancing paired characters like braces and parentheses. Use it in your `index` callbacks.

The options:

* `startIndex`: The index in the string where the search should start. Defaults to `0`.
* `stackDepth`: The initial depth of the stack. Defaults to `0`.

### compact(string)

Given a multiline string, removes all newlines, along with all space at the _beginnings_ of lines. Lets us use indentation and multiple lines to craft more readable `replacement` strings, yet have all that extraneous space stripped out before it gets into the replacement.

```javascript
import { Utils } from 'daub';

Utils.compact(`
  <span class="string string-quoted">
    <span class="punctuation">#{1}</span>
    #{2}
    <span class="punctuation">#{3}</span>
  </span>
`);

//-> "<span class="string string-quoted"><span class="punctuation">#{1}</span>#{2}<span class="punctuation">#{3}</span></span>"
```

### wrap(string, className)

Same shorthand used internally by `captures`. Wraps `string`, if present and truthy, with a `span` whose `class` attribute is equal to `className`. If `string` is falsy — empty string, `null`, `undefined` — `wrap` will return an empty string.

```javascript
import { Utils } from 'daub';
Utils.wrap('foo', 'bar');
//-> <span class='bar'>foo</span>
Utils.wrap(null, 'bar');
//-> ""
```

### VerboseRegExp

Verbose regular expressions are _great_ in languages that support them. They make complex patterns _much_ more readable. But JavaScript doesn't support them out of the box.

So Daub also exports a utility function called `VerboseRegExp`. It's a [tagged template literal][] that allows you to define a verbose regular expression using backticks. Literal whitespace has no meaning (use `\s` instead), and you can use `#` to mark comments at the ends of lines. This makes long regular expressions way easier to grok.

```javascript
import { VerboseRegExp } from 'daub';

let pattern = VerboseRegExp`
  (\s+)  # This comment will be ignored,
  (?:    # and all literal whitespace
    \w+  # will be stripped.
   (\s*) # (No double-escaping needed!)
  )?
`;
```
To match a literal `#` character in the regex, use `\#`.

`VerboseRegExp` works like [String.raw][] — it acts on the raw string literal before escape sequences are interpreted. So no “double-escaping” is necesssary; for example, you can write `\n` instead of `\\n` (just like you would in a regex literal) without it turning into a literal newline.

(Sadly, this doesn't work for backreferences to capture groups; `\1` needs to be written as `\\1`. This is because of a [spec oversight](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates_and_escape_sequences) that will eventually be corrected in the language.)

[String.raw]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw
[tagged template literal]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals
[Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[Oniguruma]: https://github.com/kkos/oniguruma
