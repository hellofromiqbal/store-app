const express = require('express');
const cors = require('cors');
const connectMongoDB = require('./database');

const authRouter = require('./app/auth/router');
const categoryRouter = require('./app/category/router');

const app = express();

app.use(express.json());
app.use(cors());

connectMongoDB(app);

app.use('/auth', authRouter);
app.use('/api', categoryRouter);

app.get('/', (req, res) => {
  return res.send('App is listening...');
});
