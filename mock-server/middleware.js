const { randomUUID } = require('crypto');

// json-server auto-generates numeric ids by default; the app expects string _id values.
module.exports = (req, res, next) => {
  if (req.method === 'POST' && !req.body._id) {
    req.body._id = randomUUID();
  }
  next();
};
