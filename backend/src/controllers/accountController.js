const { pool } = require('../configs/dbconfig');
const { hashThis } = require('../tools/hasher');
const logger = require('../tools/logger');
const mailer = require('../tools/mailer');


function validateEmail(input) {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return validRegex.test(input);
}

async function getAccountbyUsername(req, res) {
    const {username} = req.params;
    try {
        const findQuery = await pool.query(
            "SELECT * FROM account WHERE username = $1",
            [username]
        );
        if (findQuery.rowCount != 0) {
            res.status(200).json({
                success: true,
                message: "Get Account Success!",
                data: findQuery.rows[0]
            });
            return
        }
        else {
            res.status(200).json({
                success: false,
                message: "Get Account Failed! Account not found",
                data: null
            });
            return
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

async function getAccountbyId(req, res) {
    const {accountId} = req.params;
    try {
        const findQuery = await pool.query(
            "SELECT * FROM account WHERE accountId = $1",
            [accountId]
        );
        if (findQuery.rowCount != 0) {
            res.status(200).json({
                success: true,
                message: "Get Account Success!",
                data: findQuery.rows[0]
            });
            return
        }
        else {
            res.status(200).json({
                success: false,
                message: "Get Account Failed! Account not found",
                data: null
            });
            return
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

async function login(req, res) {
    const { email, password } = req.body;
    const hashedPassword = hashThis(password);
    try {
        // Check for account
        const queryResult = await pool.query(
            "SELECT * FROM account WHERE email = $1 AND password = $2",
            [email, hashedPassword]
        );
        if (queryResult.rowCount != 0) {
            if (!queryResult.rows[0].isverified) {
                res.status(200).json({
                    success: false,
                    message: "Login Failed! Account not verified!",
                    data: queryResult.rows[0].accountid
                });
                return
            }
            res.status(200).json({
                success: true,
                message: "Login Success!",
                data: queryResult.rows[0].accountid
            });
            return
        }
        else {
            res.status(200).json({
                success: false,
                message: "Login Failed! Wrong email or password!",
                data: null
            });
            return
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
    const { email, username, password, firstName, surname, country, city, district, address, imageURL } = req.body;
    if (email.length === 0 || username.length === 0 || password.length === 0 || firstName.length === 0 || surname.length === 0) {
        res.status(200).json({
            success: false,
            message: "Register Failed! Data not complete!",
            data: null
        });
        return;
    }
    if (!validateEmail(email)) {
        res.status(200).json({
            success: false,
            message: "Register Failed! Email not valid!",
            data: null
        });
        return;
    }
    if (password.length < 8 || password.length > 32) {
        res.status(200).json({
            success: false,
            message: "Register Failed! Password not valid!",
            data: null
        });
        return;
    }
    const hashedPassword = hashThis(password);
    try {
        // Check for account with the same email
        const queryResult = await pool.query(
            "SELECT * FROM account WHERE email = $1 OR username = $2",
            [email, username]
        );
        // If found then fail
        // else then successfully register
        if (queryResult.rowCount != 0) {
            res.status(200).json({
                success: false,
                message: "Register Failed! Account already created with the same email or username!",
                data: null
            });
            return
        }
        else {
            const registerResult = await pool.query(
                "INSERT INTO account (email, username, password, firstName, surname, country, city, district, address, imageURL) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
                [email, username, hashedPassword, firstName, surname, country, city, district, address, imageURL]
            );
            res.status(201).json({
                success: true,
                message: "Register Success!",
                data: registerResult.rows[0].accountid
            });
            return
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

async function editAccount(req, res) {
    const { accountId, firstName, surname, country, city, district, address, imageURL } = req.body;
    try {
        // Check for account
        const queryResult = await pool.query(
            "SELECT * FROM account WHERE accountId = $1",
            [accountId]
        );
        // If found, edit the account data
        // else send nothing
        if (queryResult.rowCount != 0) {
            const editQuery = await pool.query(
                "UPDATE account SET firstName = $1, surname = $2, country = $3, city = $4, district = $5, address = $6, imageURL = $7 WHERE accountId = $8 RETURNING *",
                [firstName, surname, country, city, district, address, imageURL, accountId]
            );
            res.status(201).json({
                success: true,
                message: "Edit Success!",
                data: editQuery.rows[0]
            });
            return
        }
        else {
            res.status(200).json({
                success: false,
                message: "Edit Failed! Account not found!",
                data: null
            });
            return
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

async function editAccountCredentials(req, res) {
    const { accountId, email, username, newPassword, oldPassword } = req.body;
    const hashedOldPass = hashThis(oldPassword);
    const hashedNewPass = hashThis(newPassword);
    try {
        // find account
        const findQuery = await pool.query(
            "SELECT * FROM account WHERE accountId = $1",
            [accountId]
        );
        if (findQuery.rowCount != 0) {
            if (findQuery.rows[0].password === hashedOldPass) {
                const editQuery = await pool.query(
                    "UPDATE account SET email = $1, password = $2, username = $4, isverified = FALSE WHERE accountId = $3 RETURNING *",
                    [email, hashedNewPass, accountId, username]
                );
                res.status(201).json({
                    success: true,
                    message: "Edit Success!",
                    data: editQuery.rows[0]
                });
                return
            }
            else {
                res.status(200).json({
                    success: false,
                    message: "Edit Failed! Wrong Password!",
                    data: null
                });
                return
            }
        }
        else {
            res.status(200).json({
                success: false,
                message: "Edit Failed! Account not found!",
                data: null
            });
            return
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

async function deleteAccount(req, res) {
    const { accountId, password } = req.body;
    const hashedPass = hashThis(password);
    try {
        // find account
        const findQuery = await pool.query(
            "SELECT * FROM account WHERE accountId = $1",
            [accountId]
        );
        if (findQuery.rowCount != 0) {
            if (findQuery.rows[0].password === hashedPass) {
                const orderQuery = await pool.query(
                    "SELECT * FROM order WHERE ((buyerId = $1  OR sellerId = $1) AND (status = 'WAITING' OR status = 'ONGOING'))",
                    [accountId]
                );
                if (orderQuery.rowCount != 0) {
                    res.status(200).json({
                        success: false,
                        message: "Delete Failed! There is ongoing orders!",
                        data: null
                    });
                    return
                }
                else {
                    await pool.query(
                        "DELETE FROM item WHERE sellerId = $1"
                        [accountId]
                    );
                    await pool.query(
                        "DELETE FROM order WHERE sellerId = $1 OR buyerId = $1"
                        [accountId]
                    );
                    await pool.query(
                        "DELETE FROM account WHERE accountId = $1"
                        [accountId]
                    );
                    res.status(201).json({
                        success: true,
                        message: "Delete Success!",
                        data: null
                    });
                    return
                }
            }
            else {
                res.status(200).json({
                    success: false,
                    message: "Delete Failed! Wrong Password!",
                    data: null
                });
                return
            }
        }
        else {
            res.status(200).json({
                success: false,
                message: "Delete Failed! Account not found!",
                data: null
            });
            return
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

async function requestVerification(req, res) {
    const { accountId } = req.body;
    try {
        const findQuery = await pool.query(
            'SELECT * FROM account WHERE accountId = $1',
            [accountId]
        );
        const findDuplicate = await pool.query(
            'SELECT * FROM verification WHERE accountId = $1',
            [accountId]
        );
        if (findDuplicate.rowCount != 0) {
            res.status(200).json({
                success: false,
                message: "Verification Request Failed! Code already sent!",
                data: null
            });
            return
        }
        if (findQuery.rowCount != 0) {
            const createQuery = await pool.query(
                'INSERT INTO verification (accountId) VALUES ($1) RETURNING *',
                [accountId]
            );
            if (!mailer.verificationMailer(findQuery.rows[0].firstname, createQuery.rows[0].verificationcode, findQuery.rows[0].email)) {
                res.status(200).json({
                    success: false,
                    message: "Verification Request Failed! Failed to mail!",
                    data: null
                });
                return
            }
            res.status(200).json({
                success: true,
                message: "Verification Request Success!",
                data: null
            });
            return
        }
        else {
            res.status(200).json({
                success: false,
                message: "Verification Request Failed! Account not found!",
                data: null
            });
            return
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

async function verifyAccount(req, res) {
    const {accountId} = req.params;
    const {verificationCode} = req.body;
    try {
        const verificationQuery = await pool.query(
            "SELECT * FROM verification WHERE (accountId = $1) AND (verificationCode = $2)",
            [accountId, verificationCode]
        );
        if (verificationQuery.rowCount != 0) {
            await pool.query(
                "UPDATE account SET isVerified = TRUE WHERE accountId = $1",
                [accountId]
            );
            res.status(201).json({
                success: true,
                message: "Verification Success!",
                data: null
            });
        }
        else {
            res.status(201).json({
                success: false,
                message: "Verification Failed! Account not found or wrong code!",
                data: null
            });
        }
        await pool.query(
            "DELETE FROM verification WHERE accountId = $1",
            [accountId]
        );
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
    login,
    register,
    editAccount,
    editAccountCredentials,
    deleteAccount,
    requestVerification,
    verifyAccount,
    getAccountbyId,
    getAccountbyUsername
}