const bcrypt = require("bcrypt");
const User = require("../model/User");

const handleNewUser = async (req, res) => {
  console.log("register");
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: `Username and Password are required` });
  }
  const duplicateUserName = await User.findOne({ username: username });
  if (duplicateUserName) {
    return res.status(409).json({ message: "Username is already exist!" }); //conflict
  }
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    const result = await User.create({
      username,
      password: hashedPwd,
    });
    console.log({ result });
    res.status(201).json({ message: "Successfully Created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
