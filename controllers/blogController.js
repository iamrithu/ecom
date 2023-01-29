const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require('express-async-handler');

const createBlog = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        return res.status(201).json({
            success: true,
            data: blog
        })
    } catch (error) {
        throw new Error(error)
    }
});

module.exports = {
    createBlog
};