const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  AuthError,
} = require('./errorHandling');

function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new AuthError('Authorization required');
  }
  const token = authorization.replace('token=', '');

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthError('Authorization required');
  }

  req.user = payload;
  next();
}

module.exports = { auth };
