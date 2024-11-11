const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { json } = require("express/lib/response");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const fs = require("fs").promises;
const path = require("path");
async function getUsers(req, res) {
  try {
    const users = await User.find();
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("error al obtener el usuario");
  }
}

async function createUser(req, res) {
  if (!req.body.password) {
    return res.status(400).send({
      ok: false,
      message: "La contraseña es incorrecta",
    });
  }

  const user = new User(req.body);

  bcrypt.hash(user.password, saltRounds, (error, hash) => {
    if (error) {
      return res.status(500).send({
        ok: false,
        message: "Error al crear usuario",
      });
    }
    user.password = hash;

    if (req.file) {
      user.image = req.file.filename;
    }

    user
      .save()
      .then((nuevoUser) => {
        console.log(nuevoUser);
        res.status(200).send(nuevoUser);
      })
      .catch((error) => {
        if (error.code === 11000) {
          return res.status(409).send({
            ok: false,
            message: "El email ya está registrado",
          });
        }

        if (error.name === "ValidationError") {
          const messages = Object.values(error.errors).map(
            (err) => err.message
          );
          return res.status(400).send({
            ok: false,
            message: "Error de validación",
            errors: messages,
          });
        }
        console.log(error);
        res.send("El usuario no se pudo crear");
      });
  });
}
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && id !== req.user._id) {
      return response
        .status(403)
        .send({ message: "No tienes permiso para acceder a este usuario" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({
        ok: false,
        message: "El usuario no fue encontrado",
      });
    }

    user.password = undefined;

    return res.status(200).send({
      ok: true,
      message: "El usuario fue encontrado",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error al obtener usuarios en la DB");
  }
}

async function deleteUsers(req, res) {
  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);

    if (!deleteUser) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    if (deleteUser.image && deleteUser.image !== "UserDefault.jfif") {
      const imagePath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "users",
        deleteUser.image
      );

      try {
        await fs.unlink(imagePath);
        console.log("Imagen eliminada:", imagePath);
      } catch (error) {
        console.log("Error al eliminar la imagen:", error);
      }
    }

    return res.status(200).send({
      ok: true,
      message: "El usuario fue borrado correctamente",
      deleteUser,
    });
  } catch (error) {
    console.log("Error al borrar el usuario:", error);
    return res.status(500).send({
      ok: false,
      message: "Error al borrar el usuario",
    });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && id !== req.user._id) {
      return res.status(403).send({
        message: "No tienes permisos para actualizar este usuario",
      });
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (req.file) {
      const imagePath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "users",
        user.image
      );

      try {
        await fs.unlink(imagePath);
        console.log("Imagen eliminada:", imagePath);
        user.image = req.file.filename;
        await user.save();
      } catch (error) {
        console.log("Error al eliminar la imagen:", error);
      }
    }

    return res.status(200).send({
      ok: true,
      message: "usuario actualizado correctamente",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Error al actualizar",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email y contraseña son requeridos" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(400)
        .send({ message: "Alguno de los datos es incorrecto" });
    }

    user.password = undefined;
    user.__v = undefined;

    const token = jwt.sign(user.toJSON(), SECRET, { expiresIn: "1d" });

    console.log(token);
    return res.send({
      message: "Login exitoso",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error al autenticar usuario",
    });
  }
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  deleteUsers,
  updateUser,
  login,
};
