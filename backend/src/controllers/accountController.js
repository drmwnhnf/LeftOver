const { pool } = require('../configs/dbconfig');
const { hashThis } = require('../tools/hasher');
const logger = require('../tools/logger');

function validateEmail(input) {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return validRegex.test(input);
}

async function login(req, res) {
    const { email, password } = req.body;
    const hashedPassword = hashThis(password);
    try {
        // Check for account
        const queryResult = await pool.query(
            "SELECT * FROM account WHERE email = $1 AND password = $2",
            [email, hashedPassword]
        );
        // If found, send the account data
        // else send nothing
        if (queryResult.rowCount != 0) {
            res.status(200).json({
                success: true,
                message: "Login Success!",
                data: queryResult.rows[0]
            });
        }
        else {
            res.status(200).json({
                success: false,
                message: "Login Failed! Wrong email or password!",
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

async function register(req, res) {
    const { email, username, password, fullname } = req.body;
    if (!validateEmail(email)) {
        res.status(200).json({
            success: false,
            message: "Register Failed! Email not valid!",
            data: null
        });
        return;
    }
    const hashedPassword = hashThis(password);
    try {
        // Check for account with the same email
        const queryResult = await pool.query(
            "SELECT * FROM account WHERE email = $1",
            [email]
        );
        // If found then fail
        // else then successfully register
        if (queryResult.rowCount != 0) {
            res.status(200).json({
                success: false,
                message: "Register Failed! Account already created!",
                data: null
            });
        }
        else {
            registerResult = await pool.query(
                "INSERT INTO account (username, email, password, fullname) VALUES ($1, $2, $3, $4)",
                [username, email, hashedPassword, fullname]
            );
            res.status(201).json({
                success: true,
                message: "Register Success!",
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



module.exports = {
    login,
    register
}