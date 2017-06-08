// Init express server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
server.listen(3000);
console.log("started listenning on port 3000");

// Subscribe to lexa's router stream and update the LED accordingly
// var onoff = require('onoff');
// var Gpio = onoff.Gpio;
// var led = new Gpio(18, 'out');
var sio = require('socket.io-client');
var socket = sio.connect('http://lexa.tuscale.ro');

// socket.on('message', function(msg) {
//   console.log('Got a new message from the router:', msg);
//   var jMsg = JSON.parse(msg);
//   var newLedState = jMsg.led;

//   led.writeSync(newLedState);
// });

// Init firebase
var firebase = require('firebase');
var io = require('socket.io')(server);
var firebase_app = firebase.initializeApp({
    apiKey: "AIzaSyB3ZvJDuZ2HD-UppgPvY2by-GI0KnessXw",
    authDomain: "rlexa-9f1ca.firebaseapp.com",
    databaseURL: "https://rlexa-9f1ca.firebaseio.com",
    projectId: "rlexa-9f1ca",
    storageBucket: "rlexa-9f1ca.appspot.com",
    messagingSenderId: "161670508523"
});
var db = firebase.database();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Init NFC serial link
// var SerialPort = require('serialport');
// SerialPort.list(function (err, ports) {
//     ports.forEach(function (port) {
//         console.log(port.comName);
//     });
// });
// var port = new SerialPort('/dev/ttyACM0', {
//     baudRate: 9600,
//     parser: SerialPort.parsers.readline("\r\n")
// });
// port.on('open', function () {
//     console.log('open');
// });

// // Monitor NFC activity
// port.on('data', function (data) {
//   var tagID = data.split(' ').join('');
//   console.log(data.split(' '));
//   tagID = tagID.substring(0, tagID.length - 1);

//   console.log(tagID + " scanned ...");
//   db.ref("card/" + tagID).once("value", function(cardOwnerSnap) {
//     var cardOwnerName = cardOwnerSnap.child('name').val();

//     if (cardOwnerName) {
//         db.ref('authed').set(cardOwnerName);
//     }
//   });

//   // Notify our web-clients that a tag was scanned
//   io.sockets.emit('idscanned', { cardid: tagID });
// });

io.on('connection', function (socket) {
    console.log('Web client connected.');
});

// Define web-facing endpoints for managing the users
app.post('/add_user', function (req, res) {
    var currentUser = { name: req.body.name, led: req.body.led, id: req.body.id };
    var updates = {};
    updates['card/' + currentUser.id] = {
        name: currentUser.name,
        led: currentUser.led
    };
    updates['users/' + currentUser.name] = currentUser;
    return firebase.database().ref().update(updates);
});
app.get('/get_users', function (req, res) {
    firebase.database().ref().once('value', function (snap) {
        var dataUsers = snap.child("users");
        res.send(dataUsers);
    });
});
app.get('/get_authed', function (req, res) {
    db.ref().once('value', function (snap) {
        var isUserLogged = snap.child("authed/Mike").val();
        console.log(isUserLogged);
        if (isUserLogged) {
            var userData = snap.child("users/Mike/led")
            console.log(parseInt(userData.val()));
        }
    })
    var name = "BLAH";
    name = name.toLowerCase();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    res.send(name);

});
// Monitor process termination and do cleanups
// process.on('SIGINT', function () {
//   led.writeSync(0);
//   led.unexport();
//   process.exit();
// });
        // db.ref('authed').once('value', function (snap) {
        //     var lastScannedTagOwner = snap.val();

        //     if (lastScannedTagOwner) {
        //         // Valid tag present
        //         request({
        //             url: 'http://lexa.tuscale.ro/publish',
        //             method: 'POST',
        //             json: { led: (stateName === "on" ? 1 : 0) }
        //         },
        //             function (error, response, body) {
        //                 if (error) {
        //                     return console.error('upload failed:', error);
        //                 }

        //                 // Delete scanned tag and notify user of successfull op
        //                 db.ref('authed').remove();
        //                 that.emit(':tell', 'Hi ' + lastScannedTagOwner + '! Turning ' + stateName + ' the LED!');
        //                 console.log('Upload successful!  Server responded with:', body)
        //             }
        //         );
        //     } else {
        //         that.emit(':tell', 'Please scan your tag and try again.');
        //     }
        // });