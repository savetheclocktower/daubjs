import Shell from "#internal/grammars/shell";
import {
  parseToTree,
  queryTree,
  readFixtures,
  setup
} from '#internal/test/unit/helpers';

const FIXTURES = await readFixtures('Shell');

describe('Shell grammar', () => {
  beforeAll(() => {
    setup();
  });

  it('parses basic-example.sh', () => {
    let tree = parseToTree(Shell, FIXTURES['basic-example.sh']);
    expect(tree).toContainScopes({
      variable: 14,
      comment: 5,
      support: 3,
      keyword: 11,
      string: 11
    });
  });
});
