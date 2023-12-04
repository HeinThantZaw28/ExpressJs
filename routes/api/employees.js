const express = require("express");
const {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getSingleEmployee,
} = require("../../controllers/employeesController");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLE_LIST = require("../../config/role_lists");
const employeeRouter = express.Router();

employeeRouter
  .route("/")
  .get(getAllEmployees)
  .post(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor), createNewEmployee)
  .put(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor), updateEmployee)
  .delete(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor), deleteEmployee);

employeeRouter.route("/:id").get(getSingleEmployee);

module.exports = employeeRouter;
