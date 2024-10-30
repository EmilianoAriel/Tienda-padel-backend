const router = require('express').Router();
const categoryController = require('../controllers/category.controllers');

router.get('categories', categoryController.getCategories);

module.exports = router;
