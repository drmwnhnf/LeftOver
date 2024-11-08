const express = require('express');
const itemController = require('../controllers/itemController');
const router = express.Router();

// Route untuk '/item'

// Get Item by Search '/search'
router.post('/search', itemController.searchItem);
// Post an Item POST '/upload'
router.post('/create', itemController.createItem);
// Edit Item PUT '/edit/:itemId'
router.put('/edit/:itemId', itemController.editItem);
// Delete Item DELETE '/delete/:itemId'
router.delete('/delete/:itemId', itemController.deleteItem);

module.exports = router;
