const mongoose = require("mongoose");


mongoose.set('strictQuery', false);
const dbCoonect = () => {

    const conn = mongoose.connect(process.env.DB)
    console.log(`MongoDb Connected`);

}

module.exports = dbCoonect;
