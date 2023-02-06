import Ruby from "#internal/grammars/ruby";
import {
  parseToTree,
  queryTree,
  readFixtures,
  setup
} from '#internal/test/unit/helpers';

const FIXTURES = await readFixtures('ruby');

describe('Ruby grammar', () => {
  beforeAll(() => {
    setup();
  });

  it('parses brace-balancing.rb', () => {
    let tree = parseToTree(Ruby, FIXTURES['brace-balancing.rb']);
    expect(tree).toContainScopes({
      interpolation: 1,
      escape: 1,
      'string-percent-q': 1,
      constant: 1
    });

    let [string] = queryTree(tree, '.string-percent-q');
    expect(
      string.innerHTML.endsWith(`} a problem.\n}`)
    ).withContext(`%Q string contents aren't as expected: ${string.innerHTML}`).toBe(true);
  });

  it('parses method-call-with-block.rb', () => {
    let tree = parseToTree(Ruby, FIXTURES['method-call-with-block.rb']);
    expect(tree).toContainScopes({
      operator: 1,
      keyword: 5,
      string: 1,
      'variable-parameter': 2
    });
  });

  it('parses percent-q-with-interpolation.rb', () => {
    let output = Ruby.parse(FIXTURES['percent-q-with-interpolation.rb']);
    let tree = parseToTree(Ruby, FIXTURES['percent-q-with-interpolation.rb']);

    expect(tree).toContainScopes({
      'string-percent-q': 1,
      'string-single-quoted': 3,
      interpolation: 8
    });
  });

  it('parses shell-script.rb', () => {
    let tree = parseToTree(Ruby, FIXTURES['shell-script.rb']);

    let interpolations = queryTree(tree, '.interpolation');
    expect(tree).toContainScopes({
      interpolation: 12,
      escape: 7,
      'variable-global': 3,
      'variable-parameter': 8
    });
  });
});
