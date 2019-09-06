/* global process */
/* eslint-disable no-console */
import strip from 'rollup-plugin-strip';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
// import uglify from 'rollup-plugin-uglify';
// import uglifyES from 'rollup-plugin-uglify-es';

let shouldStripConsoleStatements = !process.env.DEBUG;

let outputFormat = 'iife';
if (process.env.ES6) {
  outputFormat = 'es';
} else if (process.env.UMD) {
  outputFormat = 'umd';
}

let outputFile = `dist/daub.js`;


console.log('Stripping `console.debug` statements:', shouldStripConsoleStatements);
console.log('Output format:', outputFormat);
console.log(' -> ', outputFile);

let plugins = [
  resolve(),
  cjs()
];

if (outputFormat !== 'es') {
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
    name: 'Daub',
    file: outputFile,
    format: outputFormat
  }
};
