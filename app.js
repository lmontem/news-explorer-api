const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const { celebrate, Joi } = require('celebrate');
const user = require('./routes/userRoutes');
const article = require('./routes/articleRoutes');
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
app.use(bodyParser.json());
app.post('/signup', createUser);
app.post('/signin', loginUser);

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: (err.statusCode === 500) ? 'Error from server' : err.message });
  next();
});

app.listen(PORT, () => {
  // if everything is working, console shows which port app is listening to
  console.log(`App listening at port ${PORT}`);
});
