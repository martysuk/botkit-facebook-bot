const mongoose = require('mongoose');
const env = require('node-env-file');

env('../botkit-facebook-bot/.env');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.mongodb_uri);

module.exports = { mongoose };
