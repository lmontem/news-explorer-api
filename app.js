const express = require('express');

const app = express();
const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  // if everything is working, console shows which port app is listening to
  console.log(`App listening at port ${PORT}`);
});
