
# Daub

Syntax highlighting for the browser and elsewhere. More complex than [Prism][], but also more powerful.

Will highlight JavaScript (with JSX), Ruby, Python, HTML, SCSS, and a few other things out of the box.

## Purpose

Prism is legitimately good, and if you like the way it highlights your code, you should just use it.

I wrote Daub because I want code blocks on my website to look very similar to how they appear in my IDE, and to pull that off I needed a library with some advanced features.

## History

Daub is the great-great-grandchild of Dan Webb’s Unobtrusive Code Highlighter, which was one of the early client-side code highlighters. Dan's script was itself inspired by Dean Edwards’s [star-light][].

It’s my third attempt at a client-side code highlighter. The first was the cleverly-named [code_highlighter](https://github.com/savetheclocktower/javascript-stuff/blob/master/code-highlighter/code_highlighter.js); the second was [Fluorescence][]. Both of them relied on [Prototype](http://prototypejs.org/), but there’s honestly no need for a framework dependency anymore.

## Installing

There are several ways to use Daub.

### Simplest: the bare UMD file

The file residing at `dist/daub.umd.cjs` is self-contained and transpiled to ES5. It can be imported into any environment, including the browser. It’s also what gets returned if you import or require `daub/umd`.

The downside of this approach is that you get the maximal bundle, including all existing grammars and plugins.

### Moderately complex: import pieces as part of your bundling strategy

If you bundle your JavaScript with a tool like [Rollup](https://rollupjs.org/), you can import only the pieces you need; consult `examples/simple.js` for a typical usage.

This allows you to import only the parts you want, though you can replicate the all-in-one bundle by importing `daub/all`.

If you are delivering bundled ES6 to the browser, this should work just fine. If you are transpiling your ES6 to ES5, you must ensure that Babel is configured to transpile Daub as well, rather than excluding `node_modules/**` from transpilation. If you don’t want to mess with the configuration, you can instead import `daub/umd`, which does not require transpilation.

### Ever-so-slightly more complex: web worker

If you expect to be doing a _lot_ of code highlighting, or if you are obsessive about keeping your First Contentful Paint at its absolute minimum, you can run Daub in a web worker. A small amount of work will still have to be done in the main page, but the actual work of parsing and generating highlighted HTML will be done asynchronously.

This will increase latency and overall time to highlight code in exchange for ensuring that no highlighting work affects the responsiveness of the page.

See `examples/worker.js` for an example of a worker you can write, or import `daub/umd/worker` for the maximal version that loads all grammars. Either way, ensure that the file in question is bundled separately from your main script at a known URL so that it can loaded via `new Worker`.

The web worker approach involves declaring an instance of `AsyncHighlighter` on the main page instead of `Highlighter`. Usage instructions are otherwise very similar to what is described below.

### Unknown: import maps

I’ve not tried to load Daub with either native import maps (not yet supported in all browsers) or the [SystemJS](https://github.com/systemjs/systemjs) equivalent, so I don’t know how complex this would be, but I think it’s possible. Let me know if you’ve pulled it off.

### Unknown: server-side highlighting

Daub can be used as an alternative to Prism when doing server-side highlighting for something like [Eleventy](https://www.11ty.dev/) or [Gatsby](https://www.gatsbyjs.com/), but I haven’t tried this and don’t know any of the pitfalls and possibilities. Let me know what you discover.


## Usage

Here’s how you’d use Daub in a typical client-side scenario.

### Annotate your `code` elements with class names

To mark your code blocks for highlighting, annotate them with the name of the grammar you’ve defined. By default, you can use a class name…

```html
<pre><code class="ruby">module Foo
end</code></pre>
```

…or a `data-language` attribute.

```html
<pre><code data-language="ruby">module Foo
end</code></pre>
```

(If neither of these conventions appeals to you, you can define your own in the options.)

Daub will take the contents of these code blocks and replace them with tokenized HTML like so:

```html
<pre><code class="ruby"><span class='keyword'>module</span> <span class='module'>Foo</span>
<span class='keyword'>end</span></code></pre>
```

### Set up your highlighter

The `Highlighter` class manages code highlighting on a page. Create an instance, then add at least one element and at least one grammar:

```javascript
import { Highlighter } from 'daub';
import RUBY from 'daub/grammars/ruby';

const highlighter = new Highlighter();
highlighter.addElement(document.body);
highlighter.addGrammar(RUBY);
```

You can add any element to a highlighter, and any of the built-in grammars. You can also add grammars you’ve written yourself, as long as they’ve got names.

Then, at some point later, call `highlight`:

```javascript
highlighter.highlight();
```

Each time `highlight` is called, the highlighter will search for new code blocks under the specified element(s). In this example, the highlighter will run `querySelectorAll` against `document.body` and will find and transform our example HTML, no matter where it occurs within the body.

Once Daub highlights a block, it will ignore that block on subsequent scans. You can therefore call `highlight` again whenever there might be new content to be highlighted. Choose your own strategy for automating this if you like — poll every second, set up a `MutationObserver`, go nuts.

If you’re using a web worker, this step will look slightly different; consult the [docs for `AsyncHighlighter`](./docs/async-highlighter.md).

### Write some CSS for the syntax

Daub has no built-in themes, though you’re welcome to consult `test/theme.css` for a sample theme. Since the tokens are just `SPAN`s with class names, themes are straightforward:

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

You’ve got all the features of CSS at your disposal here.

## Grammars

Each language that Daub supports is underpinned by an instance of `Grammar`. Grammars are what tell Daub how to identify constructs like keywords, strings, constants, booleans, escape sequences, and so on.

The design of a Daub grammar is heavily influenced by that of TextMate-style grammars. It consists of (a) rules, (b) patterns that define when those rules match, and (c) “scopes” to apply to code passages that match the rule.

Daub grammars allow for contextual rules (e.g., highlighting escape sequences _only_ within strings) and optional arbitrary logic for identifying the bounds of a rule’s match (to get around the limitiations of regular expressions). Rules share a common “context” object, a key-value store that allows rules to act differently based on state set by earlier rules.

For more information, you can [read about the features of grammars](./docs/grammars.md).

## Plugins

Daub fires events on the DOM before and after highlighting a given code block, so it’s possible to hook into these events to do useful things. The `plugins` directory contains [two useful plugins](./docs/plugins.md), each inspired by a similar plugin for Prism.

[Fluorescence]: https://github.com/savetheclocktower/fluorescence/
[Rollup]: https://rollupjs.org/
[String.raw]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw
[tagged template literal]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals
[Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[star-light]: http://dean.edwards.name/star-light/
[Prism]: https://prismjs.com
[Oniguruma]: https://github.com/kkos/oniguruma
