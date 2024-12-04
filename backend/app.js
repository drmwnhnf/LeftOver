const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./src/tools/logger');
const loggingMiddleware = require('./src/middlewares/loggingMiddleware');
const { databaseConnectionTest } = require('./src/configs/dbconfig');

const accountRoute = require('./src/routes/accountRoute');
const itemRoute = require('./src/routes/itemRoute');

const app = express();
const PORT = 8000;

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(loggingMiddleware);

app.use('/account', accountRoute);
app.use('/item', itemRoute);

databaseConnectionTest();

app.listen(PORT, () => {
    logger.info("Server is running and listening on port 8000");
});