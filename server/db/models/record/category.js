const mongoose = require('mongoose');
const validator = require('validator');


const Category = mongoose.model('Category', {
  name: {
    type: String,
    required: true
  },
  oneTimeLimit: {
    type: Number,
    validate: {
      validator: (limit) => limit > 0 || limit === null,
      message: '{VALUE} must be bigger than 0'
    },
    default: Infinity
  },
  periodLimit: {
    type: Number,
    validate: {
      validator: (limit) => limit > 0 || limit === null,
      message: '{VALUE} must be bigger than 0'
    },
    default: Infinity
  },
  currentCosts: {
    type: Number,
    default: 0
  },
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
});

module.exports = Category;
