var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mongooose = require('mongoose');

app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));

var db = mongooose.connect("mongodb://username:passsword@ds239071.mlab.com:39071/dbname",
    function (err, response) {
        if (err)
            console.log("Error in connecting to pushpak-db : error is : " + err);
        console.log("Successfully connected to " + db + " : response : " + response);
    });

app.use('/static', express.static('assets'));
app.use('/styles', express.static('css'));

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:2000");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/login.html');
})

var Schema = mongooose.Schema;

var UsersSchema = new Schema({
    user: { type: String },
    pwd: { type: String }
}, { versionKey: false });

var model = mongooose.model("user", UsersSchema, "user");

app.post("/login", function(req, res){
    var currModel = new model( req.body );
    currModel.save(function (err, data) {
        if (err)
            console.log("error in api /login : error : ", err);
            console.log("User added successfully!!!!!!")
            res.sendfile(__dirname+'/chat.html');
    })
    
})

app.post("/canstartchat", function(req, res){
    var values = new model(req.body);
    var user = req.body.user;
    var pwd = req.body.pwd;
    console.log(user,pwd,"skwnhkjdhsnkjhs")
    model.findOne({user:user, pwd:pwd}, function(err, user){
        if(err)
        console.log("err : /startchat --> "+err);
        if(user == null || user == undefined){
            console.log("err : /startchat --> "+err);
            res.sendfile(__dirname+'/error.html');
        }
       else{
        console.log("user : "+user);
        res.sendfile(__dirname+'/chat.html');
       }       
    })
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
io.on('connection', function (socket) {
    console.log('A user connected');
    socket.on('setUsername', function (value) {
        console.log("value : " + value);
        console.log("users.indexof(data) : " + users.indexOf(value));
        if (users.indexOf(value) > -1) {
            socket.emit('userExists', value + ' username is taken! Try some other username.');
        } else {
            users.push(value);
            socket.emit('userSet', { username: value });
        }
    });

    socket.on('msg', function (data) {
        //Send message to everyone
        io.sockets.emit('newmsg', data);
    })
});

http.listen(2000, function () {
    console.log("**App Server running on port 2000**");

})