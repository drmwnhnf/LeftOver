const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./src/tools/logger');
const loggingMiddleware = require('./src/middlewares/loggingMiddleware');
const { databaseConnectionTest } = require('./src/configs/dbconfig');
const cors = require("cors");

const accountRoute = require('./src/routes/accountRoute');
const itemRoute = require('./src/routes/itemRoute');
const orderRoute = require('./src/routes/orderRoute');
const reviewRoute = require('./src/routes/reviewRoute');
const chatRoute = require('./src/routes/chatRoute');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(loggingMiddleware);

app.use('/account', accountRoute);
app.use('/item', itemRoute);
app.use('/order', orderRoute);
app.use('/review', reviewRoute);
app.use('/chat', chatRoute);

app.get('/', (req, res) => {
    return res.status(200).send("Backend Working!");
});

databaseConnectionTest();

app.listen(8000, () => {
    logger.info("Server is running and listening on port 8000")
});