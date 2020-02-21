const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  throw new Error('Could not find .env file');
}

module.exports = {
  port: +process.env.PORT || 5000,
  api: {
    prefix: '/api',
  },
  firebase: {
    databaseURL: process.env.DATABASE_URL
  },
  jwtConfig: {
    secretKey: process.env.SECRET_KEY,
    algorithm: process.env.ALGORITHM_JWT,
    expire: process.env.EXPIRE_TOKEN,
  }  
}
