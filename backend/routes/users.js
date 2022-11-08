const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUser, getUserMe, getUserId, updateUser, updateAvatar,
} = require('../controllers/users');

const linkRegexp = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*,]|(?:%[0-9a-fA-F][0-9a-fA-F]))+\./;

router.get('/', getUser);
router.get('/me', getUserMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserId);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(linkRegexp),
  }),
}), updateAvatar);

module.exports = router;
