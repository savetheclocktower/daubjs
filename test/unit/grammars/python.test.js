import Python from "#internal/grammars/python";
import {
  parseToTree,
  queryTree,
  readFixtures,
  setup
} from '#internal/test/unit/helpers';

const FIXTURES = await readFixtures('python');

describe('Python grammar', () => {
  beforeAll(() => {
    setup();
  });

  it('parses miscellaneous.py', () => {
    let tree = parseToTree(Python, FIXTURES['miscellaneous.py']);
    expect(tree).toContainScopes({
      interpolation: 1,
      escape: 6,
      constant: 0,
      'storage.keyword': 1,
      'storage.support': 2,
      'storage.string': 3,
      'string-double-quoted': 3,
      'string-single-quoted': 5,
      comment: 10
    });
  });

  it('parses advanced-example.py', () => {
    let tree = parseToTree(Python, FIXTURES['advanced-example.py']);
    expect(tree).toContainScopes({
      'string-triple-quoted': 6,
      'constant-self': 19,
      'constant-true': 1,
      'constant-false': 0,
      'constant-none': 1,
      constant: 21
    });
  });

  it('parses shell-script.py', () => {
    let tree = parseToTree(Python, FIXTURES['shell-script.py']);
    expect(tree).toContainScopes({
      'string-double-quoted': 3,
      'string-single-quoted': 1,
      'constant-named': 11,
      'constant-assignment': 2,
      constant: 13
    });
  });
});
