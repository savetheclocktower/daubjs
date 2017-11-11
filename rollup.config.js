/* global process */
/* eslint-disable no-console */
import strip from 'rollup-plugin-strip';
import babel from 'rollup-plugin-babel';
// import uglify from 'rollup-plugin-uglify';
// import uglifyES from 'rollup-plugin-uglify-es';

let shouldStripConsoleStatements = !process.env.DEBUG;
let shouldTranspile = !process.env.ES6;

let outputFile = `dist/daub.${shouldTranspile ? 'js' : 'es.js'}`;
let outputFormat = shouldTranspile ? 'iife' : 'es';

console.log('Stripping `console.debug` statements:', shouldStripConsoleStatements);
console.log('Transpiling:', shouldTranspile);
console.log(' -> ', outputFile);

let plugins = [];

if (shouldTranspile) {
  plugins.push(
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    })
  );
}

if (shouldStripConsoleStatements) {
  plugins.push(
    strip({
      debugger: true,
      functions: ['console.debug'],
      sourceMap: false
    })
  );
}

// if (shouldTranspile) {
//   plugins.push( uglify() );
// } else {
//   plugins.push( uglifyES() );
// }

export default {
  input: 'src/all.js',
  name: 'Daub',
  plugins: plugins,
  output: {
    file: outputFile,
    format: outputFormat
  }
};