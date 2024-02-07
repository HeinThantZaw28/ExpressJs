const mongoose = require("mongoose");

const url = process.env.ATLAS_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(url);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { connectDB };
