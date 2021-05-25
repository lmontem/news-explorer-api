const jwt = require('jsonwebtoken');

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
    payload = jwt.verify(token, 'secret key');
  } catch (err) {
    throw new AuthError('Authorization required');
  }

  req.user = payload;
  next();
}

module.exports = { auth };
