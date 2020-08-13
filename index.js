var app = require('./server');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const fs = require('fs');
var jsdom = require('jsdom');
var $ = require('jquery')(new jsdom.JSDOM().window);
require('log-timestamp');
const lineReader = require('line-reader');
const buttonPressesLogFile = './Src/fileText.txt';

console.log(`Watching for file changes on ${buttonPressesLogFile}`);

// lineReader.eachLine(buttonPressesLogFile, (line, last) => {
//     console.log(line);
// });

io.on('connection', function(socket) {
    console.log('Client connected!');

    fs.watchFile(buttonPressesLogFile, (curr, prev) => {
      lineReader.eachLine(buttonPressesLogFile, (line, last) => {
          socket.send(line);
      });

      console.log(`${buttonPressesLogFile} file Changed`);
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
