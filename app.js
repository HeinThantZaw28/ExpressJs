const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const { getSingleuser } = require("./controllers/users");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cartItems");
const Order = require("./models/order");
const OrderItem = require("./models/orderItem");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(getSingleuser);
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
Cart.belongsTo(User);
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

const startApp = async () => {
  try {
    await sequelize.sync({ force: false });
    let user = await User.findByPk(1);
    if (!user) {
      user = await User.create({ name: "Hein", email: "htz@gmail.com" });
    }

    const cart = await user.getCart();
    if (!cart) {
      await user.createCart();
    }
    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
};

startApp(); // Call the function to start the application
