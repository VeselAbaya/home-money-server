const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        next();
      })
    })
  }
  else {
    next();
  }
});

UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();

  return _.pick(userObject, ['_id', 'email'])
};

UserSchema.methods.generateAuthToken = function() {
  const access = 'auth';
  const token = jwt.sign({
    _id: this._id.toHexString(),
    access
  }, process.env.JWT_SECRET).toString();

  this.tokens = this.tokens.concat([{access, token}]);
  return this.save().then(() => token)
};

UserSchema.statics.findByToken = function(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch(err) {
    return Promise.reject()
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
};

UserSchema.statics.findByCredentials = function(email, password) {
  return User.findOne({email}).then(user => {
    if (!user)
      return Promise.reject();

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res)
          resolve(user);
        else
          reject();
      })
    })
  }).catch(() => {
    return Promise.reject();
  })
};

UserSchema.methods.removeToken = function(token) {
  return this.update({
    $pull: {
      tokens: {token}
    }
  })
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
