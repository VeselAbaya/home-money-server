const mongoose = require('mongoose');

const mongodb_uri = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(mongodb_uri);

module.exports = mongoose;
