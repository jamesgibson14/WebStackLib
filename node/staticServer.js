var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = 2389;

var io = require('socket.io').listen(port);

io.sockets.on('connection', function (socket) {
 socket.emit('news', { hello: 'world' });
 socket.on('myevent', function (data) {
   console.log(data);
       socket.broadcast.emit('user connected',data);
 });
  socket.on('ws:create', function (data, callback) {
data.id = Math.random();
temp = JSON.stringify(data);
if (false) {
callback('error');
} else {
// ... some data scrubbing
socket.broadcast.emit('newChatFromOtherUser',data);
callback(null, temp);
}
})

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

	if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
