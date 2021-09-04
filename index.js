require('dotenv').config();
require('./swagger.js');
const express = require('express');
const cors = require('cors');
const routes = require('./app/routes');
const middlewares = require('./app/middlewares');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const app = express();

const port = process.env.PORT || 3000;

const host = '0.0.0.0';

app.use(cors());
app.disable('x-powered-by');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/', (_req, res) => {
  // #swagger.description = 'Root route, healthcheck'

  return res.status(200).send('It works');
});

app.use(routes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(middlewares.errorMiddleware);

app.listen(port, host);

console.log('Server listening to port', port);
