const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
  },
  price: {
    type: Number,
    required: [true, "El precio es requerido"],
    min: [1, "El precio debe ser mayor a 0"],
  },
  promo: {
    type: Number,
    min: [1, "El precio promocional debe ser mayor a 0"],
  },
  section: {
    type: String,
    required: [true, "La sección es requerida"],
  },
  type: {
    type: String,
    required: [true, "El tipo de producto es requerido"],
  },
  image: {
    type: String,
    required: [true, "La imagen es requerida"],
  },
  fechaIngreso: {
    type: String,
    required: [true, "La fecha de ingreso es requerida"],
  },
  cuotas: {
    type: String,
    enum: ["", "3 y 6 cuotas sin interes", "3,6 y 12 cuotas sin interes"],
  },
  description: {
    type: String,
    required: [true, "La descripción es requerida"],
    minlength: [20, "La descripción debe tener al menos 20 caracteres"],
    maxlength: [300, "La descripción no debe exceder los 300 caracteres"],
  },
  stock: {
    type: Number,
    required: [false],
    default: 1,
  },
  active: {
    type: Boolean,
    default: true,
  },
  // updateAt:{type: Date, default: Date.now}
});

module.exports = mongoose.model("Product", productSchema);
