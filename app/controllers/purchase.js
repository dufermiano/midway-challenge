const ProductsDao = require('../dao/ProductsDao');
const connFactory = require('../conectionFactory');
const statusCode = require('../constants/statusCode');
const PurchaseDao = require('../dao/PurchaseDao');

const { messages, errorMessages } = require('../constants/messages');
const { generateInvoice } = require('../helpers');

const purchase = async (req, res, next) => {
  /* 
     #swagger.tags = ['Purchase']
     #swagger.description = 'Purchase a product'
     #swagger.parameters['body'] = {
                 in: 'body',
                 description: 'Purchase information.',
                 required: true,
                 type: 'object',
                 schema: {
                    "productId": 3,
                    "customerCPF": "487.459.470-07",
                    "id": 1,
                }
      }
  
      #swagger.responses[200] = { 
              schema: { message: 'Compra realizada com sucesso.', invoice: {}, productPurchased: {} },
              description: 'Returns purchase data, referencing to Purchase Model and the productPurchased, referencing to Products Model'
      } 
      #swagger.responses[202] = { 
              schema: { message: 'Desculpe. Esse produto está esgotado.' },
              description: 'Return message informing that there is no inventory to this product'
      } 
  
       #swagger.responses[404] = { 
          schema: { error: true, message: 'Produto não encontrado.' },
          description: 'NotFound' 
      }
  
      #swagger.responses[500] = { 
          schema: { error: true, message: 'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.' },
          description: 'Internal error' 
      } */
  try {
    const { body } = req;
    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    const [rows] = await productsDao.getById(body.productId);

    const _rows = Object.values(JSON.parse(JSON.stringify(rows)));

    if (_rows.length === 0) {
      conn.end();

      return res.status(statusCode.NotFound).send({
        message: errorMessages.productNotFound,
      });
    }

    const hasProduct = _rows.find((product) => product.inventory > 0);

    if (!hasProduct) {
      conn.end();

      return res.status(statusCode.Accepted).send({
        message: messages.productHasNoInventory,
      });
    }
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

    conn.end();

    return res.status(statusCode.Success).send({
      message: messages.successPurchase,
      invoice,
      productPurchased: {
        productId: product.id,
        productName: product.name,
        productSize: product.size,
        productDescription: product.description,
      },
    });
  } catch (error) {
    next(error);
  }
};

const devolution = async (req, res, next) => {
  /* 
     #swagger.tags = ['Purchase']
     #swagger.description = 'Purchase a product'
     #swagger.parameters['invoiceId'] = { description: 'Invoice Id',  type: 'string'}
  
      #swagger.responses[200] = { 
              schema: { message: 'Devolução realizada com sucesso.' },
              description: 'Returns a message informing the devolution was done.'
      } 
      #swagger.responses[404] = { 
              schema: { message: 'Nota fiscal já cancelada ou inexistente.' },
              description: 'Returns a message informing the product doesnt exist or the invoice doesnt exist or has already been cancelled.'
      } 
  
     #swagger.responses[500] = { 
          schema: { error: true, message: 'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.' },
          description: 'Internal error' 
      } */

  try {
    const {
      params: { invoiceId },
    } = req;
    const conn = await connFactory();
    const purchaseDao = new PurchaseDao(conn);

    const [rows] = await purchaseDao.getById(invoiceId);

    const purchaseRows = Object.values(JSON.parse(JSON.stringify(rows)));

    if (purchaseRows.length === 0) {
      conn.end();

      return res.status(statusCode.NotFound).send({
        message: errorMessages.invoiceNotFound,
      });
    }
    const invoice = Object.assign(...purchaseRows);
    const productsDao = new ProductsDao(conn);

    const [products] = await productsDao.getProductByInvoiceId(
      invoice.invoiceId
    );

    const product = Object.assign(...products);

    if (product.length === 0) {
      conn.end();

      return res.status(statusCode.NotFound).send({
        message: errorMessages.productNotFound,
      });
    }

    invoice.isActive = 0;

    ++product.inventory;

    await purchaseDao.save(invoice);

    // update product inventory
    await productsDao.save(product);

    conn.end();

    return res.status(statusCode.Success).send({
      message: messages.successDevolution,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { purchase, devolution };
