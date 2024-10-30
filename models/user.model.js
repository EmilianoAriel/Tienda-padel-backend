const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, minglength: 3, maxlength: 30 },
  email: {
    type: String,
    required: true,
    trim: true,
    minglength: 5,
    maxlength: 100,
    unique: true,
    index: true,
    validate: {
      validator: (value) => {
        const regex = /^[A-Za-z0-9._+\-']+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return regex.test(value);
      },
    },
  },
  password: {
    type: String,
    required: true,
    minglength: 4,
    maxlength: 100,
    trim: true,
  },

  bornDate: { type: String },

  location: {
    type: String,
    required: true,
    minglength: 3,
    maxlength: 100,
  },
  image: { type: String, default: "UserDefault.jfif" },
  role: {
    type: String,
    default: "client",
    enum: ["client", "admin", "superadmin"],
  },

  ceatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
