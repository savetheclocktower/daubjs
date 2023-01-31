
import { Highlighter } from 'daub';
import jsx from 'daub/grammars/jsx';

let highlighter = new Highlighter();

highlighter.addElement(document.body);
highlighter.addGrammar(jsx);

highlighter.highlight();
