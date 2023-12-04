const bcrypt = require("bcrypt");
const fsPromise = require("fs").promises;
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();

const userDB = {
  users: require("../model/users.json"),
  setUser: function (data) {
    this.users = data;
  },
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: `Username and Password are required` });
  }
  const existingUser = userDB.users?.find(
    (person) => person.username === username
  );
  if (!existingUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  //compare password
  const matchPwd = await bcrypt.compare(password, existingUser.password);
  if (!matchPwd) {
    return res
      .status(401)
      .json({ message: "Unauthorized! Password does not match" });
  }
  // create JWTs
  const roles = Object.values(existingUser.roles);
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: existingUser.username,
        roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "5m" }
  );
  const refreshToken = jwt.sign(
    { username: existingUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  //saving refresh token with current user
  const otherUser = userDB.users.filter(
    (person) => person.username !== existingUser.username
  );
  const currentUser = { ...existingUser, refreshToken };
  userDB.setUser([...otherUser, currentUser]);
  await fsPromise.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(userDB.users)
  );
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ accessToken });
};

module.exports = { handleLogin };
