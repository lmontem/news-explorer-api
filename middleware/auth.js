const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  AuthError,
} = require('./errorHandling');
const {
  authMessage,
} = require('../constants/constants');

function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new AuthError(authMessage);
  }
  const token = authorization.replace('token=', '');

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : JWT_SECRET);
  } catch (err) {
    throw new AuthError(authMessage);
  }

  req.user = payload;
  next();
}

module.exports = { auth };
