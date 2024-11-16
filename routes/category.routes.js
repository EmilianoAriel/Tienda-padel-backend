const router = require("express").Router();
const categoryController = require("../controllers/category.controllers");

router.get("/categories", categoryController.getCategories);

router.post("/categories", categoryController.createCategory);

router.get("/categories/:category", categoryController.getTypesForCategory);

router.put("/categories/:id", categoryController.updateCategory);

router.delete("/categories/:id", categoryController.deleteCategory);

module.exports = router;
