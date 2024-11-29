const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

// Route untuk '/chat'

// Get chatroom by account Id GET '/u/:accountId'
router.get('/u/:accountId', chatController.getChatroombyAccountId);
// Get chat chatroomId GET '/r/:chatroomId'
router.get('/r/:chatroomId', chatController.getChatbyChatroomId);
// Write a chat POST '/r/:chatroomId'
router.post('/r/:chatroomId', chatController.writeChat);
// Delete chatroom DELETE '/r/:chatroomId'
router.delete('/r/:chatroomId', chatController.deleteChatroom);

module.exports = router;
