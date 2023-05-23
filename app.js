const mongoose = require('mongoose');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const { PORT = 3000, DATA_BASE, NODE_ENV } = process.env;

const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB } = require('./utils/config');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : DB, {});

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.listen(PORT, () => {
  console.log(` App listening on port ${PORT} `);
});
