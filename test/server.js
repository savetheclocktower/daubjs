import { promises as fs, existsSync } from 'fs';
import { fileURLToPath, URL } from 'url';
import express from 'express';
import ejs from 'ejs';
import { promisify } from 'util';

let renderFile = promisify(ejs.renderFile);

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function readFixtureConfig (grammar) {
  let path = `${__dirname}fixtures/${grammar}/settings.json`;
  let exists = existsSync(path);
  if (!exists) { return {}; }
  let raw = await fs.readFile(path);
  return JSON.parse(raw);
}

export async function readFixtures (grammar) {
  let path = `${__dirname}fixtures/${grammar}`;
  let files = await fs.readdir(path);
  files = files.filter(f => f !== 'settings.json');
  let promises = files.map(async (f) => {
    return await fs.readFile(`${path}/${f}`);
  });
  let values = await Promise.all(promises);
  let table = {};
  for (let [index, fileName] of files.entries()) {
    table[fileName] = values[index].toString('utf-8');
  }

  return table;
}

async function getGrammarList () {
  let path = `${__dirname}fixtures`;
  let files = await fs.readdir(path);
  return files;
}

const GRAMMARS = await getGrammarList();

const APP = express();
const PORT = 8079;

APP.set('views', `${__dirname}/views`);
APP.set('view engine', 'ejs');

APP.locals.escape = (code) => {
  return code.replace(/</g, '&lt;');
};

APP.locals.slugify = (name) => {
  return name.replace(/\.(.*?)$/, '');
};

APP.locals.titleize = (name) => {
  name = name.replace(/\.(.*?)$/, '');
  name = name.replace(/-/g, ' ');
  return name;
};

APP.locals.grammarForFixture = (name, config = {}) => {
  let { grammarOverrides } = config;
  if (!grammarOverrides || !grammarOverrides[name]) { return null; }
  return grammarOverrides[name];
};

APP.locals.otherAttributes = (name, config = {}) => {
  let { otherAttributes } = config;
  if (!otherAttributes || !otherAttributes[name]) { return null; }
  let obj = otherAttributes[name];
  let output = "";
  for (let [attr, value] of Object.entries(obj)) {
    output += `${attr}="${value}"`;
  }
  return output;
};

APP.use('/static', express.static(`${__dirname}static`));
APP.use('/dist', express.static(`${__dirname}../dist`));

APP.get('/', async (req, res) => {
  res.render('index.ejs', { GRAMMARS });
});

APP.get('/favicon.ico', (req, res) => {
  res.status(404).send('no icon, weirdo');
});

APP.get('/:grammar', async (req, res) => {
  let { grammar } = req.params;
  let { only } = req.query;
  let table = await readFixtures(grammar);
  if (only && table[only]) {
    let value = table[only];
    table = { [only]: value };
  }
  let config = await readFixtureConfig(grammar);
  let data = {
    grammar: config.grammar || grammar,
    table,
    config
  };

  res.render('grammar.ejs', data);
});

APP.listen(PORT, async () => {
  console.log(`Test server available at http://localhost:${PORT}`);
});
