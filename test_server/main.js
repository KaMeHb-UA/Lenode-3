const {LeNode} = require(__dirname + '/..');
new LeNode({
    router: [
        {
            domain: /localhost/,
            folder: '/home/superuser/Документы/GitHub/Lenode-3/test_server/test_site'
        },
    ],
}).start(8080);
