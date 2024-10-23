const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/user.routes');

app.use(cors());

app.use(express.json());

app.use([userRoutes]);

module.exports = app;