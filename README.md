# Daub

Syntax highlighting for the browser and elsewhere. Like the earlier [Fluorescence][], but written anew in ES6 with new features.

Daub is the great-great-grandchild of Dan Webb’s Unobtrusive Code Highlighter, which was one of the early client-side code highlighters. Dan's script was itself inspired by Dean Edwards’s [star-light][].

## Usage

### Annotate your `code` elements with class names

To highlight a block of code, you must first give its `code` element a class name equal to the name of the grammar you've defined. Above, we defined a grammar named `ruby`, so HTML that looks like this:

```html
<pre><code class="ruby">module Foo
end</code></pre>
```

will get transformed into this:

```html
<pre><code class="ruby"><span class='keyword'>module</span> <span class='module'>Foo</span>
<span class='keyword'>end</span></code></pre>
```

If you’d rather use more specific class names, like (e.g.) `language-ruby`, you can define a custom class prefix as described below.

### Set up your highlighter

The `Highlighter` class manages code highlighting on a page. Create an instance:

```javascript
import Daub from 'daub';
import RUBY from 'daub/grammars/ruby';

const highlighter = new Daub.Highlighter();
highlighter.addElement(document.body);
highlighter.addGrammar(RUBY);
```

The highlighter constructor takes an optional `options` argument.

* `classPrefix`: A token that the highlighter should prepend to class names before it starts searching for code blocks. If your Ruby code has a class name of `language-ruby`, you’d specify a value of `"language-"` here. Defaults to an empty string.

You can add any element, and any _named_ grammar, to a highlighter.

```javascript
highlighter.highlight();
```

Each time `highlight` is called, the highlighter will scan for new code blocks. You can call `highlight` again whenever there might be new content to be highlighted.

## How does it work?

Regular expressions and voodoo.

I've iterated on this approach to syntax highlighting because I find it easy to reason about and write new grammars for, and because it’s quite fast.

A grammar consists of a series of patterns, each with its own replacement. When parsing text, a grammar consolidates all those patterns into _one_ gigantic regular expression and iteratively matches it against the target string. The first match gets extracted from the string, replaced, and added to the destination string. This process repeats until the entire target string is consumed.

## How do I write my own grammar?

### Write some rules

Grammars look like this:

```javascript
import { Grammar } from 'daub';

let RUBY = new Grammar('ruby', {
  keyword: {
    pattern: /\b(?:if|else|elsif|case|when|then|for|while|until|unless)\b/
  },

  'entity module': {
    pattern: /(module)(\s*)(A-Za-z_\w*)/,
    replacement: "<span class='keyword'>#{1}</span>#{2}<span class='#{name}'>#{3}</span>"
  }

  // ...
});

export default RUBY;
```

Here's what we just did:

