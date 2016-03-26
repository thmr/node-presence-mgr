var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  var query = User.find({'handle' : {$exists: true, $ne: []}}).select({handle: 1, name:1, status:1, _id:1,customstatus:1, icustomStatusFlag:1}); //{name:1, status:1, _id:1,customstatus:1, icustomStatusFlag:1}
  query.exec(function(err, users) {
    var jsonArr = [];

      console.log(users[0]._id);

    for (var i = 0, len = users.length; i < len; i++) {
      if(users[i].icustomStatusFlag === true) {
        users[i].status=users[i].customstatus;
      }
      jsonArr.push({
        name: users[i].name,
        status: users[i].status,
       _id: users[i]._id,
          handle: users[i].handle

      });
    }
    res.render('index', {users: JSON.parse(JSON.stringify(jsonArr))});
  });
});

module.exports = router;