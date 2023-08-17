const User = require("../models/user");

const getSingleuser = async (req, res, next) => {
  try {
    const user = await User.findByPk(1);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getSingleuser };
