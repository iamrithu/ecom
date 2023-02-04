const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    expiry: {
        type: Date,
        required: true,
    },

    discound: {
        type: String,
        required: true,
    },
});

//Export the model
module.exports = mongoose.model('Coupon', couponSchema);