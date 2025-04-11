const express = require('express');
const catalogoController = require('./controllers/catalogoController');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(catalogoController);

app.listen(5001, () => {
  console.log('BackCatalogo ejecutandose en el puerto 5001');
});

