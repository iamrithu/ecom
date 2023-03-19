const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: {
        type: String,
        required: true,

    },
    size: {
        type: String,
        default: null
    },
    quantity: {
        type: Number,
        select: false,
        required: true
    },
    sold: {
        type: Number,
        select: false,
        default: 0
    },
    images: [],
    color: {
        type: String,
        required: true
    },
    rating: [
        {
            star: Number,
            comment: String,
            postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }
    ],
    totalrating: {
        type: String,
        default: 0
    }




}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Product', productSchema);