/* global process */
/* eslint-disable no-console */
import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import strip from 'rollup-plugin-strip';

import { terser } from 'rollup-plugin-terser';

import PACKAGE from './package.json';

let extraPlugins = [];

if (!process.env.DEBUG) {
  extraPlugins.push(
    strip({
      debugger: true,
      functions: ['console.debug'],
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
      resolve(),
      cjs({
        include: [
          './src/utils/verbose-regexp.js'
        ]
      }),
      babel({
        // Only transpile our source code.
        exclude: 'node_modules/**',
      }),
      ...extraPlugins
    ]
  },

  // Web worker.
  {
    input: 'src/worker.js',
    output: {
      name: 'daub',
      file: 'dist/daub.worker.umd.js',
      format: 'umd'
    },
    plugins: [
      resolve(),
      cjs({
        include: [
          './src/utils/verbose-regexp.js'
        ]
      }),
      babel({
        // Only transpile our source code.
        exclude: 'node_modules/**',
      }),
      ...extraPlugins
    ]
  },

  {
    input: './src/all.js',
    output: [
      { file: PACKAGE.module, format: 'esm' },
      { file: PACKAGE.main,   format: 'cjs' }
      // { dir: 'dist/esm', format: 'esm' },
      // { dir: 'dist/cjs', format: 'cjs' }
      //
      // { name: 'daub', file: PACKAGE.main, format: 'cjs' },
      // { name: 'daub', file: PACKAGE.module, format: 'esm' }
    ],
    plugins: [
      resolve(),
      cjs({
        include: [
          './src/utils/verbose-regexp.js'
        ]
      }),
      babel({
        // Only transpile our source code.
        exclude: 'node_modules/**',
      }),
      ...extraPlugins
    ]
  }

];
