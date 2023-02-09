import JSX from "#internal/grammars/jsx";
import {
  parseToTree,
  queryTree,
  readFixtures,
  setup
} from '#internal/test/unit/helpers';

const FIXTURES = await readFixtures('jsx');

describe('JavaScript (JSX) grammar', () => {
  beforeAll(() => {
    setup();
  });

  it('parses jsx-with-valueless-attribute.js', () => {
    let tree = parseToTree(JSX, FIXTURES['jsx-with-valueless-attribute.js']);
    expect(tree).toContainScopes({
      'tag-jsx': 0,
      'tag-html': 3,
      'attribute-name': 3,
      'string': 2
    });
  });
});
