var app = require('./server');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const fs = require('fs');
var jsdom = require('jsdom');
var $ = require('jquery')(new jsdom.JSDOM().window);
require('log-timestamp');
const buttonPressesLogFile = './Src/fileText.txt';

console.log(`Watching for file changes on ${buttonPressesLogFile}`);

io.on('connection', function(socket) {
    console.log('Client connected!');

    fs.watchFile(buttonPressesLogFile, (curr, prev) => {
      fs.readFile('./Src/fileText.txt', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        socket.send(data);
        console.log(data);
      });
      console.log(`${buttonPressesLogFile} file Changed`);
    });

    socket.on('message', function (data) {
        console.log('Sending update!');
        socket.emit('update', 'Working!');
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
