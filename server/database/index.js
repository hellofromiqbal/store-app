const mongoose = require('mongoose');
const { dbHost, dbPort, dbName } = require('../app/config');

const PORT = 3000;

const connectMongoDB = (app) => {
  mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}?authSource=admin`)
    .then(() => {
      console.log('Connected to MongoDB.');
      app.listen(PORT, () => {
        console.log(`App is listening in port http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = connectMongoDB;