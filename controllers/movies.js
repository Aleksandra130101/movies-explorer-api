const Movie = require('../models/movie');

const SomethingWrongRequest = require('../errors/somethingWrongRequest');
const NotFoundError = require('../errors/not-found-err');
const NoAccessError = require('../errors/noAccessError');

// возвращает все сохранённые текущим  пользователем фильмы
module.exports.getMovies = (reg, res, next) => {
  Movie.find({})
    .then((movie) => {
      res.send({ data: movie });
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
        next(new SomethingWrongRequest('При создании фильма переданы некорректные данные'));
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
        next(new NotFoundError('Фильм по id не найден!!!'));
      } else if (movie.owner._id.toString() === req.user._id.toString()) {
        Movie.deleteOne(movie)
          .then(() => {
            res.send({ message: 'Карточка удалена' });
          })
          .catch(next);
      } else {
        next(new NoAccessError('Для удаления карточки нет доступа'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new SomethingWrongRequest('id невалидный'));
      } else {
        next(err);
      }
    });
};
