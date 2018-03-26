const {LeNode} = require('..');
new LeNode({
    router: [],
}).start(80);
setInterval(() => {
    console.log('5s')
}, 5000)