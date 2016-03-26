var mongoose = require('mongoose');

var configs = {
    mongoDb: process.env.MONGO_ACCESS || ''
}
mongoose.connect(configs.mongoDb);
module.exports = configs;
