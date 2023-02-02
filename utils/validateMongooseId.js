const mongoose = require("mongoose");

const validMongooseId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error("Invalid Id")
}

module.exports = validMongooseId;