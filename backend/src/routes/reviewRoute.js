const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router();

// Route untuk '/review'

// Get review by Id GET '/id/:reviewId'
router.get('/id/:reviewId', reviewController.getReviewbyId);
// Get reviews by item Id GET '/on/:orderId'
router.get('/on/:itemId', reviewController.getReviewsbyItemId);
// Get reviews created by account Id GET '/by/:accountId'
router.get('/by/:accountId', reviewController.getReviewsbyAccountId);
// Get reviews created to account Id GET '/to/:accountId'
router.get('/to/:accountId', reviewController.getReviewstoAccountId);
// Create review POST '/create'
router.post('/create', reviewController.createReview);
// Edit review PUT '/edit/:reviewId'
router.put('/edit/:reviewId', reviewController.editReview);
// Delete review DELETE '/delete/:reviewId'
router.delete('/delete/:reviewId', reviewController.deleteReview);

module.exports = router;