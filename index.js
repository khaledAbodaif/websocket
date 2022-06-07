
//file system to get ssl content data
var fs = require('fs');
const privateKey = fs.readFileSync('/home/gaber/.valet/Certificates/suez.test.key', 'utf8')
const certificate = fs.readFileSync('/home/gaber/.valet/Certificates/suez.test.crt', 'utf8')
const credentials = {
    key: privateKey,
    cert: certificate,
}

// include express
var app = require('express')();

// include https --you can changed to http for local purpose and delete credentials var with file sys
var server = require('https').Server(credentials,app);

//create socket
var io = require('socket.io')(server,{
    cors:{origin:"*"}
});

//create server on port 3000 you can changed if you used this port before
server.listen(3000, function () {
    console.log('Socket server is running.');

});


// get socketController
require('./Controllers/SocketController')(io)


// http op

// env
