module.exports = (err, req, res, next) => {
  return res.json(err).status(err.httpStatusCode);
}