const express = require('express');

const router = express.Router()
const orderController = require('./../controllers/orderController')
const authController = require('./../controllers/authController');

// router.param('id', orderController.checkID);
// router.route('/top-5-cheap')
// .get(orderController.aliasTopOrders, orderController.getAllOrders);
// router.route('/order-stats').get(orderController.getOrderStats);
// router.route('/monthly-plan/:year').get(orderController.getMonthlyPlan);

router
.route('/:id')
.get(orderController.getOrder)
.patch(orderController.updateOrder)
.delete(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    orderController.deleteOrder);

router
.route('/')
.get(authController.protect,orderController.getAllOrders)
.post(orderController.createOrder);

module.exports = router;


