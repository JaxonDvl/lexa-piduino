var SerialPort = require('serialport');

// list serial ports:
SerialPort.list(function (err, ports) {
    ports.forEach(function(port) {
        console.log(port.comName);
    });
});

var port = new SerialPort('COM5', {
    baudRate: 9600,
    parser: SerialPort.parsers.readline("\n")
});
port.on('open', function() {
   console.log('open');
    port.on('data', function(data){
        console.log(data);
    })
});

// open errors will be emitted as an error event
port.on('error', function(err) {
    console.log('Error: ', err.message);
})