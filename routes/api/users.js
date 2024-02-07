const express = require("express");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLE_LIST = require("../../config/role_lists");
const {
  getUsers,
  deleteUser,
  getSingleUser,
} = require("../../controllers/userController");
const userRouter = express.Router();

userRouter
  .route("/")
  .get(verifyRoles(ROLE_LIST.Admin), getUsers)
  .delete(verifyRoles(ROLE_LIST.Admin), deleteUser);

userRouter.route("/:id").get(verifyRoles(ROLE_LIST.Admin), getSingleUser);

module.exports = userRouter;
