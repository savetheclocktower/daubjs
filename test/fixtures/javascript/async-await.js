function timeout(duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}

var p = timeout(1000).then(something => {
  return timeout(2000);
}).then(() => {
  throw new Error("hmm");
}).catch(err => {
  return Promise.all([timeout(100), timeout(200)]);
});


async function zort () {
  return new Promise((resolve, reject) => {
    // ...
  });
}

let bar = await zort();
