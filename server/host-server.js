var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/publish', function(req, res) {
    var subscribers = io.sockets.sockets;
    var bodyContent = JSON.stringify(req.body);

    console.log("A new publish request was requested for body ", bodyContent);
    for (var subscriber in subscribers) {
        if (subscribers.hasOwnProperty(subscriber)) {
            subscribers[subscriber].emit('message', bodyContent);
        }
    }

    res.status(200).end();
});

io.on('connection', function(socket) {
    console.log('A subscriber connected.');
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});