class UsefulError extends Error {
  constructor(name, httpStatusCode = 500, context, ...params) {
    super(...params);

    this.name = name;
    this.httpStatusCode = httpStatusCode;
    this.context = context;
  }
}

module.exports = UsefulError;