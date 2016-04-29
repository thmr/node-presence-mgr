var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ip = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
var fs = require('fs');
var path = require('path');
var configs = require('./configs/config');



var routes = require('./controllers/users');
app.use('/', routes);
app.use('/static',express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var sockets = require('./controllers/socket');

var usernames = {};
var numUsers = 0;

server.listen(port, ip, function () {
  console.log('Updated : Server listening at port %d', port);
});

var User = require('./models/user');

function getDBUserStatus(username,callback) {
  var query = User.find({}).where('_id').equals(username).select({name:1,status:1,_id:0,customstatus:1,icustomStatusFlag:1});
  query.exec(function(err, users) {
    if(users.length > 0)    
      callback(users); 
  });
}

function setDBUserStatus(username,sockid,status) {
	User.findOne({'_id' : username }, function(err, user) {
		if (!user) {
			console.log('setupMessage', 'User does not exist.Please try again');
			return ;
		}
		user.status = status;
        user.socketid= sockid;
		user.save(function(err, user) {

            console.log(err);
            console.log('u -----------> ' + user.id + ' .... ' + username  + '    ...... > '  ,user.status);

			return ;
		});
	});
}

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('away', function (data) {  
    getDBUserStatus(socket.username, function(udata) {
      udata = udata[0];
      if(typeof udata.icustomStatusFlag === "undefined"  || udata.icustomStatusFlag == false) {
        socket.broadcast.emit('user away', {
          username: data
        });
        setDBUserStatus(socket.username, socket.id, "away");
      }
    });
  });

  socket.on('disconnect', function () {
    getDBUserStatus(socket.username, function(udata) {
      udata = udata[0];
        if(typeof udata.icustomStatusFlag === "undefined"  || udata.icustomStatusFlag == false) {
        socket.broadcast.emit('user left', {
          username: socket.username
        });
        setDBUserStatus(socket.username, socket.id, "offline");
      }
    });
  });

  socket.on('online', function (data) {
    getDBUserStatus(socket.username, function(udata) {
      udata = udata[0];
        if(typeof udata.icustomStatusFlag === "undefined"  || udata.icustomStatusFlag == false) {
        socket.broadcast.emit('user joined', {
          username: data
        });
          setDBUserStatus(socket.username, socket.id ,"online");
      }
    });
  });

  socket.on('add user', function (username) {

    socket.username = username;

      console.log(username);

    getDBUserStatus(socket.username, function(udata) {
      udata = udata[0];
        if(typeof udata.icustomStatusFlag === "undefined"  || udata.icustomStatusFlag == false) {
        socket.broadcast.emit('user joined', {
          username: socket.username
        });
          setDBUserStatus(socket.username, socket.id, "online");
      }
    });
  });

  socket.on('typing', function (data) {
      console.log('Typing data JSON PARSE:  ', JSON.parse(JSON.stringify(data)));

      socket.broadcast.emit('typing', JSON.parse(JSON.stringify(data)));
  });

  socket.on('stop typing', function (data) {
      console.log('Typing data OFF JSON PARSE:  ', JSON.parse(JSON.stringify(data)));

      socket.broadcast.emit('stop typing', JSON.parse(JSON.stringify(data)));

  });

});
