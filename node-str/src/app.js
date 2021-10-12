'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

mongoose.connect('mongodb://localhost:27017/Node?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false');

const Product = require('./models/product');
const Custumer = require('./models/customer');
const Order = require('./models/order');

const indexRoute = require('./routes/indexRoute');
const productRoute = require('./routes/productRoute');
const customerRoute = require('./routes/customerRoute');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRoute);
app.use('/products', productRoute);
app.use('/customers', customerRoute);

module.exports = app;