/* global process */
/* eslint-disable no-console */

import resolve from '@rollup/plugin-node-resolve';
import cjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';

import glob from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import PACKAGE from './package.json';

let extraPlugins = [];

const mappings = Object.fromEntries(
  glob.sync('src/**/*.js').map(file => {
    let from = path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    );
    let to = fileURLToPath(new URL(file, import.meta.url));
    return [from, to];
  })
);

if (!process.env.DEBUG) {
  extraPlugins.push(
    strip({
      debugger: true,
      functions: [
        'console.debug',
        'console.info',
        'console.log',
        'console.warn',
        'console.group',
        'console.groupCollapsed',
        'console.groupEnd',
        'LOGGER.debug',
        'LOGGER.info',
        'LOGGER.log',
        'LOGGER.warn',
        'LOGGER.group',
        'LOGGER.groupCollapsed',
        'LOGGER.groupEnd'
      ],
      sourceMap: false
    }),
    terser()
  );
}

export default [
  // Browser-friendly UMD build.
  {
    input: 'src/all.js',
    output: {
      name: 'daub',
      file: PACKAGE.browser,
      format: 'umd'
    },
    plugins: [
      resolve({ exportConditions: ['node'] }),
      cjs(),
      babel({
        // The docs say to use 'runtime' here, that it removes duplication, but
        // it caused a bunch of headaches and still made my files larger.
        babelHelpers: 'bundled',
        // Only transpile our source code.
        exclude: 'node_modules/**',
      }),
      ...extraPlugins
    ]
  },

  // ES6 converted to logging-stripped ES6.

  // “If you want to convert a set of files to another format while maintaining
  // the file structure and export signatures, the recommended way … is to turn
  // every file into an entry point. You can do so dynamically e.g. via the
  // glob package.”
  {
    input: mappings,
    output: {
      dir: 'lib'
    },
    plugins: [
      resolve({ exportConditions: ['node'] }),
      ...extraPlugins
    ]
  },

  // Web worker UMD.
  {
    input: 'src/worker.js',
    output: {
      name: 'daub',
      file: 'dist/daub.worker.umd.js',
      format: 'umd'
    },
    plugins: [
      resolve({ exportConditions: ['node'] }),
      cjs(),
      babel({
        // The docs say to use 'runtime' here, that it removes duplication, but
        // it caused a bunch of headaches and still made my files larger.
        babelHelpers: 'bundled',
        // Only transpile our source code.
        exclude: 'node_modules/**',
      }),
      ...extraPlugins
    ]
  }
];
