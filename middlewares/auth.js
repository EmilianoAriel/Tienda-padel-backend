const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

function validation(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .send({ message: 'No tienes autorizacion para acceder a este endpoint' });
  }

  jwt.verify(token, SECRET, (error, payload) => {
    if (error) {
      console.log(error);
      return res.status(401).send({
        message: 'No tienes autorizacion para acceder a este endpoint',
      });
    }
    console.log(payload);

    req.user = payload;
    next();
  });
}

module.exports = validation;
