const { Router } = require('express');

const router = Router();

const controllers = require('../controllers');
const middlewares = require('../middlewares');

router.get('/produtos', controllers.getProducts);
router.get('/produtos/:id', controllers.getProductsById);
router.post('/produtos', middlewares.productsSchema, controllers.createProduct);

module.exports = router;
