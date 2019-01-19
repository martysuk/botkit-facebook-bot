
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  productName: {
    type: String,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  buyerPhoneNumber: {
    type: String,

    unique: true,
  },
  deliverToLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  feedback: {
    type: String,
  },
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order };
