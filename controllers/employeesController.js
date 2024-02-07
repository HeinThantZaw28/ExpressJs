const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  // console.log({ employees });
  if (!employees) res.status(204).json({ message: "No User Found!" });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  const { firstname, lastname } = req.body;
  if (!firstname || !lastname) {
    return res
      .status(400)
      .json({ message: "First and last name are required" });
  }
  try {
    const result = Employee.create({
      firstname,
      lastname,
    });
    // console.log({ result });
    res.status(201).json(result);
  } catch (err) {
    console.log(err.message);
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.body;
  const existingEmployee = await Employee.findById(id);
  if (!existingEmployee) {
    return res
      .status(400)
      .json({ message: `Employee Id ${req.body.id} is not found!` });
  } else {
    existingEmployee.firstname =
      req?.body.firstname || existingEmployee.firstname;
    existingEmployee.lastname = req?.body.lastname || existingEmployee.lastname;
    const result = await existingEmployee.save();
    console.log({ result });
    return res.status(200).json({ message: "Update Success!" });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.body;
  const existingEmployee = await Employee.findById(id);
  if (!existingEmployee) {
    return res
      .status(400)
      .json({ message: `Employee Id ${req.body.id} is not found!` });
  } else {
    // await Employee.deleteOne({ _id: id });
    const result = await existingEmployee.deleteOne({ _id: id });
    console.log({ result });
    return res.status(204).json({ message: "Delete Employee Successfully!" });
  }
};

const getSingleEmployee = async (req, res) => {
  const { id } = req.params;
  const existingEmployee = await Employee.findById(id);
  if (!existingEmployee) {
    return res.status(400).json({ message: `Employee not found!` });
  } else {
    return res.status(200).json(existingEmployee);
  }
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getSingleEmployee,
};
