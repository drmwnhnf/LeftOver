const { Pool } = require('pg');
const logger = require('../tools/logger');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function databaseConnectionTest() {
    try {
        const client = await pool.connect();
        logger.info('Database can be connected');
        await client.end();
    } catch (error) {
        logger.error('Error connecting to database:', error);
    }
}

module.exports = {
    pool,
    databaseConnectionTest
};