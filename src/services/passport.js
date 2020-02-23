const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const argon2 = require('argon2');
const { ExtractJwt } = require('passport-jwt');
const { jwtConfig } = require('../config');
const { getUserByEmailOrUsername, getElementById } = require('../models/model-firebase');

// Local strategy
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordFiled: 'password',
}, async (username, password, done) => {
  const user = await getUserByEmailOrUsername('users', username);
  if (user === null) {
    return done(null, false);
  }
  if (!await argon2.verify(user.password, password)) {
    return done(null, false);
  }
  return done(null, user);
}));

// Jwt strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfig.secretKey,
  algorithms: [jwtConfig.algorithm]
}, async (payload, done) => {
  const user = await getElementById('users', payload.sub);
  if (user) {
    return done(null, user);
  }
  return done(null, false);
}));

module.exports = app => {
  app.use(passport.initialize());
}