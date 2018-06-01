const app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.broadcast.emit('connection');
    socket.on('message',function(data){
        if(data) io.emit('message',data);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
