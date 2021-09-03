const { Router } = require('express');

const router = Router();

const controllers = require('../controllers');
const middlewares = require('../middlewares');

router.get('/products', controllers.getProducts);
router.get('/products/:id', controllers.getProductsById);
router.post('/products', middlewares.productsSchema, controllers.createProduct);
router.patch(
  '/products/:id',
  middlewares.productsToUpdateSchema,
  controllers.updateProduct
);
router.delete('/products/remove-duplicates', controllers.removeDuplicates);
router.post('/purchase', middlewares.purchaseSchema, controllers.purchase);

router.patch('/purchase/devolution/:invoiceId', controllers.devolution);

module.exports = router;
