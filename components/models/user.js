const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  facebookID: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
  },
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  favourites: {
    type: Array,
  },
  invitesActivated: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
