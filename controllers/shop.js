const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      // console.log(product);
      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const cart = await req.user.getCart(); // this line will make, selecting the cart associated with this user
  // console.log("cart", cart);
  const products = await cart.getProducts({ where: { id: prodId } }); // idk , need to ask
  // console.log("products", products);
  let newQuantity = 1;
  let product;
  if (products.length > 0) {
    product = await products[0];
    // console.log("product", product);
  }
  if (product) {
    const oldQuantity = await product.cartItem.quantity;
    // console.log("oldQuantity", oldQuantity);
    newQuantity = oldQuantity + 1;
    //in this case, in order of this logic, update the whole cart-product with old cart-product along with the new quantity
  }
  product = await Product.findByPk(prodId);
  cart.addProduct(product, {
    through: { quantity: newQuantity },
  });
  res.redirect("/cart");
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart?.getProducts();
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const cart = await req.user.getCart();
  const products = await cart.getProducts({ where: { id: prodId } });
  const product = await products[0];
  const cartItem = await product.cartItem;
  // console.log(cartItem.quantity);
  if (cartItem.quantity > 1) {
    cartItem.quantity -= 1;
    await cartItem.save();
  } else {
    // await product.cartItem.destroy();  // one way of deleting the --> product in cart|| cartItem
    await cart.removeProduct(product); //another way of deleting the --> product in cart|| cartItem
  }
  res.redirect("/cart");
};

exports.postCreateOrder = async (req, res, next) => {
  //region read comment
  //to add product from cart into cart, we will need to get cart, then we will get product from that cart, then we can add these products into order. In order to add product into order table, we will need to create order, related to the user. So we created it. Then we will add the products but about the quantity of the orderItem, we need to specify each product so we use map operation and add each product's quantity to the cartItem's quantity.
  const cart = await req.user.getCart();
  const products = await cart.getProducts();
  const order = await req.user.createOrder();
  await order.addProducts(
    products.map((product) => {
      product.orderItem = { quantity: product.cartItem.quantity };
      return product;
    })
  );
  cart.setProducts(null);
  res.redirect("/orders");
};

exports.getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders({ include: ["products"] });
  // const products = await order.getProducts();
  console.log(orders);
  res.render("shop/orders", {
    orders,
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
