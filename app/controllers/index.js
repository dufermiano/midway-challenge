const moment = require('moment-timezone');
const ProductsDao = require('../dao/ProductsDao');
const connFactory = require('../conectionFactory');
const statusCode = require('../constants/statusCode');
const { getUniquesAndSanitize } = require('../helpers');
const { messages } = require('../constants/messages');

const getProducts = async (req, res, next) => {
  try {
    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    const [rows] = await productsDao.getAll();

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
    const productsDao = new ProductsDao(conn);

    const [rows] = await productsDao.getById(id);

    res.status(statusCode.Success).json(rows);

    conn.end();
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { body } = req;
    let date = moment.tz(process.env.TIMEZONE_SAO_PAULO).format();
    body.registrationDate = date;

    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    await productsDao.save(body);

    res.status(statusCode.Created).send({
      message: messages.productCreated,
    });
    conn.end();
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
    let date = moment.tz(process.env.TIMEZONE_SAO_PAULO).format();
    body.updateDate = date;

    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    await productsDao.save(body, id);

    res.status(statusCode.Success).send({
      message: messages.productUpdated,
    });
    conn.end();
  } catch (error) {
    next(error);
  }
};

const removeDuplicates = async (req, res, next) => {
  try {
    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    const [rows] = await productsDao.getAll();

    const _rows = Object.values(JSON.parse(JSON.stringify(rows)));

    const { sanitizedProducts, idsToUpdate } = getUniquesAndSanitize(_rows);

    const productsToUpdate = sanitizedProducts.filter((product) => {
      if (idsToUpdate.includes(product.id)) {
        return product;
      }
    });

    // update products that was duplicated
    await productsToUpdate.map(async (productToUpdate) => {
      await productsDao.save(productToUpdate);
    });

    // remove duplicates
    await productsDao.delete();

    res
      .status(statusCode.Success)
      .json({ productsBeforeSanitize: _rows, sanitizedProducts });

    conn.end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
  removeDuplicates,
};
