const express = require('express');
const itemController = require('../controllers/itemController');
const router = express.Router();

// Route untuk '/item'

// Get All Items '/'
router.get('/', itemController.getAllItems);
// Get Item by Id '/:itemId'
router.get('/:itemId', itemController.getItembyId);
// Search Item '/search'
router.post('/search', itemController.searchItem);
// Post an Item POST '/upload'
router.post('/create', itemController.createItem);
// Edit Item PUT '/edit/:itemId'
router.put('/edit/:itemId', itemController.editItem);
// Delete Item DELETE '/delete/:itemId'
router.delete('/delete/:itemId', itemController.deleteItem);
// Get Items by Seller Id '/seller/:sellerId'
router.get('/seller/:sellerId', itemController.getItemsBySellerId);

module.exports = router;
