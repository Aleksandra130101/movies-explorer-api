require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflictError');
const SomethingWrongRequest = require('../errors/somethingWrongRequest');


// Get возвращает информацию о пользователе (email и имя)
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ email: user.email, name: user.name });
    })
    .catch(next);
};


// обновляет информацию о пользователе (email и имя)
module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { runValidators: true, new: true })
    .then((user) => {
      if (user) {
        res.send({ email, name });
      } else {
        next(new NotFoundError('Пользователь по id не найден!!!'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidateError') {
        next(new SomethingWrongRequest('При обновлении информации о пользователе переданы некорректные данные'));
      } else {
        next(err);
      }
    })
}

//Регистрация пользователя
module.exports.createUser = (req, res, next) => {
  const { email, name } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email,
      name,
      password: hash,
    }))
    .then(() => {
      res.send({
        email,
        name,
      })
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким Email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new SomethingWrongRequest('При создании пользователя переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}

//Авторизация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)

    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res.status(200).send({ token });
    })
    .catch((err) => {
      next(err);
    });
};