const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const { limiter } = require('./middleware/rateLimiter');
const user = require('./routes/userRoutes');
const article = require('./routes/articleRoutes');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { createUser, loginUser } = require('./controllers/userController');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/newsexplorer', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(user);
app.use(article);
app.use(requestLogger); // enabling the request logger
app.use(bodyParser.json());
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), loginUser);
app.use(helmet());
app.use(limiter);
app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler

// centralized error handling
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: (err.statusCode === 500) ? 'Error from server' : err.message });
  next();
});

app.listen(PORT, () => {
  // if everything is working, console shows which port app is listening to
  console.log(`App listening at port ${PORT}`);
});
