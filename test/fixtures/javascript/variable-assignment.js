let foo = 'bar', baz = { thud: 'troz' },
  somethingElse = [1, 2, { ['this' + 'thing']: 'is weird' }];

// Destructuring
let { blah, zort: troz, [five, six] } = getProps();
