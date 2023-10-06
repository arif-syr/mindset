const mongoose = require('mongoose');
const { mongodb } = require('./credentials.js');

function connectDB(connect = true) {
    if (connect) {
        mongoose.connect(mongodb.connectionString, { useNewUrlParser: true, useUnifiedTopology: true,  serverSelectionTimeoutMS: 50000})
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => console.error('Failed to connect to MongoDB', error));
    } else {
        mongoose.disconnect()
        .then(() => console.log('Disconnected from MongoDB'));
    }
}

module.exports = connectDB;