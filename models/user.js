const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AuthorizeError = require('../errors/authorizeError');
const { INCORRENT_EMAIL, INCORRENT_PASSWORD } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: [2],
    maxlength: [30],
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizeError(INCORRENT_EMAIL));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizeError(INCORRENT_PASSWORD));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
