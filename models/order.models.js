const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  price: Number,
  section: String,
  description: String,
  quantity: Number,
});

const orderSchema = new Schema({
  products: [productSchema],
  createdAt: { type: Date, default: Date.now },
});

const historialSchema = new Schema({
  user: { type: String },
  orders: [orderSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", historialSchema);
