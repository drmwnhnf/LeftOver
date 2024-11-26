const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

// Route untuk '/chat'

// Get chatroom by user Id '/'
router.get('/', chatController.getChatroom);
// Get chat by second person Id '/:secondPersonId'
router.get('/:secondPersonId', chatController.getChat);
// Write a chat POST '/:secondPersonId'
router.post('/:secondPersonId', chatController.writeChat);
// Delete chat DELETE '/delete/:chatId'
router.delete('/:secondPersonId', chatController.deletechat);

module.exports = router;
