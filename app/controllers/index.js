const moment = require('moment-timezone');
const ProdutosDao = require('../dao/ProdutosDao');
const connFactory = require('../conectionFactory');
const statusCode = require('../constants/statusCode');
const { messages } = require('../constants/messages');

const getProducts = async (req, res, next) => {
  try {
    const conn = await connFactory();
    const produtosDao = new ProdutosDao(conn);

    const [rows] = await produtosDao.getAll();

    res.status(statusCode.Success).json(rows);

    conn.end();
  } catch (error) {
    next(error);
  }
};

const getProductsById = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    const conn = await connFactory();
    const produtosDao = new ProdutosDao(conn);

    const [rows] = await produtosDao.getById(id);

    res.status(statusCode.Success).json(rows);

    conn.end();
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { body } = req;
    let data = moment.tz(process.env.TIMEZONE_SAO_PAULO).format();
    body.dataCadastro = data;

    const conn = await connFactory();
    const produtosDao = new ProdutosDao(conn);

    await produtosDao.save(body);

    res.status(statusCode.Created).send({
      message: messages.productCreated,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { body } = req;
    const {
      params: { id },
    } = req;
    let data = moment.tz(process.env.TIMEZONE_SAO_PAULO).format();
    body.dataAtualizacao = data;

    const conn = await connFactory();
    const produtosDao = new ProdutosDao(conn);

    await produtosDao.save(body, id);

    res.status(statusCode.Success).send({
      message: messages.productUpdated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
};
