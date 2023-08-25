const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          require: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          require: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (prodId) {
  const existingCartItemIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === prodId.toString()
  );
  let newQuantity = 1;
  const updateCartItems = [...this.cart.items];
  if (existingCartItemIndex >= 0) {
    updateCartItems[existingCartItemIndex].quantity += newQuantity;
  } else {
    updateCartItems.push({
      productId: prodId,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updateCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart  = function (prodId) {
  let updatedCartItems = [...this.cart.items];
  updatedCartItems = updatedCartItems.filter(
    (item) => item.productId.toString() !== prodId.toString()
  );
  this.cart = {
    items: updatedCartItems,
  };
 return this.save();
};

userSchema.methods.increaseCartItems = function (prodId) {
  const existingCartItemIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === prodId.toString()
  );
  const updateCartItems = [...this.cart.items];
  updateCartItems[existingCartItemIndex].quantity ++;
  const updatedCart = {
    items: updateCartItems,
  };
  this.cart = updatedCart;
  return this.save();
}

userSchema.methods.decreaseCartItems = function (prodId) {
  const existingCartItemIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === prodId.toString()
  );
  let updatedCartItems = [...this.cart.items];
  const existingQuantity = updatedCartItems[existingCartItemIndex].quantity;
  if (existingQuantity > 1) {
    updatedCartItems[existingCartItemIndex].quantity--;
  } else {
    updatedCartItems = updatedCartItems.filter(
      (item) => item.productId.toString() !== prodId.toString()
    );
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const mongodb = require("mongodb");
// const { getDB } = require("../util/database");
// const { get } = require("../routes/admin");
// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDB();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const existingCartItemIndex = this.cart?.items.findIndex(
//       (item) => item.productId.toString() === product._id.toString()
//     );
//     let newQuantity = 1;
//     const updateCartItems = [...this.cart?.items];
//     if (existingCartItemIndex >= 0) {
//       updateCartItems[existingCartItemIndex].quantity += newQuantity;
//     } else {
//       updateCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = {
//       items: updateCartItems,
//     };
//     const db = getDB();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   deleteCartItems(prodId) {
//     const existingCartItemIndex = this.cart?.items.findIndex(
//       (item) => item.productId.toString() === prodId.toString()
//     );
//     const existingCartItem = this.cart?.items.find(
//       (item) => item.productId.toString() === prodId.toString()
//     );
//     let updateCartItems = [...this.cart?.items];
//     if (existingCartItem.quantity > 1) {
//       updateCartItems[existingCartItemIndex].quantity -= 1;
//     } else {
//       updateCartItems = this.cart.items.filter(
//         (item) => item.productId.toString() !== prodId.toString()
//       );
//     }
//     const updatedCart = {
//       items: updateCartItems,
//     };
//     const db = getDB();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   addOrder() {
//     const db = getDB();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             username: this.username,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(() => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch((err) => console.log(err));
//   }

//   getOrders() {
//     const db = getDB();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDB();
//     return db
//       .collection("users")
//       .find({ _id: new ObjectId(userId) })
//       .next()
//       .then((user) => user)
//       .catch((err) => console.log(err));
//   }

//   async getCart() {
//     try {
//       const productIds = this.cart?.items?.map((item) => item.productId);
//       const db = getDB();
//       const products = await db
//         .collection("products")
//         .find({ _id: { $in: productIds } })
//         .toArray();

//       const updatedProducts = products.map((product) => {
//         const quantity =
//           this.cart.items.find(
//             (item) => item.productId.toString() === product._id.toString()
//           )?.quantity || 0;

//         return {
//           ...product,
//           quantity: quantity,
//         };
//       });

//       console.log("Updated products:", updatedProducts);
//       return updatedProducts;
//     } catch (error) {
//       console.error("Error:", error);
//       throw error;
//     }
//   }

//   static fetchUsers() {
//     const db = getDB();
//     return db
//       .collection("users")
//       .find()
//       .toArray()
//       .then((users) => {
//         console.log("users", users);
//         return users;
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
