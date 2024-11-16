const Category = require("../models/category.models");

async function getCategories(req, res) {
  try {
    const section = await Category.find();

    return res
      .status(200)
      .send({ message: "Categorias obtenidas con exito", section });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error al obtener categorias" });
  }
}

async function getTypesForCategory(req, res) {
  const categoryName = req.params.category;

  try {
    const category = await Category.findOne({ category: categoryName });

    if (!category) {
      return res.status(404).send({ message: "Categoria no encontrada" });
    }
    const types = category.types;

    return res
      .status(200)
      .send({ message: "Tipos obtenidos con exito", types });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error al obtener tipos", error });
  }
}

async function createCategory(req, res) {
  const category = new Category(req.body);
  try {
    const newCategory = await category.save();

    return res.status(201).send(newCategory);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error al crear la categoria", error });
  }
}

async function updateCategory(req, res) {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).send(category);
  } catch {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error al actualizar la categoria", error });
  }
}

async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);

    return res.status(200).send(category);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error al eliminar la categoria", error });
  }
}

module.exports = {
  getCategories,
  createCategory,
  getTypesForCategory,
  updateCategory,
  deleteCategory,
};
