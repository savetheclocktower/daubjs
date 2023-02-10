
import { Highlighter } from 'daubjs';
import jsx from 'daubjs/grammars/jsx';

let highlighter = new Highlighter();

highlighter.addElement(document.body);
highlighter.addGrammar(jsx);

highlighter.highlight();
