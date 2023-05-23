const { errors } = require('celebrate');
const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const authRouter = require('./auth');
const auth = require('../middlewares/auth');
const handleError = require('../middlewares/error');

const NotFoundError = require('../errors/not-found-err');

router.use(authRouter);

router.use(auth);
router.use('/users/me', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

router.use(errors());

router.use(handleError);

module.exports = router;
