const mongoose = require('mongoose');

const Bill = mongoose.model('Bill', {
  value: {
    type: Number,
    default: 0,
    required: true
  },
  currency: {
    type: String,
    enum: ['RUB', 'USD', 'EUR'],
    required: true,
    default: 'RUB'
  },
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
});

module.exports = Bill;
