const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./src/tools/logger');
const loggingMiddleware = require('./src/middlewares/loggingMiddleware');
const { databaseConnectionTest } = require('./src/configs/dbconfig');

const accountRoute = require('./src/routes/accountRoute');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(loggingMiddleware);

app.use('/account', accountRoute);

databaseConnectionTest();

app.listen(3000, () => {
    logger.info("Server is running and listening on port 3000")
});