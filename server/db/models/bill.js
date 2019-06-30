const mongoose = require('mongoose');

const Bill = mongoose.model('Bill', {
  value: {
    type: Number,
    default: 0,
    required: true
  },
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
});

module.exports = Bill;
