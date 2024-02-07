const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: `Username and Password are required` });
  }
  const existingUser = await User.findOne({ username: username });
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
  const roles = Object.values(existingUser.roles).filter(Boolean);
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
  existingUser.refreshToken = refreshToken;
  const result = await existingUser.save();
  console.log("auth", result);
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ roles, accessToken });
};

module.exports = { handleLogin };
