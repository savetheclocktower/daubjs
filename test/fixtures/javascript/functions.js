let wat = (huh, wat=1) => huh + 1;

getThing()
  .then( e => e.json() )
  .catch( e => console.log(e) );
