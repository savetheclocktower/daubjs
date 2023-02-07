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

  it('parses example-from-lexer-docs.js', () => {
    let tree = parseToTree(JSX, FIXTURES['example-from-lexer-docs.js']);
    expect(tree).toContainScopes({
      'tag-jsx': 2,
      'tag-html': 4,
      'embedded': 4,
      'number': 2
    });
  });
});
