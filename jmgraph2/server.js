/**
 * Created by quinnpan on 2015/12/30.
 */
var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 8080});
wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        for (var i = 0; i < 100; i++) {
            console.log('received: %s', message);
            ws.send('connection established!' + Math.random());
        }
    });
    ws.send('connection established!');
});