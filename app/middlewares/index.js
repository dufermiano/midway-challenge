const Joi = require('joi');
const statusCode = require('../constants/statusCode');

const validateRequest = (req, res, next, schema) => {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    res.status(statusCode.BadRequest).send({
      error: true,
      message: `Validation error: ${error.details
        .map((x) => x.message)
        .join(', ')}`,
    });
  } else {
    req.body = value;
    next();
  }
};

const productsSchema = (req, res, next) => {
  const schema = Joi.object({
    nome: Joi.string().required(),
    valor: Joi.number().required(),
    estoque: Joi.number().integer().required(),
    tamanho: Joi.string().max(3).required(),
    tipo: Joi.string().required(),
    descricao: Joi.string().required(),
  });
  validateRequest(req, res, next, schema);
};

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (_error, _req, res, _next) => {
  console.log('Ocorreu um erro interno: ', _error);

  res.status(statusCode.InternalServerError).send({
    error: true,
    message: 'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.',
  });
};

module.exports = { productsSchema, errorMiddleware };
