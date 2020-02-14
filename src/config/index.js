const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  throw new Error('Could not find .env file');
}

module.exports = {
  port: +process.env.PORT,
  api: {
    prefix: '/api',
  },
  firebase: {
    databaseURL: process.env.DATABASE_URL
  },
}
