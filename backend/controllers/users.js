const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const User = require('../models/user');

const { JWT_SECRET = 'secret_default' } = process.env;
module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => next(err));
};
module.exports.getUserMe = (req, res, next) => {
  console.dir('done')
  User.findById(req.user._id)
    .then((user) => {
      const {
        _id, name, about, avatar, email,
      } = user;
      if (user) {
        res.status(200).send({
          _id,
          name,
          about,
          avatar,
          email,
        });
      }
    })
    .catch((err) => next(err));
};
module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError(`Пользователь с id '${req.params.userId}' не найден.`))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`'${req.params.userId}' не является корректным идентификатором`));
      } else {
        next(err);
      }
    });
};
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(200).send({
      name,
      about,
      avatar,
      email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с данной почтой уже зарегестрирован'));
      } else {
        next(err);
      }
    });
};
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь с id '${req.user._id}' не найден`))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(new NotFoundError(`Пользователь с id '${req.user._id}' не найден`))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(200).cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ token });
    })
    .catch(next);
};
module.exports.logout = (req, res, next) => {
  res.clearCookie('token').send({ message: 'Выход' })
    .catch(next);
};
