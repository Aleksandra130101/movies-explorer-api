const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(([a-zA-Z0-9]+).)+/),
    trailerLink: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(([a-zA-Z0-9]+).)+/),
    thumbnail: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(([a-zA-Z0-9]+).)+/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required().length(24),
  }),
}), deleteMovie);

module.exports = router;
