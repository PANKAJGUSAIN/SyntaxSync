const mongoose = require('mongoose');

async function connectdb() {
    await mongoose.connect(process.env.DATABASE_STRING);
}

module.exports = {
    connectdb
}