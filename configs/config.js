var mongoose = require('mongoose');

var configs = {
    mongoDb: 'mongo_access'
}
mongoose.connect(configs.mongoDb);
module.exports = configs;
