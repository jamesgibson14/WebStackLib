var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs'),
    url = require("url"),
    path = require("path"),
    port = 2389;

app.listen(port);

function handler (req, res) {
  var uri = url.parse(req.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write("404 Not Found\n");
      res.end();
      return;
    }

	if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        res.writeHead(500, {"Content-Type": "text/plain"});
        res.write(err + "\n");
        res.end();
        return;
      }

      res.writeHead(200);
      res.write(file, "binary");
      res.end();
    });
  });
}

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
});


});
