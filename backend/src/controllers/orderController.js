const { pool } = require('../configs/dbconfig');
const logger = require('../tools/logger');

async function getOrderbyId(req, res) {
    const {orderId} = req.params;
    try {
        const findQuery = await pool.query(
            "SELECT * FROM order WHERE orderid = $1",
            [orderId]
        );
        if (findQuery.rowCount != 0) {
            res.status(200).json({
                success: true,
                message: "Get order success!",
                data: findQuery.rows[0]
            });
            return
        }
        res.status(404).json({
            success: false,
            message: "Get order failed! Order not found",
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

async function getSellerOrder(req, res) {
    const {sellerId} = req.params;
    try {
        const findQuery = await pool.query(
            "SELECT * FROM order WHERE sellerid = $1",
            [sellerId]
        );
        if (findQuery.rowCount != 0) {
            res.status(200).json({
                success: true,
                message: "Get order success!",
                data: findQuery.rows
            });
            return
        }
        res.status(404).json({
            success: false,
            message: "Get order failed! Order not found",
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

async function getBuyerOrder(req, res) {
    const {buyerId} = req.params;
    try {
        const findQuery = await pool.query(
            "SELECT * FROM order WHERE buyerid = $1",
            [buyerId]
        );
        if (findQuery.rowCount != 0) {
            res.status(200).json({
                success: true,
                message: "Get order success!",
                data: findQuery.rows
            });
            return
        }
        res.status(404).json({
            success: false,
            message: "Get order failed! Order not found",
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

async function createOrder(req, res) {
    const {itemId, sellerId, buyerId, itemAmount} = req.body;
    try {
        const findQuery = await pool.query(
            "SELECT * FROM item WHERE itemid = $1",
            [itemId]
        );
        if (findQuery.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Create order failed! Item not found",
                data: null
            });
            return
        }
        const insertQuery = await pool.query(
            "INSERT INTO order (itemid, sellerid, buyerid, itemamount, totalprice) VALUES ($1, $2, $3, $4, $5) RETURNING itemid",
            [itemId, sellerId, buyerId, itemAmount, (itemAmount * findQuery.rows[0].price)]
        );
        res.status(201).json({
            success: true,
            message: "Create order success!",
            data: findQuery.rows[0]
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

async function acceptOrder(req, res) {
    const {orderId} = req.params;
    try {
        const findQuery = await pool.query(
            "SELECT * FROM order WHERE orderid = $1",
            [orderId]
        );
        if (findQuery.rows === 0) {
            res.status(404).json({
                success: false,
                message: "Accept order failed! Order not found",
                data: null
            });
            return
        }
        if (findQuery.rows[0].status === "ONGOING" || findQuery.rows[0].status === "DONE") {
            res.status(400).json({
                success: false,
                message: "Accept order failed! Order already accepted",
                data: null
            });
            return
        }
        if (findQuery.rows[0].status === "CANCELED") {
            res.status(400).json({
                success: false,
                message: "Accept order failed! Order already canceled",
                data: null
            });
            return
        }
        const updateQuery = await pool.query(
            "UPDATE order SET status = 'ONGOING' WHERE orderid = $1 RETURNING orderId",
            [orderId]
        );
        res.status(201).json({
            success: true,
            message: "Accept order success!",
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

async function finishOrder(req, res) {
    const {orderId} = req.params;
    const {orderCode} = req.body;
    try {
        const findQuery = await pool.query(
            "SELECT * FROM order WHERE orderid = $1",
            [orderId]
        );
        if (findQuery.rows === 0) {
            res.status(404).json({
                success: false,
                message: "Finish order failed! Order not found",
                data: null
            });
            return
        }
        if (findQuery.rows[0].status === "DONE") {
            res.status(400).json({
                success: false,
                message: "Finish order failed! Order already done",
                data: null
            });
            return
        }
        if (findQuery.rows[0].status === "CANCELED") {
            res.status(400).json({
                success: false,
                message: "Finish order failed! Order already canceled",
                data: null
            });
            return
        }
        if (findQuery.rows[0].status === "WAITING") {
            res.status(400).json({
                success: false,
                message: "Finish order failed! Order is not accepted yet",
                data: null
            });
            return
        }
        if (findQuery.rows[0].ordercode != orderCode) {
            res.status(400).json({
                success: false,
                message: "Finish order failed! Wrong order code",
                data: null
            });
            return
        }
        const updateQuery = await pool.query(
            "UPDATE order SET status = 'DONE' WHERE orderid = $1 RETURNING orderId",
            [orderId]
        );
        res.status(201).json({
            success: true,
            message: "Finish order success!",
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

async function cancelOrder(req, res) {
    const {orderId} = req.params;
    try {
        const findQuery = await pool.query(
            "SELECT * FROM order WHERE orderid = $1",
            [orderId]
        );
        if (findQuery.rows === 0) {
            res.status(404).json({
                success: false,
                message: "Cancel order failed! Order not found",
                data: null
            });
            return
        }
        if (findQuery.rows[0].status === "DONE") {
            res.status(400).json({
                success: false,
                message: "Cancel order failed! Order already done",
                data: null
            });
            return
        }
        if (findQuery.rows[0].status === "CANCELED") {
            res.status(400).json({
                success: false,
                message: "Cancel order failed! Order already canceled",
                data: null
            });
            return
        }
        const updateQuery = await pool.query(
            "UPDATE order SET status = 'CANCELED' WHERE orderid = $1 RETURNING orderId",
            [orderId]
        );
        res.status(201).json({
            success: true,
            message: "Cancel order success!",
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

module.exports = {
    getOrderbyId,
    getSellerOrder,
    getBuyerOrder,
    createOrder,
    acceptOrder,
    finishOrder,
    cancelOrder
}