* We instantiated a `Grammar` with a name of `ruby`. (The “main” grammar, the one you export, should be named; other grammars don't need names.) The second argument is an object that defines the grammar's rules.
* We defined a rule named `keyword`. This rule will replace any matches with the default replacement: placing the entire match inside a `span` tag whose `class` is set to the name of the rule. In this case: `<span class='keyword'>if</span>`.
* We defined another rule named `entity module`. This rule will replace any matches with the string specified in the `replacement` property — substituting `#{1}` with the first capture, `#{2}` with the second, et cetera. In the replacement string, `#{name}` refers to the name of the rule (`entity module`, in this case).

  You can use `#{0}` to represent the whole match, but if you're supplying a custom replacement, you'll probably want to divide your pattern up into capture groups. In that case, make sure that all the pattern's parts are captured so that you don't lose anything during transformation.

### Write some CSS for the syntax

```css
code {
  background-color: #000;
  color: #fff;
}

code .keyword {
  color: #f60;
}

code .entity {
  color: #fc0;
}

code .module {
  text-decoration: underline;
}
```

And so on. Consult `test/theme.css` for a sample theme.

The naming conventions of grammars are influenced heavily by TextMate grammars — which have also influenced the naming conventions of Atom, Sublime Text, and VS Code grammars — so this may be familiar to you already. Some conventions to keep in mind:

* `keyword`: Control words, operators, and the like. Examples: `if`, `else`, `==` (in C-like languages); `@media` (in CSS)
* `entity`: A function, class, or module name (when defined, not when invoked). Examples: `foo` in `function foo`, `Highlighter` in `class Highlighter`
* `constant`: An invariant — e.g., a hex code, a constant, a symbol. Examples: `:something` (in Ruby), `PI`, `#fff`
* `storage`: Type annotations and other modifiers. Examples:
  * JavaScript: `var`, `let`, `const`, `static`
  * C: `unsigned`, `int`, `char`, `volatile`
* `string`: Strings of all kinds. Add a second class name for the kind: `string-single-quoted`, `string-double-quoted`, `string-unquoted`, et cetera.
* `support`: Common functions/classes/values in the standard library. Examples: `replaceChild` (in DOM/JavaScript), `strpos` (in PHP)
* `comment`: Comments and other things that are ignored by the program.
* `regexp`: Regular expression literals.

Some stuff doesn't fit easily into this taxonomy, and that's fine. Simplicity is more important than fastidious order.

### Feed text to your parser

Once you define a grammar, you can use its `parse` method to parse arbitrary text.

```javascript
RUBY.parse(
`module Foo
end`);

//-> <span class='keyword'>module</span> <span class='module'>Foo</span>
// <span class='keyword'>end</span>

```

You might find this useful just by itself, in fact. The `Grammar` class uses no browser APIs, so you could theoretically use it server-side to highlight code.

The main value of this, though, is in defining “sub-grammars” within your grammar and feeding them portions of text to parse.

## Advanced usage

### Sub-grammars

Within your grammar, you can create anonymous grammars for special purposes.

```javascript
let ESCAPES = new Grammar({
  'escape': {
    pattern: /\\./
  }
});
```

(Remember, the `name` argument is optional; if you’re not adding a grammar to a `Highlighter` instance, it doesn’t need a name at all.)

An “escapes” grammar is perhaps too specialized to apply broadly, so instead of adding it to our main grammar, we define it separately and call it when we know we're dealing with the contents of strings. Which brings us to…

### Callbacks

JavaScript regular expressions aren't quite robust enough on their own to parse certain ambiguous constructs. But a grammar is just JavaScript, and much of what we can't do with pure regular expressions can be done with code. So Daub allows for callbacks that hook into the replacement process.

#### The ‘before’ and ‘after’ callbacks

The `before` callback lets you modify the contents of the replacement array before a rule generates its replacement string. Your callback should _either_ mutate the provided array directly and return nothing _or_ create and return a whole new array. Any value returned from the `before` callback will be assumed to be the new replacement array.

This is how we’ll “pre-parse” certain captures with sub-grammars.

```javascript
import { Grammar } from 'daub';

let ESCAPES = new Grammar({
  'escape': {
    pattern: /\\./
  }
});

let MAIN = new Grammar('javascript', {
  'string string-single': {
    pattern: (/(')(.*?[^\\])(')/),
    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
    before: (r, context) => {
      // Capture #2 contains the contents of the string. We can parse that
      // fragment of the match on its own before it gets used in the
      // replacement string.
      r[2] = ESCAPES.parse(r[2]);
    }
  }
});
```

This next example is more elaborate: it allows us to highlight the default values in function parameters.

```javascript
import { Grammar, Utils } from 'daub';
let { VerboseRegExp } = Utils;

// Define a grammar for parsing "values" -- i.e., things that can be on the
// right side of an equals sign, or used as default parameters in method
// definitions.
let VALUES = new Grammar({
  // ...
});

function wrapParameter (param) {
  return `<span class="variable parameter">${param}</span>`;
}

const DEFAULT_VALUE_PATTERN = /^(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*)/;
function handleParameters (str, context) {
  // Consider each parameter separately.
  let params = str.split(/,\s/);

  params = params.map((param) => {
    if ( DEFAULT_VALUE_PATTERN.test(param) ) {
      // This is a parameter with a default value.
      param = param.replace(DEFAULT_VALUE_PATTERN, (match, ...m) => {
        let [space, name, eq, value] = m;

        // The param name should get highlighted just like it would if there
        // were no default value.
        name = wrapParameter(name);

        // The value should get parsed by our special `VALUES` grammar.
        value = VALUES.parse(value, context);

        return space + name + eq + value;
      });
    } else {
      // This is an ordinary parameter.
      part = wrapParameter(part);
    }
  });

  return params.join(', ');
}

const RUBY = new Grammar('ruby', {
  'meta: method definition': {
    // Match the whole line, broadly capturing anything inside parentheses.
    pattern: VerboseRegExp`
      (def)(\s+)                 # groups 1, 2: keyword
      ([A-Za-z_][A-Za-z0-9_!?]+) # group 3: method name: letter or underscore
                                 # followed by any word character,
                                 #  underscore, !, or ?
      (?:
       (\s*)                     # group 4: optional space before argument list
       (\()                      # group 5: opening paren
       (.*)                      # group 6: everything between parens
       (\))                      # group 7: closing paren
      )?                         # (all optional)
    `,

    // The end of this replacement looks funny because some of those groups
    // will get parsed & highlighted _before_ this replacement happens.
    replacement: "<span class='keyword'>#{1}</span>#{2}<span class='entity'>#{3}</span>#{4}#{5}#{6}#{7}",

    before: (r, context) => {
      // Here we get a chance to modify the array of replacements before the
      // replacement actually happens. Let's highlight the method parameters,
      // which reside in replacement #6.

      if (r[6]) { r[6] = handleParams(r[6], context); }

      // Remember: it's easier to modify the replacements in-place and return
      // nothing. But it's also possible to return a different array if you
      // need to.
    },

    after: (text, context) => {
      // The after callback is much simpler; it lets you act on the text
      // after it's already been transformed. Included in this example just
      // for illustration.
      return text;
    }
  }
});

// We can mixin the "values" grammar we defined earlier instead of having to
// write those rules over again.
RUBY.extend(VALUES);

export default RUBY;
```

Hence we don't need to write a grammar to transform Ruby parameters; sometimes the transformations are straightforward enough that they can be done with more conventional string manipulation techniques.

This approach also gives you the flexibility to write rules more generically. For example, in JavaScript, instead of having one rule for named function expressions (`function foo () {}`) and one for anonymous function expressions (`function () {}`), you can define a pattern with an optional capture group and then use a `before` callback to highlight the function name only if it's present.

The `after` callback is illustrated in the above example. It's a chance to modify the text after replacement. You can also use it simply as a hook point for keeping track of state. If it does return something, Daub will use that as the replacement for the pattern matched in the raw source text.

#### The ‘index’ callback

It's notoriously impossible to match balanced parentheses (or other character pairs) with a regular expression, yet this need comes up rather often when trying to highlight code.

Here's an example:

```ruby
UH_OH = %Q{
  this { \{ #{thing} will be } a problem.
}
```

Ruby's `%Q` literal syntax lets you declare a multi-line string. The literal itself can be delimited with brackets, parentheses, or braces, among other things. But if we use braces, we run into trouble, because we're also using braces inside of the literal.

Ruby knows not to end the literal until the braces are balanced. But with a regex, you're stuck. A greedy capture group will match too much, but a non-greedy capture group will match too little.

The way Daub gets around this is to allow a rule to specify a callback called `index`. When called, the callback can use whatever logic it likes to find the actual portion of that string that it can match, and should return the index of the last character in that substring.

In other words, we can write a pattern that asks for much more of the text than we probably need, then use approaches other than regular expressions to find out how much of the text we _actually_ need.

```javascript
function balance (string, token, paired, startIndex) => {
  // A hypothetical function that searches through a string manually, keeping
  // track of balance, until it finds the first balanced occurrence of
  // `token`; it then returns the index of that character. (The `utils`
  // export contains a similar convenience function.)
}

const RUBY = new Grammar({
  'string percent-q percent-q-braces': {
    // Capture group 2 is greedy because we don't know how much of this
    // pattern is ours, so we ask for everything up until the last brace in
    // the text. Then we find the balanced closing brace and act upon that
    // instead.
    pattern: /(%Q\{)([\s\S]*)(\})/,

    index: (matchText) => {
      return balance(matchText, '}', '{', matchText.indexOf('{'));
    },

    replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",

    // When we receive matches here, they won't be against the entire string
    // that the pattern originally matched; they'll be against the segment of
    // the string that we later decided we cared about.
    before: (r, context) => {
      r[2] = STRINGS.parse(r[2], context);
    }
  },

  // ...
});
```

To summarize:

* If you return a number X from the `index` callback, the rule will re-match against only the first X characters of the string before proceeding. The part of the string you didn't want will remain unparsed.
* If you don't return anything from the callback, or return a negative number, the return value will be ignored. This allows you to, e.g., return the result of a `String#indexOf` call without guarding against `-1` first.
* The index you return _must_ result in a substring that will still get matched by the operative rule. If the substring matches a different rule in the grammar, or no rule at all, an error will be thrown.

### The ‘context’ object

When a `Highlighter` class starts highlighting a specific element, it creates a new `Context` object. This object is passed to each callback to allow a grammar (and any sub-grammars) to share state during a highlighting operation.

You can use it two ways.

First: you can use a context's `highlighter` property to get a reference to the owning `Highlighter` instance. This lets you invoke a different named grammar by name. For instance:

```javascript
const HTML = new Grammar({
  'embedded embedded-javascript': {
    pattern: (/(&lt;)(script|SCRIPT)(\s+.*?)?(&gt;)([\s\S]*?)(&lt;\/)(script|SCRIPT)(&gt;)/),
    replacement: /* ... */,

    before: (r, context) => {
      if (r[3]) {
        r[3] = ATTRIBUTES.parse(r[3], context);
      }
      // If the highlighter knows about a grammar named "javascript", it'll
      // parse the text with that grammar; otherwise it'll return the text
      // without transformation.
      r[5] = context.highlighter.parse(r[5], 'javascript', context);
    }
  }
});
```

In this example, if the highlighter knows about a grammar named `javascript` — i.e., if one was supplied via `addGrammar` — it'll highlight the contents using that grammar. If not, it'll silently return the text it was given.

Second: you can share state across rules by using the context as a hash. The `Context#set` and `Context#get` methods work almost exactly like those on an ES6 [Map] object, except that `get` takes a second argument for a fallback result.

As an example of how this can be used, here's one way a grammar can resolve ambiguity when parsing tokens with multiple meanings:

```javascript
const RUBY = new Grammar('ruby', {
  'block block-braces': {
    pattern: /(\{)(\s*)(\|)([^|]*?)(\|)/,
    replacement: "<b class='#{name}'><span class='punctuation brace'>#{1}</span>#{2}<span class='punctuation pipe'>#{3}</span>#{4}<span class='punctuation pipe'>#{5}</span>",
    before: (r, context) => {
      // Keep a LIFO stack of scopes. When we encounter a brace that
      // we don't recognize later on, we'll pop the last scope off of the
      // stack and highlight it thusly.
      let stack = context.get('bracesStack', []);
      stack.push('punctuation brace');

      // Parse the parameters inside the block.
      r[4] = parseParameters(r[4], BLOCK_PARAMETERS, context);
    }
  },

  // (other rules that consume opening braces)

  'meta: close bracket': {
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

In this approach, we match an opening brace that is followed by block parameters, but we don't try to match the closing brace. We simply push a scope onto the shared braces stack to serve as a marker for the closing brace we're expecting later. In this grammar, any other rules that deal with braces should _either_ (a) consume both the opening brace and the closing brace _or_ (b) match _only_ the opening brace and use a callback to add its scope to the stack.

The `meta: close bracket` rule, then, ends up acting as a catch-all that can close the blocks that other rules opened. (Note how we use a `b` element for groups instead of `span`: `b` is also nonsemantic, and we can style it as `font-weight: normal` in the theme.)

It will match whenever we encounter a closing brace that hasn't already been matched by a more specific rule. In that case, we pop the last item off of the shared braces stack to figure out how we should highlight the closing brace.

Contexts are not shared across elements. A new context is created whenever Daub begins highlighting a particular element with a particular language — or you can pass an existing context as the second argument to `Grammar#parse` (or the third argument to `Highlighter#parse`). You should do this if you use sub-grammars for contextual parsing, so that the sub-grammars can share state with the parent grammar.


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


### Utilities

Finally, Daub defines a `Utils` module with a few helper functions. Most users won't need to think about these, but they'll come in handy for grammar authors.

#### balance(source, token, paired[, options])

Given text `source`, will search for a “balanced” occurrence of `token`. If it encounters the `paired` token, it will increase its “stack” size by 1, and if it encounters `token` while its stack size is greater than `0`, it will decrement the stack and keep searching. Both `token` and `paired` can be of arbitrary length.

As the name implies, this is useful for balancing paired characters like braces and parentheses. Use it in your `index` callbacks.

The options:

`startIndex`: The index in the string where the search should start. Defaults to `0`.
`stackDepth`: The initial depth of the stack. Defaults to `0`.

#### compact(string)

Given a multiline string, removes all newlines, along with all space at the beginnings of lines. Lets us define replacement strings with indentation, yet have all that extraneous space stripped out before it gets into the replacement.

#### wrap(string, className)

Shorthand:

```javascript
wrap('foo', 'bar');
//-> <span class='bar'>foo</span>
```

#### VerboseRegExp

Verbose regular expressions are _great_ in languages that support them. They make complex patterns _much_ more readable. But JavaScript doesn't support them out of the box.

So Daub also exports a utility function called `VerboseRegExp`. It's a [tagged template literal][] that allows you to define a verbose regular expression using backticks. Literal whitespace has no meaning, and you can use `#` to mark comments at the ends of lines. This makes long regular expressions way easier to grok.

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

`VerboseRegExp` works like `[String.raw][]` — it acts on the raw string literal before escape sequences are interpreted. So you can write (e.g.) `\n` instead of `\\n` (just like you would in a regex literal) without it turning into a literal newline.

(Sadly, this doesn't work for backreferences to capture groups; `\1` needs to be written as `\\1`. This is because of a [spec oversight](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals_and_escape_sequences) that will eventually be corrected in the language.)

## Events

Daub fires a few events that can be used to hook into the highlighting life cycle.

### daub-will-highlight

Fires on an element whose contents are about to be replaced.

Bubbles; can be cancelled. (Calling `preventDefault` on the event will cancel the content replacement.)

Properties on `event.detail`:

* `highlighter`: the `Highlighter` instance.
* `grammar`: the `Grammar` instance.
* `fragment`: a DOM `DocumentFragment` with the content that's about to be inserted. A handler can mutate this fragment before it gets inserted, or assign a new fragment to `event.detail.fragment` to substitute something else entirely.

### daub-highlighted

Fires on an element whose contents we just replaced.

Bubbles; cannot be cancelled.

Properties on `event.detail`:

* `highlighter`: the `Highlighter` instance.
* `grammar`: the `Grammar` instance.

## ES6

Daub is written in ES6 and uses ES6 imports, so you'll need to transform it one way or another before it runs in a browser or in Node. The `build` command uses [Rollup][] to generate an all-inclusive package for the browser, but many will prefer to grab the source files so that they can integrate them into their existing transpilation-and-bundling toolchain.

## Caveats

When you define a grammar, you write one regular expression for each rule. When Daub compiles that grammar, it assembles each regular expression into **one giant regular expression**. Each pattern gets concatenated together as an alternation (`|`).

When Daub parses a block of text, it executes that one regex against the text over and over again. When it finds a match, it figures out which rule got matched, applies the replacement text, removes all text before the match index from the source string, and appends it to the destination string. It then continues parsing from the end of the previous match.

This means that **all else being equal, earlier rules will match before later rules**. Typically you want simple, generic rules (like comment syntax) to come toward the end of the grammar so that all would-be false positives can get matched by other rules first.

It also means that **you shouldn't put flags on your regular expressions**. If you want a grammar to be case-insensitive, pass `{ ignoreCase: true }` as the last argument in the `Grammar` constructor.

This further means that **case insensitivity is all-or-nothing within a language**. In some languages, like HTML, this is probably what you want. In more complicated stuff like JavaScript, total case insensitivity won't work at all. If an individual rule needs to be case-insensitive, you'll have to get creative in how you write its regular expression.

Finally, **be aware of HTML entities**. Depending on what language you're parsing and how your CMS works, some characters might be HTML-encoded before they get parsed. Any code block containing sample HTML will, for obvious reasons, already be encoded in an HTML context. The safest approach is to write your patterns in a way that can accept (e.g.) either `<` _or_ `&lt;`.


[Fluorescence]: https://github.com/savetheclocktower/fluorescence/
[Rollup]: https://rollupjs.org/
[String.raw]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw
[tagged template literal]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals
[Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[star-light]: http://dean.edwards.name/star-light/