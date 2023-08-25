const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  const users = await User.find();
  if (users) {
    let user = await users[0];
    req.user = user;
  }
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

async function appStart() {
  await mongoose.connect(
    "mongodb+srv://heinthantzaw:htzmongo@cluster0.whgmoso.mongodb.net/shoprv?retryWrites=true&w=majority"
  );
  app.listen(3000);
  const users = await User.find();
  if (users.length < 1) {
    await User.create({
      name: "THANT",
      email: "andres@gmail.com",
      cart: {
        items: [],
      },
    }); 
  }
}
appStart();
