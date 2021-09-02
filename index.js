const express = require('express');
const cors = require('cors');
const consign = require('consign');
require('dotenv').config();

const app = express();

app.use(cors());
app.disable('x-powered-by');

const port = process.env.PORT || 3000;

const host = '0.0.0.0';

app.get('/', (req, res) => {
  res.status(200).json({ error: false, data: { message: 'Teste' } });
});

consign().include('./app/controllers').into(app);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.listen(port, host);

console.log('Servidor escutando a porta', port);
