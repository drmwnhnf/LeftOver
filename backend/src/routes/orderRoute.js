const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

// Route untuk '/order'

// Get Order by Id '/id/:orderId'
router.get('/id/:orderId', orderController.getOrderbyId);
// Get Seller Order '/in/:sellerId'
router.get('/in/:sellerId', orderController.getSellerOrder);
// Get Buyer Order '/out/:buyerId'
router.get('/out/:buyerId', orderController.getBuyerOrder);
// Create Order POST '/create'
router.post('/create', orderController.createOrder);
// Seller accept Order PUT '/accept/:orderId'
router.put('/accept/:orderId', orderController.acceptOrder);
// Customer finish Order PUT '/finish/:orderId'
router.put('/finish/:orderId', orderController.finishOrder);
// Cancel Order PUT '/delete/:orderId'
router.put('/cancel/:orderId', orderController.cancelOrder);

module.exports = router;
