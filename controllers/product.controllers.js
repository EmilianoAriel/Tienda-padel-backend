const Product = require("../models/product.model");
const fs = require("fs").promises;
const path = require("path");
async function getProducts(req, res) {
  try {
    // const limit = parseInt(req.query.limit) || 3;
    // const skip = parseInt(req.query.skip) || 0;
    // const filter = [];

    // if (req.query.name) {
    //   filter.push({ name: { $regex: req.query.name, $options: "i" } });
    // }

    // if (req.query.min_price) {
    //   filter.push({ price: { $gte: req.query.min_price } });
    // }

    // const query = filter.length > 0 ? { $and: filter } : {};

    // const products = await Product.find(query)
    //   .select({ desciption: 0 })
    //   .sort({ name: 1 })
    //   .collation({ locale: "es" })
    //   .limit(limit)
    //   .skip(limit * skip);

    const products = await Product.find();

    return res.status(200).send(products);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error al obtener los productos" });
  }
}

async function createProduct(req, res) {
  try {
    const product = new Product(req.body);

    if (req.file) {
      product.image = req.file.filename;
    }

    const newProduct = await product.save();

    return res.status(201).send({
      message: "producto creado correctamente",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error al crear el producto" });
  }
}
//get product by _id
async function getProducstById(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send({
        ok: false,
        message: "Error al encontrar el producto",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "El producto fue llamado con exito",
      product,
    });
  } catch (error) {
    return res.status(500).send({
      ok: false,
      message: "Error al obtener el producto",
    });
  }
}

//delate function

async function deleteProducst(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).send({
        ok: false,
        message: "Error al encontrar el producto",
      });
    }

    if (product.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "products",
        product.image
      );

      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.log(error);
      }
    }

    return res.status(200).send({
      ok: true,
      message: "Producto Eliminado correctamente",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Error al borrar el producto" });
  }
}

//edit function
async function uploadProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (req.file) {
      product.image = req.file.filename;
      await product.save();
    }

    return res
      .status(200)
      .send({ ok: true, message: "Producto actualizado", product });
  } catch (error) {
    return res
      .status(500)
      .send({ ok: false, message: "Error al actualizar producto", error });
  }
}

module.exports = {
  getProducts,
  createProduct,
  getProducstById,
  deleteProducst,
  uploadProduct,
};
