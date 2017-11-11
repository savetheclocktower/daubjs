
import * as Daub from './daub';

import HTML from './grammars/html';
import JavaScript from './grammars/javascript';
import Python from './grammars/python';
import Ruby from './grammars/ruby';
import SCSS from './grammars/scss';
import Shell from './grammars/shell';

import './plugins/whitespace-normalizer';
import './plugins/line-highlighter';

let highlighter = new Daub.Highlighter();

highlighter.addGrammar(SCSS);
highlighter.addGrammar(JavaScript);
highlighter.addGrammar(HTML);
highlighter.addGrammar(Python);
highlighter.addGrammar(Ruby);
highlighter.addGrammar(Shell);

export default highlighter;