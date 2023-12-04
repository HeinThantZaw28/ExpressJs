const bcrypt = require("bcrypt");
const fsPromise = require("fs").promises;
const path = require("path");

const userDB = {
  users: require("../model/users.json"),
  setUser: function (data) {
    this.users = data;
  },
};

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: `Username and Password are required` });
  }
  const duplicateUserName = userDB.users?.find(
    (person) => person.username === username
  );
  if (duplicateUserName) {
    return res.status(409); //conflict
  }
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = {
      username: username,
      roles: { User: 2001 },
      password: hashedPwd,
    };
    userDB.setUser([...userDB.users, newUser]);
    await fsPromise.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(userDB.users)
    );
    console.log("user data", userDB.users);
    res.status(201).json({ message: "Successfully Created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
