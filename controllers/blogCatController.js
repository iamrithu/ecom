const BlogCategory = require('../models/blogCatModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validMongooseId = require('../utils/validateMongooseId');

//create product BlogCategory

const createBlogCategory = asyncHandler(async (req, res) => {

    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const blogCategory = await BlogCategory.create(req.body);
        return res.status(201).json({
            success: true,
            data: blogCategory
        })

    } catch (error) {
        throw new Error(error)
    }

})
//get all BlogCategory

const getAllBlogCategory = asyncHandler(async (req, res) => {
    try {
        const getAllBlogCategory = await BlogCategory.find();
        return res.status(201).json({
            success: true,
            data: getAllBlogCategory
        })
    } catch (error) {
        throw new Error(error)
    }

})
//find one BlogCategory
const getBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const blogCategory = await BlogCategory.findById(id);
        if (!blogCategory) throw new Error("BlogCategory Not Found")
        const getBlogCategory = await BlogCategory.findById(id);
        return res.status(201).json({
            success: true,
            data: getBlogCategory
        })
    } catch (error) {
        throw new Error(error)
    }

})
//find one BlogCategory
const updateBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const blogCategory = await BlogCategory.findById(id);
        if (!blogCategory) throw new Error("BlogCategory Not Found")
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateBlogCategory = await BlogCategory.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(201).json({
            success: true,
            data: updateBlogCategory
        })
    } catch (error) {
        throw new Error(error)
    }

})
const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const blogCategory = await BlogCategory.findById(id);
        if (!blogCategory) throw new Error("BlogCategory Not Found")
        const deleteBlogCategory = await BlogCategory.findByIdAndDelete(id);
        return res.status(201).json({
            success: true,
            data: deleteBlogCategory
        })
    } catch (error) {
        throw new Error(error)
    }

})



module.exports = {
    createBlogCategory,
    getAllBlogCategory, getBlogCategory, deleteBlogCategory, updateBlogCategory
};