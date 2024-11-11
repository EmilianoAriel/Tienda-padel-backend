const express = require("express");
const { createOrder, webHook } = require("../controllers/order.controllers");
const router = express.Router();

router.post("/orders", createOrder);

router.get("/succes", (res, req) => res.send("succes"));

router.get("/failure", (res, req) => res.send("failure"));

router.get("/pending", (res, req) => res.send("pending"));

router.post("/webhook", webHook);

module.exports = router;
