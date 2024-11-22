const { pool } = require('../configs/dbconfig');
const logger = require('../tools/logger');

async function createItem(req, res) {
    const { team_id, title, body } = req.body;
    try {
        const queryResult = await pool.query(
            "INSERT INTO item (team_id, title, body) VALUES ($1, $2, $3) RETURNING *",
            [team_id, title, body]
        );
        if (queryResult.rowCount != 0) {
            res.status(201).json({
                success: true,
                message: "Create success!",
                data: queryResult.rows[0]
            });
        }
        else {
            res.status(200).json({
                success: false,
                message: "Create failed!",
                data: null
            });
        }
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

async function searchItem(req, res) {
    const { teamId } = req.params;
    try {
        const queryResult = await pool.query(
            "SELECT * FROM note WHERE team_id = $1",
            [teamId]
        );
        res.status(200).json({
            success: true,
            message: "Get success!",
            data: queryResult.rows
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null
        });
    }
}

async function deleteItem(req, res) {
    const { noteId } = req.params;
    try {
        const searchQuery = await pool.query(
            "SELECT * FROM note WHERE id = $1",
            [noteId]
        );
        if (searchQuery.rowCount != 0) {
            await pool.query(
                "DELETE FROM note WHERE id = $1",
                [noteId]
            );
            res.status(200).json({
                success: true,
                message: "Delete success!",
                data: null
            });
        }
        else {
            res.status(200).json({
                success: false,
                message: "Delete failed! note not found!",
                data: null
            });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null
        });
    }
}

async function editItem(req, res) {
    const { title, body } = req.body;
    const { noteId } = req.params;
    try {
        const searchQuery = await pool.query(
            "SELECT * FROM note WHERE id = $1",
            [noteId]
        );
        if (searchQuery.rowCount != 0) {
            const queryResult = await pool.query(
                "UPDATE note SET title = $1, body = $2 WHERE id = $3 RETURNING *",
                [title, body, noteId]
            );
            res.status(200).json({
                success: true,
                message: "Update success!",
                data: queryResult.rows[0]
            });
        }
        else {
            res.status(200).json({
                success: false,
                message: "Update failed! note not found!",
                data: null
            });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null
        });
    }
}

module.exports = {
    createItem,
    searchItem,
    deleteItem,
    editItem
}