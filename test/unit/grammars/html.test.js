import HTML from "#internal/grammars/html";
import {
  parseToTree,
  queryTree,
  readFixtures,
  setup
} from '#internal/test/unit/helpers';

const FIXTURES = await readFixtures('html');

describe('HTML grammar', () => {
  beforeAll(() => {
    setup();
  });

  it('parses custom-elements.html', () => {
    let tree = parseToTree(HTML, FIXTURES['custom-elements.html']);
    expect(tree).toContainScopes({
      string: 1,
      'tag-html-custom': 2,
      'attribute-name': 1
    });
  });

  it('parses head-element.html', () => {
    let tree = parseToTree(HTML, FIXTURES['head-element.html']);
    expect(tree).toContainScopes({
      'keyword.special': 4,
      string: 13,
      comment: 2,
      'attribute-name': 11
    });
  });

  it('parses entities.html', () => {
    let tree = parseToTree(HTML, FIXTURES['entities.html']);
    expect(tree).toContainScopes({
      constant: 4,
      'constant-html-entity': 4,
      'constant-html-entity-numeric': 2,
      'constant-html-entity-named': 2
    });
  });

  it('parses miscellaneous.html', () => {
    let tree = parseToTree(HTML, FIXTURES['miscellaneous.html']);
    expect(tree).toContainScopes({
      string: 4,
      'attribute-name': 4,
      'tag-html': 5
    });

    let firstAttributeValue = queryTree(tree, '.string')[0];
    let textNode = firstAttributeValue.childNodes[1];
    expect(textNode.nodeValue).toBe('whatever > nothing');

    let dataAttribute = queryTree(tree, '.attribute-name')[2];
    expect(dataAttribute.innerHTML.trim()).toBe('data-trigger');
  });

});
