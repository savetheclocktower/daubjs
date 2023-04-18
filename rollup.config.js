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

// Map everything inside `src` to a format that rollup will accept as an
// `input` config value.
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
        'console.groupEnd'
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

  // Web worker UMD.
  {
    input: 'src/worker.js',
    output: {
      name: 'daub',
      file: 'dist/daub.worker.umd.cjs',
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
