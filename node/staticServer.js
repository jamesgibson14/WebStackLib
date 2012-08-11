var http = require('http');
var fs = require('fs');
var path = require('path');
var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

http.createServer(function (request, response) {
 
    console.log('request starting...');
     
    var filePath =  request.url;
    if (filePath == '/')
        filePath = '../index.html';
    filePath = '../' + filePath; 
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    console.log(filePath);
    fs.exists(filePath, function(exists) {
     
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
        	console.log('errror: ' + filePath);
            response.writeHead(404);
            response.end();
        }
    });
     
}).listen(80);
 
console.log('Server running at http://127.0.0.1:80/');
