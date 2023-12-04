const jwt = require("jsonwebtoken");
const fsPromise = require("fs").promises;
const path = require("path");
require("dotenv").config();

const userDB = {
  users: require("../model/users.json"),
  setUser: function (data) {
    this.users = data;
  },
};

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  //   console.log(cookies.jwt);
  const refreshToken = cookies?.jwt;
  const existingUser = userDB.users?.find(
    (person) => person.refreshToken === refreshToken
  );

  //is refreshtoken in db
  if (!existingUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }
  const otherUsers = userDB.users.filter(
    (person) => person.refreshToken !== existingUser.refreshToken
  );
  const currentUser = { ...existingUser, refreshToken: "" };
  userDB.setUser([...otherUsers, currentUser]);
  await fsPromise.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(userDB.users)
  );
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //secure: true -only serve on https
  res.sendStatus(204);
};

module.exports = { handleLogout };
