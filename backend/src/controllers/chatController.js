const { pool } = require('../configs/dbconfig');
const logger = require('../tools/logger');

async function getChatroombyAccountId(req, res) {
    const {accountId} = req.params;
    try {
        const findQuery = await pool.query(
            'SELECT * FROM chatroom WHERE firstaccountid = $1 OR secondaccountid = $1',
            [accountId]
        );
        res.status(200).json({
            success: true,
            message: "Get chatroom success!",
            data: findQuery.rows
        });
        return
    }
    catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null
        });
    }
}

async function getChatbyChatroomId(req, res) {
    const {chatroomId} = req.params;
    try {
        const findQuery = await pool.query(
            'SELECT * FROM chat WHERE chatroomid = $1',
            [chatroomId]
        );
        res.status(200).json({
            success: true,
            message: "Get chat success!",
            data: findQuery.rows
        });
        return
    }
    catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null
        });
    }
}

async function writeChat(req, res) {
    const {chatroomId} = req.params;
    const {senderId, chatContentType, chatContent} = req.body;
    try {
        const insertQuery = await pool.query(
            'INSERT INTO chat (chatroomid, senderid, chatcontenttype, chatcontent) VALUES ($1, $2, $3, $4) RETURNING *',
            [chatroomId, senderId, chatContentType, chatContent]
        );
        res.status(201).json({
            success: true,
            message: "Create chat success!",
            data: insertQuery.rows[0]
        });
        return
    }
    catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null
        });
    }
}

async function deleteChatroom(req, res) {
    const {chatroomId} = req.params;
    try {
        const findQuery = await pool.query(
            'SELECT * FROM chat WHERE chatroomid = $1',
            [chatroomId]
        );
        if (findQuery.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Delete chat failed! Chatroom not found",
                data: null
            });
            return
        }
        await pool.query(
            'DELETE FROM chatroom WHERE chatroomid = $1',
            [chatroomId]
        );
        await pool.query(
            'DELETE FROM chat WHERE chatroomid = $1',
            [chatroomId]
        );
        res.status(201).json({
            success: true,
            message: "Delete chat success!",
            data: null
        });
        return
    }
    catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null
        });
    }
}

async function createChatroom(req, res) {
  const { firstAccountId, secondAccountId } = req.body;

  if (!firstAccountId || !secondAccountId) {
    res.status(400).json({
      success: false,
      message:
        "Bad Request: Both firstAccountId and secondAccountId are required.",
      data: null,
    });
    return;
  }

  try {
    // Check if chatroom already exists
    const checkQuery = await pool.query(
      `SELECT * FROM chatroom 
             WHERE (firstaccountid = $1 AND secondaccountid = $2) 
                OR (firstaccountid = $2 AND secondaccountid = $1)`,
      [firstAccountId, secondAccountId]
    );

    if (checkQuery.rowCount > 0) {
      res.status(200).json({
        success: true,
        message: "Chatroom already exists.",
        data: checkQuery.rows[0],
      });
      return;
    }

    // Create new chatroom
    const insertQuery = await pool.query(
      `INSERT INTO chatroom (firstaccountid, secondaccountid) 
             VALUES ($1, $2) RETURNING *`,
      [firstAccountId, secondAccountId]
    );

    res.status(201).json({
      success: true,
      message: "Chatroom created successfully.",
      data: insertQuery.rows[0],
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
}

module.exports = {
    getChatbyChatroomId,
    getChatroombyAccountId,
    writeChat,
    deleteChatroom,
    createChatroom
}