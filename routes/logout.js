const express = require("express");
const { handleLogout } = require("../controllers/logoutController");
const logoutRouter = express.Router();

logoutRouter.route("/").get(handleLogout);

module.exports = { logoutRouter };
