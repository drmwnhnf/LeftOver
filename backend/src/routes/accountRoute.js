const express = require('express');
const accountController = require('../controllers/accountController');
const router = express.Router();

// Route untuk '/account'

// Get account by account id GET '/:accountId'
router.get('/:accountid', accountController.getAccountbyId);
// Get account by account username GET '/u/:username'
router.get('/u/:username', accountController.getAccountbyUsername);
// Login POST '/login'
router.post('/login', accountController.login);
// Register POST '/register'
router.post('/register', accountController.register);
// Edit account PUT '/edit'
router.put('/edit', accountController.editAccount);
// Edit account credentials PUT '/edit/credentials'
router.put('/edit/credentials', accountController.editAccountCredentials);
// Delete account DELETE '/delete'
router.delete('/delete', accountController.deleteAccount);
// Request account verification POST '/verification/request'
router.post('/verification/request', accountController.requestVerification);
// Verify account POST '/verification/:accountId'
router.post('/verification/:accountId', accountController.verifyAccount);

module.exports = router;
