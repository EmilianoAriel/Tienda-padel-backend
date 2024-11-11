const express = require("express");
const app = express();
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const productsRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const { default: MercadoPagoConfig } = require("mercadopago");
app.use(cors());
app.use(express.static("public"));

app.use(express.json());

app.use([userRoutes, productsRoutes, orderRoutes]);

module.exports = app;
