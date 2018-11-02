var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use('/static', express.static('assets'));
app.use('/styles', express.static('css'));

app.get('/', function (req, res) {
    res.sendfile(__dirname+'/chat.html');
})

/* io.on("connection", function (socket) {
    console.log("A user is connected!!");

    //Sending an object when emmiting an event
    socket.emit('testerEvent', { description: 'A custom event named testerEvent!' });


    //Recieving data/event emitted from client
    socket.on("clientEvent", function (data) {
        console.log("clientEvent data: ", data);
    })

    socket.on("disconnect", function () {
        console.log("A user is disconnected!!");
    })
}) */

/*var clients = 0;
io.on('connection', function(socket) {
   clients++;
   io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
   socket.on('disconnect', function () {
      clients--;
      io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
   });
}); */

/* io.on('connection', function(socket) {
   clients++;
   socket.emit('newclientconnect',{ description: 'Hey, welcome!'});//will give welcome message to coming user, rest all will only know how much clients are connected
   socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
   socket.on('disconnect', function () {
      clients--;
      socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
   });
}); */

/* var roomno = 1;
io.on('connection', function(socket) {
   
   //Increase roomno 2 clients are present in a room.
   if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) 
     roomno++;
   socket.join("room-"+roomno);

   //Send this event to everyone in the room.
   io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);
}) */

var users = [];
io.on('connection', function(socket) {
   console.log('A user connected');
   socket.on('setUsername', function(value) {
      console.log("value : "+value);
      console.log("users.indexof(data) : "+users.indexOf(value));
      if(users.indexOf(value) > -1) {
         socket.emit('userExists', value + ' username is taken! Try some other username.');
      } else {
         users.push(value);
         socket.emit('userSet', {username: value});
      }
   });
   
   socket.on('msg', function(data) {
      //Send message to everyone
      io.sockets.emit('newmsg', data);
   })
});

http.listen(2000, function () {
    console.log("**App Server running on port 2000**");

})