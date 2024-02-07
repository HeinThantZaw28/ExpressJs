const express = require("express");
const { handleRefreshToken } = require("../controllers/refreshTokenController");
const refreshTokenRouter = express.Router();

refreshTokenRouter.route("/").get(handleRefreshToken);

module.exports = { refreshTokenRouter };
