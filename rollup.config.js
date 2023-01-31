/* global process */
/* eslint-disable no-console */

import resolve from '@rollup/plugin-node-resolve';
import cjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';

import PACKAGE from './package.json';

let extraPlugins = [];

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
