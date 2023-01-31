# Lexers

The purpose of Daub is to do syntax highlighting according to my high standards without compromises. If I wanted to compromise, I’d just use Prism, and I don’t mean that as an insult — Prism does a far more _sensible_ cost/benefit analysis than Daub.

My workflow has always been as follows:

1. Write a simple code highlighter
2. Write a blog post
3. Observe to myself, “hmm, this code I wrote for the blog post doesn’t highlight the way I think it should.”
4. Change the code highlighter in whatever way is necessary to produce the outcome I want
5. Declare victory
6. Wait six months
7. Return to step #2

This resulted in waves of (a) adding complexity, then eventually (b) streamlining the complexity with refactors.

## Origins

Highlighting JSX presented my first real challenge. It’s a headache for TextMate-style grammars in general, but with extra features of Oniguruma compared to JavaScript’s regex engine mean that IDEs can do decently enough.

A JSX grammar is an ordinary JavaScript grammar, except with a new sort of value type: a JSX element. JSX elements can appear wherever a literal value can appear, and the contents of a JSX element can be arbitrarily complicated.

Consider this block:

```js
function SomeComponent () {
  return <div class="SomeComponent">
    <SomeOtherComponent callback={() => foo + 1}>
      You have {numMessages} {numMessages > 1 ? 'messages' : 'message'}.
      {'I could also put </div> within a string in this interpolation just to be mean!'}
    </SomeOtherComponent>
    <div>Lorem ipsum</div>
  </div>;
}
```

Obviously this is unidiomatic React code, but it’s a bit exaggerated to illustrate the challenges here:

* Daub needs to know how to balance this correctly. When it encounters `<div `, it can easily understand that `</div>` is the only token that can close the element, but it will encounter the substring `</div>` _several times_. For balancing, it needs to ignore the `</div>` in a literal string and the `</div>` that closes a child element. So we need a way to distinguish between them.

* Interpolation can happen almost anywhere inside of JSX. Wherever it happens, we need to recognize it, then re-parse the interpolated text _as JavaScript_ so that the stuff inside of it is highlighted.


## Lexer

Most of the other balancing we’ve needed to do in Daub is handled by the ~20 lines of code that make up `Utils.balance`, but we need something heavier-duty for JSX.

To solve this problem, I created something that I called `Lexer`. (Don’t read that too literally; I don’t know if it 100% matches the formal computer science definition of a lexer, but it was close enough for my brain.)

Here’s how it works:

* A `Lexer` is instantiated with an array of rules, broadly similar to the rules in Daub grammars. Each rule has a `name` (string, mainly for debugging) and a `pattern` (regular expression).
* By default, a rule matches when its `pattern` matches, though a rule can impose further constraints by defining a function named `test`; called with the candidate match as an argument, its return value will determine whether the rule _actually_ matches.
* When given a string, a lexer will try to match the string against each of its rules. If more than one rule matches, the lexer will pick the one that matched as close to the start of the string as possible.
* A rule does not necessarily have to match at the beginning of the string, though it can use the `^` anchor in its pattern to enforce this. If a rule matches at index 7, the substring from 0-6 will still be consumed, but treated as raw text. If more than one rule matches, the lexer will prefer whichever one results in the least raw text, with ties favoring earlier rules.
* Beyond that, each rule can do one of several things when its `pattern` matches:
  * It can delegate further processing to a _different_ lexer until such time as that lexer decides it’s done consuming text, at which point it will continue consuming whatever wasn’t consumed by the sub-lexer.
  * It can be defined as `final` — i.e., matching this rule signals that the lexer is done and can return to whatever called it. `final` can be either a boolean or a function which can test the match before deciding on finality.
* A lexer will run until
  * it runs out of string to consume, or
  * it encounters a rule marked as `final`, or
  * nothing else in the remainder of the input string matches any of the lexer’s rules.
* When a lexer ends processing, control will return to whatever invoked it — either user code or another lexer. The return value of the lexer is an object containing the number of characters consumed, the portion of the string that went unparsed, and a `tokens` property containing a decorated syntax tree of the portion that _was_ parsed.

## Balancing

To conceptualize this better, let’s take the concrete example of parsing the following JSX:

```js
function SomeComponent () {
  return <SomeOtherComponent foo="bar" />;
}

function SomeOtherComponent () {
  return <SomeFurtherComponent troz="zort" />;
}
```

We’ll skip ahead to the first occurrence of JSX and reason through it from there:

