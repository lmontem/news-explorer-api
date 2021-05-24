const User = require('../models/user');
const {
  NotFoundError, InvalidError,
} = require('../middleware/errorHandling');

// returns information about the logged-in user (email and name)
// GET /users/me

function getUserInfo(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      } else {
        return res.status(200).send(res.email, res.name);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new InvalidError('Invalid user'); }
      if (err.name === 'NotFound') { throw new NotFoundError('User not found'); }
    })
    .catch(next);
}
module.exports = { getUserInfo };
