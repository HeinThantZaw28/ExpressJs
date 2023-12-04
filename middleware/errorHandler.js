const { logEvents } = require("./logEvents");
const path = require("path");

const errorHandler = (err, req, res, next) => {
  console.log(err.stack);
  logEvents(`${err.name}:${err.message}`, "errLog.txt");
  res.status(500).send(err.message);
};

const error404 = (req, res, next) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "..", "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "Error 404. Page Not Found!" });
  } else {
    res.type("txt").send("Error 404. Page Not Found!");
  }
};

module.exports = { errorHandler, error404 };
