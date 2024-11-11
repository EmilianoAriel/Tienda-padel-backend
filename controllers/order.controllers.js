const Order = require("../models/order.models");
const mercadopago = require("mercadopago");
const TOKEN = process.env.ACCES_TOKEN_MP;
const { v4: uuidv4 } = require("uuid");

const client = new mercadopago.MercadoPagoConfig({
  accessToken: TOKEN,
  options: { timeout: 2000, idempotencyKey: uuidv4() },
});

async function createOrder(req, res) {
  const preference = new mercadopago.Preference(client);

  const orderData = {
    user: req.body.user,
    orders: req.body.orders,
    total: req.body.total,
  };

  const order = new Order(orderData);

  const { user, orders } = req.body;

  const oldUser = await Order.findOne({ user: user }).select("user orders");

  const { orderId } = req.params;
  const selectedOrder = req.body.orders.find((order) => order._id === orderId);

  console.log(req.body.user);

  const items = selectedOrder.products.map((product) => ({
    title: product.name,
    unit_price: product.promo ? product.promo : product.price,
    description: product.description,
    quantity: product.quantity,
    picture_url: product.image,
    category_id: product.section,
    currency_id: "ARS",
  }));
  try {
    if (oldUser) {
      const products = orders[0].products;

      const ordenAgregada = {
        products: products,
        createdAt: new Date(),
      };

      const newOrder = {
        products: products.map((product) => ({
          name: product.name,
          price: product.promo ? product.promo : product.price,
          description: product.description,
          quantity: product.quantity,
          image: product.image,
          section: product.section,
        })),
        createdAt: Date.now(),
      };

      oldUser.orders.push(newOrder);

      await oldUser.save();

      const body = {
        items: items,
        payer: {
          email: "emilianoariel6@gmail.com",
        },
        payment_method_id: "ARS",
        back_urls: {
          success: "http://localhost:5173/",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending",
        },
        auto_return: "approved",
      };

      const response = await preference.create({ body });

      console.log(response);

      res.status(200).send({
        message: "Orden finalizada y enviada",
        initPoint: response.init_point,
      });

      console.log(newOrder);
      console.log(ordenAgregada);
    } else {
      const newOrder = await order.save();

      const body = {
        items: items,
        payer: {
          email: "emilianoariel6@gmail.com",
        },
        payment_method_id: "ARS",
        back_urls: {
          success: "http://localhost:5173/",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending",
        },
        auto_return: "approved",
      };

      const response = await preference.create({ body });

      console.log(response);

      res.status(200).send({
        message: "Orden finalizada y enviada",
        initPoint: response.init_point,
        newOrder,
      });
    }
  } catch (error) {
    console.log("Ha ocurrido un error:", error);
    return res.status(400).send({
      ok: false,
      message: "Error de validación",
      errors: error.message,
    });
  }
}

async function webHook(req, res) {
  try {
    const payment = req.query;
    console.log("Webhook recibido:", payment);

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error en el webhook:", error);
    res.status(500).send("Error en el webhook");
  }
}

module.exports = { createOrder, webHook };

// async function webHook(req, res) {
//   console.log(req.query);
//   const payment = req.query;
//   try {
//     // const payment = new mercadopago.Payment(client);
//     if (payment.type === "payment") {
//       const data = await mercadopago.Payment.findById(payment["data.id"]);

//       console.log(data);
//       return res.status(204).send({ message: "Pagado" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(404).send({ message: "Error" });
//   }
// }
