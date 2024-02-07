const User = require("../model/User");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  //   console.log(cookies.jwt);
  const refreshToken = cookies?.jwt;
  const existingUser = await User.findOne({ refreshToken });

  //is refreshtoken in db
  if (!existingUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }
  existingUser.refreshToken = "";
  const result = await existingUser.save();
  console.log("logout", result);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //secure: true -only serve on https
  res.sendStatus(204);
};

module.exports = { handleLogout };
