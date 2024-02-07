const express = require("express");
const rootRouter = express.Router();
const path = require("path");

rootRouter.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

rootRouter.get("/new-page(html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "new_page.html"));
});

rootRouter.get("/old-page(html)?", (req, res) => {
  res.send(301, "/new-page.html");
});

rootRouter.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("Attempt to load hello.html");
    next();
  },
  (req, res) => {
    res.send("Hello HTML File");
    console.log("hello");
  }
);

const one = (req, res, next) => {
  console.log("One");
  next();
};
const two = (req, res, next) => {
  console.log("Two");
  next();
};

const three = (req, res) => {
  console.log("Three");
  res.send("Finished");
};

rootRouter.get("/chain", [one, two, three]);

module.exports = { rootRouter };
