import JS from "#internal/grammars/javascript";
import {
  parseToTree,
  queryTree,
  readFixtures,
  setup
} from '#internal/test/unit/helpers';

const FIXTURES = await readFixtures('javascript');

describe('JavaScript grammar', () => {
  beforeAll(() => {
    setup();
  });

  it('parses the symbols fixture', () => {
    let tree = parseToTree(JS, FIXTURES['symbols.js']);
    expect(tree).toContainScopes({
      variable: 2,
      operator: 2,
      storage: 2,
      'string.string-double-quoted': 2
    })

    let storages = queryTree(tree, '.storage');
    for (let node of [...storages]) {
      expect(node.innerHTML).toBe('const');
    }
  });
});
