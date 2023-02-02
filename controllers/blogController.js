const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const validMongooseId = require("../utils/validateMongooseId");


//Create blog
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
//get a blog;

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id)
    try {
        const blog = await Blog.findById(id);
        if (!blog) throw new Error("Blog not found");
        const updateBlog = await Blog.findByIdAndUpdate(id, {
            $inc: { numviews: 1 }
        }, { new: true });
        return res.status(201).json({
            success: true,
            data: blog
        })
    } catch (error) {
        throw new Error(error)
    }

});
//get all blogs
const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const allBlog = await Blog.find();
        return res.status(200).json({
            data: allBlog,
            success: true
        });
    } catch (error) {
        return res.status(422).json({
            msg: error.message,
            success: false
        });
    }
});
//Update blog
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id)

    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(201).json({
            success: true,
            data: updateBlog
        })

    } catch (error) {
        throw new Error(error)
    }

});
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id)
    try {
        const blog = await Blog.findById(id);
        if (!blog) throw new Error("Blog not found")
        const delBlog = await Blog.findByIdAndDelete(id);
        return res.status(200).json({
            successL: true,
            data: delBlog
        })

    } catch (error) {
        throw new Error(error);
    }

});



module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlog,
    deleteBlog
};