* A Daub grammar recognizes a JSX construct. It greedily matches as much text as could possibly be part of that construct. The `index` function uses `Utils.balanceByLexer(matchText, JSX_TAG_ROOT)`, a function which uses a `Lexer` to figure out where the match should end.
* `Utils.balanceByLexer` calls the `run` method and supplies `matchText` as an argument.
* The lexer will receive the following text…

  ```
    <SomeOtherComponent foo="bar" />;
  }

  function SomeOtherComponent () {
    return <SomeFurtherComponent troz="zort" />;
  ```

  …because the grammar has selected the longest possible match.

* As the “root” lexer, `JSX_TAG_ROOT` creates a `Context` instance to pass around so that information learned by one lexer can be acted upon by another. Certain rules hook into the `test` callback as an opportunity to set a flag, and other rules consuled the context in their `final` callbacks to dynamically decide whether to stop parsing.
* `JSX_TAG_ROOT` has a rule to match and consume the opening angle bracket (`<`), after which it delegates the next step to a lexer named `JSX_TAG_NAME`.
* `JSX_TAG_NAME` has rules for matching HTML elements (`div`, `address`, what-have-you) and JSX elements (`SomeComponent`, `SomeOtherComponent`). In this case, the JSX-element-name rule matches `Something` and delegates to `JSX_INSIDE_TAG` for the next step.
* `JSX_INSIDE_TAG` has rules for the different things we could encounter after the tag name: one for interpolation (like when you do `<Something {...props} />`), one for attributes (`<Something foo="bar" />`), one for a closing angle bracket (`<div>`), and one for a self-closing tag (`<Something />`) In this case, it consumes the attribute name `foo` and hands off to `JSX_ATTRIBUTE_SEPARATOR`.
* `JSX_ATTRIBUTE_SEPARATOR` matches the `=` and hands off to `JSX_ATTRIBUTE_VALUE`.
* `JSX_ATTRIBUTE_VALUE` has rules for the two things we can encounter here: either a simple string or an interpolation. In this case, it’s a string, so it matches `"` and hands off to `JSX_STRING`.
* `JSX_STRING` will consume up through another `"`, though it has an additional rule for escaped characters so that `\\"` doesn’t flummox it. (The text `bar` is consumed even though it was not matched, since the string-end rule matched after it and was the only rule to match.) The string-end rule is marked as `final: true`, so after consuming `bar"`, **it stops**, and control goes back to `JSX_ATTRIBUTE_VALUE`.
* None of `JSX_ATTRIBUTE_VALUE`’s rules match the remainder of the text,  so it stops as well, and control goes back to `JSX_ATTRIBUTE_SEPARATOR`, which _also_ can’t match anything else. So control returns to `JSX_INSIDE_TAG`.
* `JSX_INSIDE_TAG` has the aforementioned self-closing-tag rule, which matches `  />` and has a `final` callback. Control returns to `JSX_TAG_NAME`.
* `JSX_TAG_NAME` could try to go into the remainder of the text and consume `>SomeFurtherComponent troz="zort" />`, but we don’t want it to do that, so we ensured that all its rules were anchored to the start of the string. Since none of its rules match, it returns control to `JSX_TAG_ROOT`.
* `JSX_TAG_ROOT` could also try to jump ahead and see the next JSX element, but its single rule is _also_ anchored to the start of the string. It returns because none of its rules match.
* Control returns to the function that invoked `JSX_TAG_ROOT`, `Utils.balanceByLexer`. That function is interested in only one thing: the `lengthConsumed` property returned by the `run` method. That tells it how much of the string the lexer consumed. We consumed `38` characters, so `balanceByLexer` returns `37` (the string is zero-indexed).

All that work just to get one number? Yes, because it takes that much work to ensure we’re returning the _right_ number.

## Writing lexers

You will write lots of small lexers just like you write lots of small grammars. Let’s take JavaScript template strings as an example.

```js
const LEXER_TEMPLATE_STRING = new Lexer([
  {
    name: 'exclude escaped $',
    pattern: /\\\$/,
    raw: true
  },
  {
    name: 'interpolation-start',
    pattern: /(\$\{)/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_TEMPLATE_STRING_INTERPOLATION
    }
  },
  {
    name: 'exclude escaped backtick',
    pattern: /\\\x60/,
    raw: true
  },
  {
    name: 'string-end',
    pattern: /\x60/,
    final: true
  }
], 'template-string');
```

But how does it work? Let’s look at each rule on its own.

* The two rules that begin with `exclude` are present so that they can detect escaped characters and prevent them from matching other rules. The `raw: true` means that they will be represented in the tree as bare strings without names.

