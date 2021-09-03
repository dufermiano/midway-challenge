const moment = require('moment-timezone');
const ProductsDao = require('../dao/ProductsDao');
const PurchaseDao = require('../dao/PurchaseDao');
const connFactory = require('../conectionFactory');
const statusCode = require('../constants/statusCode');
const { getUniquesAndSanitize, generateInvoice } = require('../helpers');
const { messages, errorMessages } = require('../constants/messages');

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

    const { sanitizedProducts, idsToUpdate } = await getUniquesAndSanitize(
      _rows
    );

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

const purchase = async (req, res, next) => {
  try {
    const { body } = req;
    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    const [rows] = await productsDao.getById(body.productId);

    const _rows = Object.values(JSON.parse(JSON.stringify(rows)));

    if (_rows.length === 0) {
      res.status(statusCode.NotFound).send({
        message: errorMessages.productNotFound,
      });

      conn.end();
    }

    const hasProduct = _rows.find((product) => product.inventory > 0);

    if (!hasProduct) {
      res.status(statusCode.Success).send({
        message: messages.productHasNoInventory,
      });

      conn.end();
    } else {
      const product = Object.assign(..._rows);

      const invoice = await generateInvoice(product.id, body.customerCPF);

      invoice.isActive = 1;

      --product.inventory;
      delete product.registrationDate;
      delete product.updateDate;

      // create purchase

      const purchaseDao = new PurchaseDao(conn);

      await purchaseDao.save(invoice);

      // update product inventory
      await productsDao.save(product);

      res.status(statusCode.Created).send({
        message: messages.successPurchase,
        invoice,
        productPurchased: {
          productId: product.id,
          productName: product.name,
          productSize: product.size,
          productDescription: product.description,
        },
      });
      conn.end();
    }
  } catch (error) {
    next(error);
  }
};

const devolution = async (req, res, next) => {
  try {
    const {
      params: { invoiceId },
    } = req;
    const conn = await connFactory();
    const purchaseDao = new PurchaseDao(conn);

    const [rows] = await purchaseDao.getById(invoiceId);

    const purchaseRows = Object.values(JSON.parse(JSON.stringify(rows)));

    if (purchaseRows.length === 0) {
      res.status(statusCode.NotFound).send({
        message: errorMessages.invoiceNotFound,
      });

      conn.end();
    } else {
      const invoice = Object.assign(...purchaseRows);
      const productsDao = new ProductsDao(conn);

      const [rows] = await productsDao.getProductByInvoiceId(invoice.invoiceId);

      const product = Object.assign(...rows);

      if (product.length === 0) {
        res.status(statusCode.NotFound).send({
          message: errorMessages.productNotFound,
        });

        conn.end();
      }

      invoice.isActive = 0;

      ++product.inventory;

      await purchaseDao.save(invoice);

      // update product inventory
      await productsDao.save(product);

      res.status(statusCode.Success).send({
        message: messages.successDevolution,
      });
      conn.end();
    }
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
  purchase,
  devolution,
};
