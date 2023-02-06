if (!process.env.DEBUG) {
  global.console = {
    ...console,
    debug: jest.fn()
  };
}
