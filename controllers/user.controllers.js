const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { json } = require('express/lib/response');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
async function getUsers(req, res) {
  try {
    const users = await User.find();
    console.log(users);
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send('error al obtener el usuario');
  }
}

async function createUser(req, res) {
  if (!req.body.password) {
    return res.status(400).send({
      ok: false,
      message: 'La contraseña es incorrecta',
    });
  }

  const user = new User(req.body);

  bcrypt.hash(user.password, saltRounds, (error, hash) => {
    if (error) {
      return res.status(500).send({
        ok: false,
        message: 'Error al crear usuario',
      });
    }
    user.password = hash;
    user
      .save()
      .then((nuevoUser) => {
        console.log(nuevoUser);
        res.status(200).send(nuevoUser);
      })
      .catch((error) => {
        console.log(error);
        res.send('El usuario no se pudo crear');
      });
  });
}
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin' && id !== req.user._id) {
      return response
        .status(403)
        .send({ message: 'No tienes permiso para acceder a este usuario' });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({
        ok: false,
        message: 'El usuario no fue encontrado',
      });
    }

    user.password = undefined;

    return res.status(200).send({
      ok: true,
      message: 'El usuario fue encontrado',
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Error al obtener usuarios en la DB');
  }
}

async function deleteUsers(req, res) {
  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);
    return res.status(200).send({
      ok: true,
      message: 'El usuario fue borrado correctamente',
      deleteUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: 'Error al borrar el usuario',
    });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin' && id !== req.user._id) {
      return res.status(403).send({
        message: 'No tienes permisos para actualizar este usuario',
      });
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).send({
      ok: true,
      message: 'usuario actualizado correctamente',
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: 'Error al actualizar',
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
        .send({ message: 'Email y contraseña son requeridos' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compareSync(password, user.password);

    if (!match) {
      return res
        .status(400)
        .send({ message: 'Alguno de los datos es incorrecto' });
    }

    user.password = undefined;
    user.__v = undefined;

    const token = jwt.sign(JSON.stringify(user), SECRET, { expiresIn: '1h' });

    // const token = jwt.sign(JSON.stringify(user), SECRET, { expireIn: '1h' });

    console.log(token);
    return res.send({
      message: 'Login exitoso',
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: 'Error al autenticar usuario',
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
