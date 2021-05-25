const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  NotFoundError, InvalidError, MongoError, AuthError,
} = require('../middleware/errorHandling');

// returns information about the logged-in user (email and name)

function getUserInfo(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      } else {
        return res.status(200).send({ email: user.email, name: user.name });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new InvalidError('Invalid user'); }
      if (err.name === 'NotFound') { throw new NotFoundError('User not found'); }
    })
    .catch(next);
}

// creates/registers user

function createUser(req, res, next) {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ email, password: hash, name });
    })
    .then(() => {
      console.log(email);
      res.send({ email, name });
    })
    .catch((err) => {
      if (err.code === 11000 && err.name === 'MongoError') { throw new MongoError('Duplicate email'); }
      if (err.name === 'ValidationError') { throw new InvalidError('Invalid user'); }
      if (err.name === 'NotFound') { throw new NotFoundError('User not found'); }
    })
    .catch(next);
}

// logs in user
function loginUser(req, res, next) {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            return Promise.reject(new Error('Incorrect email or password'));
          }
          const token = jwt.sign({ _id: user._id }, 'secret key', { expiresIn: '7d' });
          console.log(token);
          res.send({ token });
        });
    })
    .catch(() => {
      throw new AuthError('Authorization Error');
    })
    .catch(next);
}
module.exports = { getUserInfo, createUser, loginUser };
