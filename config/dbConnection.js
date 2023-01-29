const mongoose = require("mongoose");


mongoose.set('strictQuery', false);
const dbCoonect = () => {
    try {
        const conn = mongoose.connect(process.env.DB)
        console.log(`MongoDb Connected`);
    } catch (error) {
        console.log(`Datebase not connected ${error.message}`)

    }
}

module.exports = dbCoonect;