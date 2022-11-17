const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => next(err));
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};
module.exports.deleteCard = (req, res, next) => {
  const ownerId = req.user._id;
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError(`Карточка с id '${req.params.cardId}' не найдена`))
    .then((card) => {
      if (card) {
        if (card.owner.toString() === ownerId) {
          card.delete()
            .then(() => res.status(200).send({ message: `Карточка с id '${req.params.cardId}' успешно удалена` }))
            .catch(next);
        } else { throw new ForbiddenError('Карточка пренадлежит другому пользователю'); }
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`'${req.params.cardId}' не является корректным идентификатором`));
      } else {
        next(err);
      }
    });
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    // .then(() => res.status(200).send({ message: 'На карточку поставлен лайк' }))
    .then((newCard) => res.status(200).send(newCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    // .then(() => res.status(200).send({ message: 'С карточки снят лайк' }))
    .then((newCard) => res.status(200).send(newCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else {
        next(err);
      }
    });
};
