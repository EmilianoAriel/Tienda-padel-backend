const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user.controllers");
const validation = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../middlewares/uploadFile");

router.get("/users", [validation, isAdmin], userControllers.getUsers);

router.post("/users", [upload], userControllers.createUser);

router.get("/users/:id", userControllers.getUserById);

router.delete("/users/:id", [validation, isAdmin], userControllers.deleteUsers);

router.put(
  "/users/:id",
  [validation, isAdmin, upload],
  userControllers.updateUser
);

router.post("/login", userControllers.login);

module.exports = router;
