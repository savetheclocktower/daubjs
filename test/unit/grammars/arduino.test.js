import Arduino from "#internal/grammars/arduino";
import {
  parseToTree,
  queryTree,
  readFixtures,
  setup
} from '#internal/test/unit/helpers';

const FIXTURES = await readFixtures('arduino');

describe('Arduino grammar', () => {
  beforeAll(() => {
    setup();
  });

  it('parses esp8266.ino', () => {
    let tree = parseToTree(Arduino, FIXTURES['esp8266.ino']);
    expect(tree).toContainScopes({
      string: 11,
      storage: 8,
      comment: 2,
      entity: 2,
      variable: 3,
      support: 1
    });
  });

  it('parses sample-sketch.ino', () => {
    let tree = parseToTree(Arduino, FIXTURES['sample-sketch.ino']);
    expect(tree).toContainScopes({
      'keyword-macro': 43,
      'entity-macro': 33,
      number: 30,
      string: 40,
      storage: 63,
      constant: 58,
      operator: 80,
      escape: 1,
      support: 3
    });
  });
});