* The `interpolation-start` rule looks for the sequence that would signal an interpolation within the template string. When it matches, it triggers a different lexer. The `inside` property is saying something like this: "Create a new `Token` whose name is `interpolation`. The contents of this new token will be an array that contains (a) the `interpolation-start` token we just made, plus (b) whatever tokens are generated by `LEXER_TEMPLATE_STRING_INTERPOLATION`." (The `after` property works identically to `inside`, except that the triggering token is not added to the collection, but exists in the tree on its own.)

* The `string-end` rule looks for the sequence that would signal the end of the template string. The `final: true` means that an occurrence of this pattern would signal that the lexer’s job is done, and it should return control to whatever called it.

This lexer is ready to parse text:

```js
LEXER_TEMPLATE_STRING.run(`\`this is a template string \${2 + 3}.\``);
```

Notice what we’ve guarded against here. In this particular lexer, don’t have any need to count backticks in the string, even though the user could put their own backticks within the interpolation. Because a different lexer is responsible for parsing the interpolation, it protects us from those errant backticks.

### Advanced features

Rules can define a property called `test` that refers to a function. That function can be used to define extra criteria for whether the rule matches. It can also be used as a general-purpose callback.

Here’s an example:

```js
const LEXER_JSX_INTERPOLATION = new Lexer([
  // ...
  {
    name: 'string-begin',
    pattern: /^\s*('|")/,
    test: (match, text, context) => {
      context.set('string-begin', match[1]);
      return match;
    },
    inside: {
      name: 'string',
      lexer: LEXER_STRING
    }
  },
  // ...
], 'jsx-interpolation');

```

This is one rule among many in a lexer; its purpose is to detect a string. When the pattern matches, `test` is called with three arguments: the match data from `RegExp#exec`, the remainder of the unprocessed string, and a `Context` object.

As you can see, all the rule does is return the match data again, but not before setting the value of `string-begin` to whichever character matched.

String processing continues within `LEXER_STRING`:

```js
// Consumes until a string-ending delimiter. The string-beginning delimiter is
// in context as `string-begin`.
const LEXER_STRING = new Lexer([
  {
    name: 'string-escape',
    pattern: /\\./
  },
  {
    name: 'string-end',
    pattern: /('|")/,
    test: (match, text, context) => {
      let char = context.get('string-begin');
      if (match[1] !== char) { return false; }
      context.set('string-begin', null);
      return match;
    },
    final: true
  }
], 'string');

```

Now we know the purpose of the earlier callback: to set data that would be checked by a later rule. The `string-end` rule checks which kind of quote opened the string, and ensures that the rule doesn’t actually pass until the same kind of quote is encountered.

## Highlighting

Once we know what portion of the substring contains a single instance of JSX, we can highlight it. The job of doing this highlighting is still handled primarily with grammars — with occasional calls to `balanceByLexer` for constructs like JSX interpolation so that we can be certain that the right section gets highlighted.

### Why not use the lexer to highlight?

It’s a shame not to do anything with that syntax tree that was returned by the root lexer, so in the future I plan to reuse that content when performing syntax highlighting.

Actually, the future is now. Right now I’ve got this working as a proof-of-concept. These are the two problems that need to be solved, and how I’ve tentatively solved them:


#### Tree structure

Right now, the hierarchy of the syntax tree recapitulates the hierarchy of lexers and sub-lexers and how they delegated to one another. That grouping doesn’t contain any inherent semantic information.

An ideal tree would have hierarchy, but only where the hierarchy adds meaning. For instance, a lexer whose purpose is to parse JSX tag contents doesn’t want to wrap everything it parses in `<span class="jsx-tag-contents">`, but a lexer whose purpose is to parse a string in its entirety surely wants to wrap its contents in `<span class="string">`.

This cries out for a permanent solution, but for now I’m having luck with flattening and rebuilding the tree, only adding hierarchy where it’s opted into by a lexer. For instance, the `LEXER_STRING` lexer specifies a `scopes: "string"` option in its definition, and emits it when running against a string. When the tree-flattener encounters that property in the output, it knows to create a group and put all of the string lexer’s children into the group.

When converting the rebuilt tree to HTML, Daub will emit `spans` with `class` attributes that match the lexer’s `name` properties (except for `raw: true` rules), but you can override this with the `scopes` property if the rule’s name isn’t a suitable value for `class`.

The `renderLexerTree` function from `Utils` will convert lexer output to HTML, but you’ll probably want to use `balanceAndHighlightByLexer` instead. It works like `balanceByLexer`, but returns both a string index and the HTML serialization of the lexer tree. Since the `index` callback passes a `Context`, you can use that to store the HTML output and retrieve it in an `after` callback:

```js
let JSX_TAG_ROOT = new Grammar({
  'jsx': {
    pattern: VerboseRegExp`
      (<|&lt;) # opening angle bracket
      ([a-zA-Z_$][a-zA-Z0-9_$\.]*\s*) # any valid identifier as a tag name
      ([\s\S]*) # middle-of-tag content (will be parsed later)
      (&gt;|>)
    `,
    index (text, context) {
      // You still need to retrieve the index to know where this match should
      // end, but now you'll also get the HTML representation of that lexer
      // output.
      let { index, highlighted } = balanceAndHighlightByLexer(text, LEXER_TAG_ROOT, context);

      // But we can't do anything with it yet, so let's save it for later.
      context.set('lexer-highlighted', highlighted);
      return index;
    },
    // Don't specify any captures; that work won't get used.
    replacement: `<span class='jsx'>#{0}</span>`,
    after (text, context) {
      // The `after` callback can be used to alter the match — or, in this
      // case, to replace it entirely. We can simply return the value we got
      // earlier.
      return context.get('lexer-highlighted') || text;
    }
  }
});
```

#### Hooks for better control

As it’s written now, the JSX lexer’s goal is to identify where a JSX block starts and ends. Along the way, it marks some areas of the string in a way that’s useful for highlighting, but it doesn’t know how to highlight _everything_ it encounters.

For instance, when it encounters the beginning of a JSX interpolation block (`{`), all it does is try to find where the end of that block is. It doesn’t pay any attention to the contents except to figure out where that interpolation block ends.

The only way to make the lexer able to highlight within interpolation blocks on its own is to make it able to lex arbitrary JavaScript, and that is major overkill. Instead, we’d want to tell the lexer to mark the contents and bounds of those areas within the string, then introduce hooks into the transform-lexer-output-to-html code so that we can tell our JS grammar to highlight them.

How? Right now I allow a lexer to define a `highlight` callback that, despite its name, simply acts as a callback to allow us to transform a group of tokens just before returning the result.

For example:

```js
const LEXER_JSX_INTERPOLATION = new Lexer([
  // (a bunch of rules)
], 'jsx-interpolation', {
  highlight: (tokens, context) => {
    let last = tokens.pop();
    let serialized = serializeLexerFragment(tokens);
    let highlighted = MAIN.parse(serialized, context);
    return [highlighted, last];
  },
  scopes: 'embedded jsx-interpolation'
});
```

Exactly what this callback does will depend on the particulars of the lexer. But this lexer, given input that looks like this…

```js
<InfoWindow handler={s => s.state} />
```

…would expect to receive a bunch of tokens that comprise the raw string `s => s.state}`. (In other words, the lexer starts immediately after the interpolation’s opening brace, then stops after it consumes the closing brace.)

We can use another convenience function to convert these tokens to their raw string, but first we remove the closing brace token, because it’ll just confuse our highlighter. Then we can parse the `s => state` portion with the regular JS grammar, then return a simpler token array consisting of the highlighted HTML and the closing brace.

#### …but is it worth it?

Lexing itself is expensive, but the rest of the highlighting machinery isn’t, at least by comparison. So it’s probably not worth going to this trouble unless the savings are sizable.

But there’s still a good argument for it. Consider the following JSX block:

```js
<InfoWindow onCloseClick={onClose} willOpen={true} width={100} handler={s => s.state}>
  <section className="ActivePointInfoWindow">
    <header className="ActivePointInfoWindow__point-name">{shortName}</header>

    <InfoWindowDirections directions={directions} />
    <InfoWindowShops shops={shops} />
    <InfoWindowWalkScore walkscore={walkscore} />
  </section>
</InfoWindow>
```

Without using the experimental lexer rendering, highlighting this involves _fifteen_ calls to `balanceByLexer`. Six invocations are required just to get through the first line:

* One to find the bounds of the root `InfoWindow` element, after which the contents are handed to the grammar to highlight.
* One to find the bounds of the _opening_ `InfoWindow` tag, because determining where the tag ends is a task that requires a lexer.
* One each for the four interpolation blocks, because finding the bounds of the interpolation is a task that requires a lexer.

All calls after the very first one are redundant, since the initial lexing run identified _all_ these regions. To be able to convert the lexer parsing tree into HTML, asking for help from the grammar when necessary, means that we can cut our usage of lexers in half. _That’s_ probably the major performance opportunity.

On the JSX test page, with Chrome simulating a mid-tier mobile device, the usage of lexer rendering reduces the number of lexer usages from 76 to _15_, and the total rendering time from ~172ms to ~110ms.
