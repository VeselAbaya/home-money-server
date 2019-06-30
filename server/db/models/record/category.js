const mongoose = require('mongoose');
const validator = require('validator');


const Category = mongoose.model('Category', {
  name: {
    type: String,
    required: true
  },
  limit: {
    type: Number,
    validate: {
      validator: (limit) => limit > 0,
      message: '{VALUE} must be bigger than 0'
    },
    default: Infinity
  },
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
});

module.exports = Category;
