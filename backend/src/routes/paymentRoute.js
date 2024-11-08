const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();

// Route untuk '/payment'

// Get Seller payment '/payment/:sellerId/in'
router.post('/payment/:sellerId/in', paymentController.getSellerpayment);
// Get Buyer payment '/payment/:buyerId/out'
router.post('/payment/:buyerId/out', paymentController.getBuyerpayment);
// Create payment POST '/create'
router.post('/create', paymentController.createpayment);
// Edit payment PUT '/edit/:paymentId'
router.put('/edit/:paymentId', paymentController.editpayment);
// Cancel payment PUT '/delete/:paymentId'
router.put('/cancel/:paymentId', paymentController.cancelpayment);

module.exports = router;
