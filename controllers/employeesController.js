const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };
  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res
      .status(400)
      .json({ message: "First and last name are required" });
  }
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  const existingEmployee = data.employees?.find(
    (employee) => employee.id === parseInt(req.body.id)
  );
  if (!existingEmployee) {
    return res
      .status(400)
      .json({ message: `Employee Id ${req.body.id} is not found!` });
  } else {
    existingEmployee.firstname =
      req.body.firstname || existingEmployee.firstname;
    existingEmployee.lastname = req.body.lastname || existingEmployee.lastname;
    const filteredArray = data.employees?.filter(
      (employee) => employee.id !== parseInt(req.body.id)
    );
    const unsortedArray = [...filteredArray, existingEmployee];
    data.setEmployees(
      unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
    );
    return res.json(data.employees);
  }
};

const deleteEmployee = (req, res) => {
  const existingEmployee = data.employees?.find(
    (employee) => employee.id === parseInt(req.body.id)
  );
  if (!existingEmployee) {
    return res
      .status(400)
      .json({ message: `Employee Id ${req.body.id} is not found!` });
  } else {
    const filteredArray = data.employees.filter(
      (employee) => employee.id !== parseInt(existingEmployee.id)
    );
    data.setEmployees([...filteredArray]);
    return res.status(200).json(data.employees);
  }
};

const getSingleEmployee = (req, res) => {
  const existingEmployee = data.employees.find(
    (employee) => employee.id === parseInt(req.params.id)
  );
  if (!existingEmployee) {
    return res.status(400).json({ message: `Employee not found!` });
  } else {
    data.setEmployees([existingEmployee]);
    return res.status(200).json(data.employees);
  }
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getSingleEmployee,
};
