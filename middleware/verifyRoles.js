const verifyRoles = (...allowRoles) => {
  return (req, res, next) => {
    if (!req?.roles)
      return res.status(401).json({ message: "there is no roles" });
    const rolesArray = [...allowRoles];
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
