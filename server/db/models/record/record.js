const mongoose = require('mongoose');
const Category = require('./category');

const Record = mongoose.model('Record', {
  value: {
    type: Number,
    default: 0,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'consumption'],
    required: true
  },
  _categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
});

module.exports = Record;
