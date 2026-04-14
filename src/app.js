const express = require('express');

const orderRoutes = require('./routes/order.js');
const promoRoutes = require('./routes/promo.js');

const app = express();

app.use(express.json());

app.use('/orders', orderRoutes.router);
app.use('/promo', promoRoutes.router);

module.exports = app;