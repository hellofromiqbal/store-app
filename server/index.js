const express = require('express');
const cors = require('cors');
const connectMongoDB = require('./database');
const { decodeToken } = require('./middlewares');

const authRouter = require('./app/auth/router');
const productRouter = require('./app/product/router');
const categoryRouter = require('./app/category/router');
const tagRouter = require('./app/tag/router');
const deliveryAddressRouter = require('./app/deliveryAddress/router');
const cartRouter = require('./app/cart/router');

const app = express();

app.use(cors());
app.use(express.json());
app.use(decodeToken());

connectMongoDB(app);

app.use('/auth', authRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', tagRouter);
app.use('/api', deliveryAddressRouter);
app.use('/api', cartRouter);

app.get('/', (req, res) => {
  return res.send('App is listening...');
});
