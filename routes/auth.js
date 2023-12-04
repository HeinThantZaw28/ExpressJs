const express = require("express");
const { handleLogin } = require("../controllers/authController");
const authRouter = express.Router();

authRouter.route("/").post(handleLogin);

module.exports = { authRouter };
