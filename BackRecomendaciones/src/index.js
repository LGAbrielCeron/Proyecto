

const express = require('express');
const recomendacionesModel = require('./controllers/recomendacionesController');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(recomendacionesModel);

app.listen(5003, () => {
  console.log('backRecomendaciones ejecutandose en el puerto 5003');
});

