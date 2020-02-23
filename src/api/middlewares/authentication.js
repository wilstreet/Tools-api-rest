const passport  = require('passport');
const UsefulError = require('../.././utils/useful-error');

// JWT Authentication middleware
module.exports = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    console.log('user',user)
    if (info) {
      return next(new UsefulError(info.message, 401));
    }
    if (err) {
      console.log(err);
      return next(new UsefulError('The database not work!!'));
    }
    if (!user) {
      return next(new UsefulError('You are not allowed to access.', 403));
    }
    req.user = user;
    next();
  })(req, res, next);
};