const express = require('express');

const router = express.Router()
const productController = require('./../controllers/productController')
const authController = require('./../controllers/authController');

// router.param('id', orderController.checkID);
// router.route('/top-5-cheap')
// .get(orderController.aliasTopOrders, orderController.getAllOrders);
// router.route('/order-stats').get(orderController.getOrderStats);
// router.route('/monthly-plan/:year').get(orderController.getMonthlyPlan);

router
.route('/:identifier')
.get(authController.protect,productController.getProductByIdOrNameOrBrand)  // view product option

.patch(authController.protect,
    authController.restrictTo('Receiving Clerk','Returns Clerk','Order Fulfillment Specialist'), productController.updateProduct)
.patch(authController.protect,
        authController.restrictTo('Receiving Clerk','Returns Clerk'), productController.addStock)
.patch(authController.protect,
            authController.restrictTo('Order Fulfillment Specialist'),
            productController.subtractStock)

.delete(authController.protect,
    authController.restrictTo('Order Fulfillment Specialist'),
    productController.deleteProduct);

router
.route('/')
.get(authController.protect,productController.getAllProducts)
.post(productController.createProduct);

module.exports = router;


