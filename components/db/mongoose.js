const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.mongodb_uri);

module.exports = { mongoose };
