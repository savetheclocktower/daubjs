
# Daub plugins

Plugins are simple. They’re just functions that listen for the events that Daub emits during the highlighting process.

```js
import WhitespaceNormalizer from 'daub/plugins/whitespace-normalizer';

// Call the function to enable it…
let done = WhitespaceNormalizer();

// …and it'll return a function you can call later on to disable it.
done();
```

## WhitespaceNormalizer

Trims any leading and trailing newlines from inside of a `pre > code` element. This lets you write your HTML like this:

```html
<pre><code>
function foo () {
  return "bar";
}
</code></pre>
```

Instead of this:


```html
<pre><code>function foo () {
  return "bar";
}</code></pre>
```

This plugin is adapted from the excellent (MIT-licensed) [Prism plugin](https://github.com/PrismJS/prism/tree/master/plugins/normalize-whitespace).

## LineHighlighter

Allows you to highlight particular lines in your code blocks by annotating
your `pre` or `code` elements with `data-lines` attributes.

```html
<pre data-lines="3"> <!-- (will highlight the third line) -->

<pre data-lines="3,5"> <!-- (will highlight the third and fifth lines) -->

<pre data-lines="3, 5-7, 10-12"> <!-- (you get the idea) -->
```

The plugin will figure out the necessary plumbing CSS; all you need to do is
style the class `daub-line-highlight` with a `background-color` of your
choice. But make sure it's an `rgba` value with a low alpha; an opaque
`background-color` will cover your code entirely.

### Caveats

* Ensure your preformatted lines are of a fixed height; don't do weird stuff
  with font size such that your line-height can vary from line to line.

* If you're also using the `WhitespaceNormalizer` plugin, make sure the
  values in `data-lines` refer to the line numbers _after_ normalization, not
  before.

This plugin is adapted from the excellent (MIT-licensed) [Prism plugin](https://github.com/PrismJS/prism/blob/master/plugins/line-highlight/).
