const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numviews: {
        type: Number,
        default: 0
    },
    isliked: {
        type: Boolean,
        default: false
    },
    isdisliked: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    image: {
        type: String,
        default: "https://www.appliedart.com/assets/images/blog/blogging-SMB.png"
    },
    author: {
        type: String,
        default: "Admin"
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);