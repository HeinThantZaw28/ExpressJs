const jwt = require("jsonwebtoken");
require("dotenv").config();

const userDB = {
  users: require("../model/users.json"),
  setUser: function (data) {
    this.users = data;
  },
};

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  // console.log({ cookies });
  if (!cookies?.jwt) return res.sendStatus(401);

  console.log("jwt>>>", cookies.jwt);
  const refreshToken = cookies?.jwt;
  const existingUser = userDB.users?.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!existingUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    const roles = Object.values(existingUser.roles);
    if (err || existingUser.username !== decoded.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    return res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
