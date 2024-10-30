const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  price: Number,
  promo: Number,
  description: String,
  section: String,
  type: String,
  image: String,
  cuotas: String,
  createAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  // updateAt:{type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', productSchema);
