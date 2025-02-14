const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, imageUrl, price, description } = req.body;
    await Product.create({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user._id
    });
    console.log("Created Product");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  if (!product) {
    return res.redirect("/");
  }
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editing: editMode,
    product: product,
  });
};

exports.postEditProduct = async (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;
  const product = await Product.findById(productId);
  const conditions = { _id: productId };
  const updatedProduct = {
    title: title || product.title,
    price: price || product.price,
    description: description || product.description,
    imageUrl: imageUrl || product.imageUrl,
  };
  const opt = { new: true };
  await Product.findOneAndUpdate(conditions, updatedProduct, opt);
  console.log("UPDATED PRODUCT!");
  res.redirect("/admin/products");
};

exports.getProducts = async (req, res, next) => {
  const prods = await Product.find();
  res.render("admin/products", {
    prods,
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    await Product.findByIdAndDelete(prodId);
    console.log("DESTROYED PRODUCT");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};
