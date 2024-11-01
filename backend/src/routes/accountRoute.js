const express = require('express');
const accountController = require('../controllers/accountController');
const router = express.Router();

// Route untuk '/account'

// Login POST '/login'
router.post('/login', accountController.login);
// Register POST '/register'
router.post('/register', accountController.register);

module.exports = router;
