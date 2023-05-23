const Movie = require('../models/movie');

const SomethingWrongRequest = require('../errors/somethingWrongRequest');
const NotFoundError = require('../errors/not-found-err');
const NoAccessError = require('../errors/noAccessError');
const {
  INCORRENT_DATE,
  DELETE_FILM,
  NOT_FOUND,
  NOT_DELETE_MOVIE,
} = require('../utils/constants');

// возвращает все сохранённые текущим  пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

// создание фильма
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new SomethingWrongRequest(INCORRENT_DATE));
      } else {
        next(err);
      }
    });
};

// удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError(NOT_FOUND));
      } else if (movie.owner._id.toString() === req.user._id.toString()) {
        Movie.deleteOne(movie)
          .then(() => {
            res.send({ message: DELETE_FILM });
          })
          .catch(next);
      } else {
        next(new NoAccessError(NOT_DELETE_MOVIE));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new SomethingWrongRequest(INCORRENT_DATE));
      } else {
        next(err);
      }
    });
};
