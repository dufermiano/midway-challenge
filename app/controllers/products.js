const moment = require('moment-timezone');
const ProductsDao = require('../dao/ProductsDao');
const connFactory = require('../conectionFactory');
const statusCode = require('../constants/statusCode');
const { getUniquesAndSanitize } = require('../helpers');
const { messages } = require('../constants/messages');

const getProducts = async (req, res, next) => {
  /* 
     #swagger.tags = ['Products']
     #swagger.description = 'Fetch all products'
     #swagger.responses[200] = {
               schema: { $ref: "#/definitions/ProductResponse" },
               description: 'Products fetched' 
    }
    #swagger.responses[500] = { 
        schema: { error: true, message: 'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.' },
        description: 'Internal error' 
    }
    */
  try {
    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    const [rows] = await productsDao.getAll();

    conn.end();

    return res.status(statusCode.Success).json(rows);
  } catch (error) {
    next(error);
  }
};

const getProductsById = async (req, res, next) => {
  /* 
     #swagger.tags = ['Products']
     #swagger.description = 'Get a product by its id'
     #swagger.parameters['id'] = { description: 'Product Id'}

     #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/ProductBody" },
               description: 'Product found' 
    }
     #swagger.responses[404] = { 
               schema: { message: 'Produto não encontrado'},
               description: 'Product not found' 
    }
    #swagger.responses[500] = { 
        schema: { error: true, message: 'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.' },
        description: 'Internal error' 
    }
    */

  try {
    const {
      params: { id },
    } = req;

    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    const [rows] = await productsDao.getById(id);

    if (rows.length > 0) {
      return res.status(statusCode.Success).json(rows);
    }
    conn.end();

    return res
      .status(statusCode.NotFound)
      .json({ message: messages.productNotFound });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  /* 
    #swagger.tags = ['Products']
    #swagger.description = 'Create a product passing the values contained on the models'
    #swagger.parameters['body'] = {
               in: 'body',
               description: 'Products information.',
               required: true,
               type: 'object',
               schema: { $ref: "#/definitions/ProductBody" }
    }
    #swagger.responses[201] = { 
               schema: { message: 'Produto criado com sucesso'},
               description: 'Product created' 
    }
    #swagger.responses[500] = { 
        schema: { error: true, message: 'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.' },
        description: 'Internal error' 
    }
     */
  try {
    const { body } = req;
    let date = moment.tz(process.env.TIMEZONE_SAO_PAULO).format();
    body.registrationDate = date;

    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    await productsDao.save(body);

    conn.end();

    return res.status(statusCode.Created).send({
      message: messages.productCreated,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  /* 
   #swagger.tags = ['Products']
   #swagger.description = 'Update a product passing the values contained on the models'
   #swagger.parameters['id'] = { description: 'Product Id'} 

   #swagger.parameters['body'] = {
               in: 'body',
               description: 'Products information.',
               required: true,
               type: 'object',
               schema: { $ref: "#/definitions/ProductToUpdate" }
    }

    #swagger.responses[200] = { 
               schema: { message: 'Produto alterado com sucesso'},
               description: 'Product updated' 
    } 
    
    #swagger.responses[404] = { 
               schema: { message: 'Produto não encontrado'},
               description: 'Product Not Found'
    } 

    #swagger.responses[500] = { 
        schema: { error: true, message: 'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.' },
        description: 'Internal error' 
    } */

  try {
    const { body } = req;
    const {
      params: { id },
    } = req;
    let date = moment.tz(process.env.TIMEZONE_SAO_PAULO).format();
    body.updateDate = date;

    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    const [rows] = await productsDao.getById(id);

    if (rows.length > 0) {
      await productsDao.save(body, id);

      return res.status(statusCode.Success).send({
        message: messages.productUpdated,
      });
    }
    conn.end();

    return res
      .status(statusCode.NotFound)
      .json({ message: messages.productNotFound });
  } catch (error) {
    next(error);
  }
};

const removeDuplicates = async (req, res, next) => {
  /* 
   #swagger.tags = ['Products']
   #swagger.description = 'Remove the products duplicated'
   #swagger.parameters['id'] = { description: 'Product Id'} 

    #swagger.responses[200] = { 
            schema: { $ref: "#/definitions/ProductSanitized" },
            description: 'Products sanitized and before sanitized. Shows Products Model'
    } 
    #swagger.responses[202] = { 
            schema: { message: 'Não existem duplicações na base' },
            description: 'No duplicates in database'
    } 

    #swagger.responses[500] = { 
        schema: { error: true, message: 'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.' },
        description: 'Internal error' 
    } */

  try {
    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    const [rows] = await productsDao.getAll();

    const _rows = Object.values(JSON.parse(JSON.stringify(rows)));

    const { sanitizedProducts, idsToUpdate } = await getUniquesAndSanitize(
      _rows
    );

    if (!idsToUpdate.length > 0) {
      return res
        .status(statusCode.Accepted)
        .json({ message: messages.noDuplicates });
    }

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

    conn.end();

    return res
      .status(statusCode.Success)
      .json({ productsBeforeSanitize: _rows, sanitizedProducts });
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
