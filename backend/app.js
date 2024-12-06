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

app.use(cors({
    origin:'https://frontend-seven-pi-48.vercel.app/',
    methods: ['GET','POST','PUT','DELETE'],
    credentials: false
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(loggingMiddleware);

app.get('/', console.log('API Working'));
app.use('/account', accountRoute);
app.use('/item', itemRoute);
app.use('/order', orderRoute);
app.use('/review', reviewRoute);
app.use('/chat', chatRoute);

databaseConnectionTest();

app.listen(8000, () => {
    logger.info("Server is running and listening on port 8000")
});

export default app;