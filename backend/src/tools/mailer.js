const nodemailer = require('nodemailer');
const logger = require('./logger');
const { log } = require('winston');

// Membuat transporter dengan konfigurasi SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // Bisa menggunakan Gmail atau penyedia SMTP lain
    auth: {
        user: process.env.EMAIL_USER, // Ganti dengan email Anda
        pass: process.env.EMAIL_PASS,  // Ganti dengan password atau app-specific password
    },
});

function verificationMailer(accountName, verificationCode, accountEmail) {
    // Template email dalam format HTML
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Verification - LeftOver</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f8f9fa;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #e6e6e6;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #28a745;
                color: #ffffff;
                text-align: center;
                padding: 20px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .body {
                padding: 20px;
            }
            .body p {
                margin: 0 0 15px;
                font-size: 16px;
                line-height: 1.5;
            }
            .verification-code {
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                background-color: #e6f4ea;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                color: #28a745;
            }
            .footer {
                text-align: center;
                font-size: 14px;
                color: #888;
                padding: 10px 20px;
                background-color: #f8f9fa;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <h1>Welcome to LeftOver!</h1>
            </div>
            <!-- Body -->
            <div class="body">
                <p>Hello, <strong>${accountName}</strong>!</p>
                <p>Thank you for creating an account with LeftOver. Please verify your account using the following code:</p>
                <div class="verification-code">
                    ${verificationCode}
                </div>
                <p>If you did not create an account with LeftOver, please ignore this email.</p>
                <p>Best regards,<br>The LeftOver Team</p>
            </div>
            <!-- Footer -->
            <div class="footer">
                <p>&copy; 2024 LeftOver. All Rights Reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Template email dalam format teks biasa
    const textContent = `
    -----------------------------------------------------------
        Account Verification - LeftOver
    -----------------------------------------------------------

    Hello, ${accountName}!

    Thank you for creating an account with LeftOver. To proceed, please verify your account with the following code:

    Verification Code: ${verificationCode}

    If you did not create an account with LeftOver, please ignore this email.

    Best regards,
    The LeftOver Team
    -----------------------------------------------------------
        &copy; 2024 LeftOver. All Rights Reserved.
    -----------------------------------------------------------
    `;

    // Mengirim email
    const mailOptions = {
        from: 'system.leftover@gmail.com', // Pengirim
        to: accountEmail, // Penerima
        subject: 'Account Verification for LeftOver', // Subjek email
        text: textContent, // Format teks biasa
        html: htmlContent, // Format HTML
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error(error);
                return reject(false); // Resolusi untuk kasus gagal
            }
            logger.info(info);
            resolve(true); // Resolusi untuk kasus sukses
        });
    });
}

module.exports = {
    verificationMailer
};