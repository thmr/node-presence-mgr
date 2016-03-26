var express = require('express');
var mongoose = require('mongoose');

module.exports = function(app) {
  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  io.on('connection', function (socket) {
    var addedUser = false;

    socket.on('away', function (data) {   
      socket.username = username;
      User.findOne({ 'name' : username }, function(err, user) {
        user.status = 'online';
        user.lastSeen = Date.now();
        socket.broadcast.emit('user away', {
          username: socket.username,
        });
      });         
    });
    
    socket.on('disconnect', function () {
      socket.username = username;
      User.findOne({ 'name' : username }, function(err, user) {
        user.status = 'online';
        user.lastSeen = Date.now();
        socket.broadcast.emit('user joined', {
          username: socket.username,
        });
      }); 
      
    });

    socket.on('online', function (data) {
      socket.broadcast.emit('user online', {
        username: socket.username,
        timestamp: Date.now()
      });
    });

    socket.on('add user', function (username) {
      socket.username = username;
      User.findOne({ 'name' : username }, function(err, user) {
        user.status = 'online';
        user.lastSeen = Date.now();
        socket.broadcast.emit('user joined', {
          username: socket.username,
        });
      });      
    });

    socket.on('typing', function () {
      socket.broadcast.emit('typing', {
        username: socket.username
      });
    });

    socket.on('stop typing', function () {
      socket.broadcast.emit('stop typing', {
        username: socket.username
      });
    });
    
  });
}