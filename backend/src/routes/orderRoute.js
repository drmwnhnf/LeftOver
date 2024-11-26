const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

// Route untuk '/order'

// Get Seller Order '/order/:sellerId/in'
router.post('/order/:sellerId/in', orderController.getSellerOrder);
// Get Buyer Order '/order/:buyerId/out'
router.post('/order/:buyerId/out', orderController.getBuyerOrder);
// Create Order POST '/create'
router.post('/create', orderController.createOrder);
// Edit Order PUT '/edit/:orderId'
router.put('/edit/:orderId', orderController.editOrder);
// Cancel Order PUT '/delete/:orderId'
router.put('/cancel/:orderId', orderController.cancelOrder);

module.exports = router;
