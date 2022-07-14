const mongoose = require('mongoose');

const connectDB = () => {
    return mongoose.connect(process.env.DB_URI)
        .then(() => console.log('Connected to DB successfully!'))
        .catch(() => console.log('Connection to DB failed'));
}

module.exports = connectDB;