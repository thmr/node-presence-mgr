var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    name         : String,
    status       : {type: String, default: 'offline'},
    customstatus : {type: String, default: 'offline'},
    handle       : {type: String, default: '--'},
    icustomStatusFlag : {type: Boolean, default: false},
    lastSeen     : {type: String, default: null}
});

module.exports = mongoose.model('User', userSchema);