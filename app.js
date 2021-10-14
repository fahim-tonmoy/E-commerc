require('express-async-errors');
const express = require('express');
const app = express();
var cors = require('cors');

const error = require('./middlewares/error');

require('./middlewares')(app);
require('./middlewares/routes')(app);

app.use(cors())
app.use(error);

module.exports = app;