const {LeNode} = require('..');
new LeNode({
    router: [
        {
            host: /localhost/,
            folder: 'test_site'
        },
    ],
}).start(8080);
