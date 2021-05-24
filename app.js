const express = require('express');

const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/newsexplorer', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  // if everything is working, console shows which port app is listening to
  console.log(`App listening at port ${PORT}`);
});
