module.exports = (err, req, res, next) => {
  console.log(err)
  return res.json(err).status(err.httpStatusCode);
}