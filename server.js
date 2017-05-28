/**
 * Created by Jaxxo on 22/01/2017.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
server.listen(5000);
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
app.get('/', function (req, res) {
    res.send('Hello World!');

});
var SerialPort = require('serialport');
 SerialPort.list(function (err, ports) {
     ports.forEach(function (port) {
         //console.log(port.comName);
     });
 });
 var port = new SerialPort('/dev/ttyACM0', {
     baudRate: 9600,
     parser: SerialPort.parsers.readline("\n")
 });
 port.on('open', function () {
     console.log('open');
 });
     //port.on('data', function (data) {
      //   console.log(data);

        // socket.emit('idscanned', { cardid: data });
     //});
io.on('connection', function (socket) {
     console.log('connected');
     port.on('data', function (data) {
         console.log(data);

         socket.emit('idscanned', { cardid: data });
     });
});

app.post('/add_user', function (req, res) {
    var currentUser = { name: req.body.name, password: req.body.password, id: req.body.id };
    var updates = {};
    updates['card/' + currentUser.id] = {
        name: currentUser.name
    };
    updates['users/' + currentUser.name] = currentUser;
    return firebase.database().ref().update(updates);
});
app.get('/get_users', function (req, res) {
    firebase.database().ref().once('value',function (snap){
        var dataUsers= snap.child("users");
        res.send(dataUsers);
        
    })

});
