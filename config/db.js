
const mongoose = require('mongoose')

const connectDB = async () => {
    return mongoose
        .connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST_DB}`)
        .then(()=> console.log(`✔ Database Connection Established`))
        .catch((err) => console.log(err));

};

module.exports = connectDB;
