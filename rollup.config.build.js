/* global process, __dirname */
/* eslint-disable no-console */
import strip from 'rollup-plugin-strip';
import babel from 'rollup-plugin-babel';

import fs from 'fs';
import path from 'path';

let shouldStripConsoleStatements = !process.env.DEBUG;
let shouldTranspile = !process.env.ES6;

const PATH = __dirname;

const SRC_PATH = path.resolve(PATH, 'src');

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


let paths = [];

function walkDirectory (pathName) {
  let entries = fs.readdirSync(pathName);
  entries.forEach((e) => {
    console.log('e:', e);
    let fullPath = path.resolve(pathName, e);
    let stat = fs.statSync(fullPath);
    if ( stat.isDirectory() ) {
      walkDirectory(fullPath);
    }
    if (fullPath.match(/\.js$/)) {
      paths.push(fullPath);
    }
  });
}

walkDirectory(SRC_PATH);

let configs = paths.map((p) => {
  let relative = p.replace(__dirname, '.');
  let lib = path.resolve(__dirname, 'lib');
  if ( !fs.existsSync(lib) ) { fs.mkdirSync(lib); }

  let name = path.basename(p, '.js');
  name = name.replace(/-/g, '_');
  let output = relative.replace(/^\.\/src/, './lib');
  return {
    input: p,
    name,
    plugins: plugins,
    output: {
      file: output,
      format: 'umd'
    }
  };
});

export default configs;

// console.log('path:', paths);

