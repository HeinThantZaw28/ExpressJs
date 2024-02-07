const { allowOrigins } = require("../config/allowOrigin");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", true);
  }
  next();
};

module.exports = { credentials };
