const express = require("express");
const { handleNewUser } = require("../controllers/registerController");
const registerRouter = express.Router();

registerRouter.route("/").post(handleNewUser);

module.exports = { registerRouter };
