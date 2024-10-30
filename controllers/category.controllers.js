async function getCategories(req, res) {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Error al obtener categorias' });
  }
}

module.exports = {
  getCategories,
};
