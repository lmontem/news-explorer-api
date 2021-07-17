const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const {
  NotFoundError, InvalidError, MongoError, AuthError,
} = require('../middleware/errorHandling');
const {
  userNotFoundMessage,
  invalidDataMessage,
  duplicateMessage,
  authMessage,
  incorrectMessage,

} = require('../constants/constants');

// returns information about the logged-in user (email and name)

function getUserInfo(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFoundMessage);
      } else {
        return res.status(200).send({ email: user.email, username: user.username });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new InvalidError(invalidDataMessage); }
      if (err.name === 'NotFound') { throw new NotFoundError(userNotFoundMessage); }
    })
    .catch(next);
}

// creates/registers user

function createUser(req, res, next) {
  const {
    email, password, username,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, username,
    }))
    .then(() => res.send({
      email, username,
    }))
    .catch((err) => {
      if (err.code === 11000 && err.name === 'MongoError') { throw new MongoError(duplicateMessage); }
      if (err.name === 'ValidationError') { throw new InvalidError(invalidDataMessage); }
    })
    .catch(next);
}

// logs in user
function loginUser(req, res, next) {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(incorrectMessage));
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            return Promise.reject(new Error(incorrectMessage));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV ? JWT_SECRET : JWT_SECRET, { expiresIn: '7d' });
          res.send({ token });
        });
    })
    .catch(() => {
      throw new AuthError(authMessage);
    })
    .catch(next);
}
module.exports = { getUserInfo, createUser, loginUser };
