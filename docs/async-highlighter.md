# AsyncHighlighter

If you’re loading Daub in a web worker, you’ll want to import `AsyncHighlighter` instead of `Highlighter`. The interface for `AsyncHighlighter` is nearly identical, with two major differences:

* You must load your web worker with `new Worker` and pass it as the first argument to `new AsyncHighlighter`.
* `AsyncHighlighter` has no `addGrammar` method because all knowledge of which grammars are loaded resides in the worker. By default, calling `AsyncHighlighter#highlight` will attempt to highlight any `code` element with a `class` or `data-language` attribute, though you can use the second argument to `new AsyncHighlighter` to specify a different selector.
* `AsyncHighlighter#highlight` returns a `Promise`, and therefore can be `await`ed or have other promises chained onto it. It returns (or resolves with) an array of all `code` elements that were affected by the call.

## Example

```js
import { AsyncHighlighter } from 'daub';
const WORKER = new Worker(`/dist/daub.worker.umd.js`);

const highlighter = new AsyncHighlighter(
  WORKER,
  {
    // If you know for certain which grammars will be present in the worker,
    // you can write this selector to target specific values — "code.ruby",
    // "code[data-language='python']", et cetera.
    //
    // If you don't, then it's a good idea to use the `data-language` attribute
    // convention instead of specifying a class name. That way, selecting
    // on the presence of that attribute lets you be confident that you're not
    // selecting any nodes unnecessarily.
    selector: 'code[data-language]'
  }
);

let nodes = await highlighter.highlight();
console.log(`highlighted ${nodes.length} elements.`);
```
