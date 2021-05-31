const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // in 15 mins
  max: 100, // max request are set to 100 per IP
});

module.exports = { limiter };
