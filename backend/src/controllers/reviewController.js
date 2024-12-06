const { pool } = require('../configs/dbconfig');
const logger = require('../tools/logger');

async function getReviewbyId(req, res) {
    const {reviewId} = req.params;
    try {
        const findQuery = await pool.query(
            "SELECT * FROM review WHERE reviewid = $1",
            [reviewId]
        );
        if (findQuery.rowCount != 0) {
            res.status(200).json({
                success: true,
                message: "Get review success!",
                data: findQuery.rows[0]
            });
            return
        }
        res.status(404).json({
            success: false,
            message: "Get review failed! Review not found",
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

async function getReviewsbyItemId(req, res) {
    const {itemId} = req.params;
    try {
        const findQuery = await pool.query(
            "SELECT r.reviewid FROM review r JOIN order o ON r.orderid = o.orderid JOIN item i ON i.itemid = o.itemid WHERE itemid = $1",
            [itemId]
        );
        if (findQuery.rowCount != 0) {
            res.status(200).json({
                success: true,
                message: "Get review success!",
                data: findQuery.rows
            });
            return
        }
        res.status(404).json({
            success: false,
            message: "Get review failed! Review not found",
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

async function getReviewsbyAccountId(req, res) {
    const {accountId} = req.params;
    try {
        const findQuery = await pool.query(
            "SELECT r.reviewid FROM review r JOIN order o ON r.orderId = o.orderId WHERE o.buyerId = $1",
            [accountId]
        );
        if (findQuery.rowCount != 0) {
            res.status(200).json({
                success: true,
                message: "Get review success!",
                data: findQuery.rows
            });
            return
        }
        res.status(404).json({
            success: false,
            message: "Get review failed! Review not found",
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

async function getReviewstoAccountId(req, res) {
    const {accountId} = req.params;
    try {
        const findQuery = await pool.query(
            "SELECT r.reviewid FROM review r JOIN order o ON r.orderId = o.orderId WHERE o.sellerId = $1",
            [accountId]
        );
        if (findQuery.rowCount != 0) {
            res.status(200).json({
                success: true,
                message: "Get review success!",
                data: findQuery.rows
            });
            return
        }
        res.status(404).json({
            success: false,
            message: "Get review failed! Review not found",
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

async function createReview(req, res) {
    const {orderId, description, rating, imageLink} = req.body;
    try {
        const insertQuery = await pool.query(
            "INSERT INTO review (orderid, description, rating, imagelink) VALUES ($1, $2, $3, $4) RETURNING reviewid",
            [orderId, description, rating, imageLink]
        );
        if (insertQuery.rowCount != 0) {
            res.status(201).json({
                success: true,
                message: "Create review success!",
                data: insertQuery.rows[0]
            });
            return
        }
        res.status(400).json({
            success: false,
            message: "Create review failed!",
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

async function editReview(req, res) {
    const {reviewId} = req.params;
    const {description, rating, imageLink} = req.body;
    try {
        const findQuery = await pool.query(
            "SELECT * FROM review WHERE reviewid = $1",
            [reviewId]
        );
        if (findQuery.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Edit review failed! Review not found",
                data: null
            });
            return
        }
        const updateQuery = await pool.query(
            "UPDATE review SET description = $1, rating = $2, imageLink = $3 WHERE reviewid = $4 RETURNING reviewid",
            [description, rating, imageLink, reviewId]
        );
        res.status(201).json({
            success: true,
            message: "Edit review success!",
            data: updateQuery.rows[0]
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

async function deleteReview(req, res) {
    const {reviewId} = req.params;
    try {
        await pool.query(
            "DELETE FROM review WHERE reviewid = $1",
            [reviewId]
        );
        res.status(201).json({
            success: true,
            message: "Delete review success!",
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

module.exports = {
    getReviewbyId,
    getReviewsbyItemId,
    getReviewsbyAccountId,
    getReviewstoAccountId,
    createReview,
    editReview,
    deleteReview
}