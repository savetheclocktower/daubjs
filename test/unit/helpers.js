/* global process */
import { promises as fs } from 'fs';
import { fileURLToPath, URL } from 'url';
import { JSDOM } from 'jsdom';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export async function readFixtures (grammar) {
  let path = `${__dirname}../fixtures/${grammar}`;
  let files = await fs.readdir(path);
  files = files.filter(f => f !== 'settings.json');
  let promises = files.map(async (f) => {
    return await fs.readFile(`${path}/${f}`);
  });
  let values = await Promise.all(promises);
  let table = {};
  for (let [index, fileName] of files.entries()) {
    table[fileName] = values[index].toString('utf-8');
  }

  return table;
}

export function parseToTree (grammar, source) {
  source = source.replace(/</g, '&lt;');
  let output = grammar.parse(source);
  return new JSDOM(output);
}

export function queryTree (tree, selector) {
  let results;
  if ('querySelectorAll' in tree) {
    results = tree.querySelectorAll(selector);
  } else {
    results = tree.window.document.querySelectorAll(selector);
  }
  return [...results];
}

function containsScope (tree, scope, count) {
  let document = tree.window.document;
  let matches = document.querySelectorAll(`.${scope}`);
  let result = { pass: matches.length === count };
  result.message = result.pass ?
    `Tree contains ${count} instances of scope "${scope}"` :
    `Tree contains ${matches.length} instances of scope "${scope}" instead of the expected ${count}`;
  return result;
}

function containsScopes (tree, scopesAndCounts) {
  let failures = [];
  for (let [scope, count] of Object.entries(scopesAndCounts)) {
    let { pass, message } = containsScope(tree, scope, count);
    if (!pass) {
      failures.push(message);
    }
  }

  return {
    pass: failures.length === 0,
    message: failures.length > 0 ? failures.join('\n') : `All speficied scopes and counts are found in the tree`
  };
}

export const customMatchers = {
  toContainScope (matchersUtil) {
    return {
      compare (tree, scope, count) {
        return containsScope(tree, scope, count);
      }
    };
  },

  toContainScopes (matchersUtil) {
    return {
      compare (tree, scopesAndCounts) {
        return containsScopes(tree, scopesAndCounts);
      }
    };
  }
};

export function setup () {
  if (!process.env.DEBUG) {
    spyOn(console, 'debug');
  }
  jasmine.addMatchers(customMatchers);
}
