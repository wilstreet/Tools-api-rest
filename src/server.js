const express = require('express');
const cors = require('cors');

const { port, api } = require('./config');
const routes = require('./api');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(api.prefix, routes());

// Errors
app.use(require('./api/middlewares/errors'));

// Listen server
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
