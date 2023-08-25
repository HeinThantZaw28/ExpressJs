const Order = require("../models/order");
const product = require("../models/product");
const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  const prods = await Product.find();
  try {
    res.render("shop/product-list", {
      prods,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = async (req, res, next) => {
  try {
    const prods = await Product.find();
    res.render("shop/index", {
      prods,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  const user = await req.user.populate("cart.items.productId");
  const products = await user.cart.items;
  // console.log(products);
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
    products: products,
  });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  await req.user.addToCart(prodId);
  console.log("ADD TO CART");
  res.redirect("/cart");
};

exports.postDecreaseCartItem = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    await req.user.decreaseCartItems(prodId);
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postIncreaseCartItem = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    await req.user.increaseCartItems(prodId);
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    await req.user.removeFromCart(prodId);
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    const products = await user.cart.items.map((item) => {
      return {
        product: item.productId._doc,
        quantity: item.quantity,
      };
    });
    await Order.create({
      products: products,
      user: {
        name: await req.user.name,
        userId: await req.user._id,
      },
    });
    await req.user.clearCart();
    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  } catch (err) {
    console.log(err);
  }
};
