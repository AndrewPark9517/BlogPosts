const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const app = express();

//log http layer using morgan logger middleware
app.use(morgan('common'));



app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
  });

