const moment = require('moment-timezone');
const ProdutosDao = require('../dao/ProdutosDao');
const connFactory = require('../conectionFactory');

const getProducts = async (req, res, next) => {
  try {
    const conn = await connFactory();
    const produtosDao = new ProdutosDao(conn);

    const [rows] = await produtosDao.getAll();

    res.status(200).json(rows);

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

    res.status(200).json(rows);

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

    res.status(202).send({
      message: 'Produto criado com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductsById,
  createProduct,
};

//   app.get('/produtos/form', (req, res) => {
//     res.render('produtos/form');
//   });
