import SCSS from "#internal/grammars/scss";
import {
  parseToTree,
  queryTree,
  readFixtures,
  setup
} from '#internal/test/unit/helpers';

const FIXTURES = await readFixtures('scss');

describe('SCSS grammar', () => {
  beforeAll(() => {
    setup();
  });

  it('parses basic-usage.scss', () => {
    let tree = parseToTree(SCSS, FIXTURES['basic-usage.scss']);
    expect(tree).toContainScopes({
      'selector-abstract-class': 3,
      number: 72,
      embedded: 2,
      'keyword.directive': 1,
      comment: 27,
      'keyword-at-rule': 46,
      'entity.parameter': 4,
      function: 40,
      unit: 36
    });
  });

  it('parses at-rules.scss', () => {
    let tree = parseToTree(SCSS, FIXTURES['at-rules.scss']);
    expect(tree).toContainScopes({
      'keyword-at-rule': 7,
      'operator-logical': 2,
      support: 11,
      'string-unquoted': 2
    });
  });

  it('parses functions.scss', () => {
    let tree = parseToTree(SCSS, FIXTURES['functions.scss']);
    expect(tree).toContainScopes({
      'keyword-at-rule-function': 3,
      'keyword-at-rule-return': 5,
      'keyword-at-rule-if': 3,
      function: 3,
      string: 2,
      variable: 14
    });
  });
});
