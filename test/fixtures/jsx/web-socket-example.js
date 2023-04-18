const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
  ws.on('message', (data) => {
    let message = data.toString('utf-8');
    console.debug('Message received: ', message);

    if (message.startsWith('SCAN:')) {

      // Shouldn't happen, but handle it just in case.
      if (suspending) {
        ws.send('ERROR:busy');
        return;
      }

      message = message.replace(/^SCAN:(\s*)(?=\w)/, '');
      if (!(message in COMMANDS)) {
        handleError(ws, 'No such command!');
        return;
      }
      let args = [...COMMANDS[message]];
      let command = args.shift();
      console.debug('Running command:', command, args);
      suspend(ws);
      exec(command, args).then((result) => {
        resume(ws, result);
      });
    }
  });

  ws.send('OK');
});
