const express = require('express');
const cors = require('cors');
const { port, api } = require('./config');
const routes = require('./api');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(api.prefix, routes());
// Errors
app.use(require('./api/middlewares/errors'));

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
