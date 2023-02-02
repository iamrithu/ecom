const Category = require('../models/categoryModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validMongooseId = require('../utils/validateMongooseId');

//create product category

const createCategory = asyncHandler(async (req, res) => {

    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const category = await Category.create(req.body);
        return res.status(201).json({
            success: true,
            data: category
        })

    } catch (error) {
        throw new Error(error)
    }

})
//get all category

const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const getAllcategory = await Category.find();
        return res.status(201).json({
            success: true,
            data: getAllcategory
        })
    } catch (error) {
        throw new Error(error)
    }

})
//find one category
const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const category = await Category.findById(id);
        if (!category) throw new Error("Category Not Found")
        const getCategory = await Category.findById(id);
        return res.status(201).json({
            success: true,
            data: getCategory
        })
    } catch (error) {
        throw new Error(error)
    }

})
//find one category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const category = await Category.findById(id);
        if (!category) throw new Error("Category Not Found")
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(201).json({
            success: true,
            data: updateCategory
        })
    } catch (error) {
        throw new Error(error)
    }

})
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const category = await Category.findById(id);
        if (!category) throw new Error("Category Not Found")
        const deleteCategory = await Category.findByIdAndDelete(id);
        return res.status(201).json({
            success: true,
            data: deleteCategory
        })
    } catch (error) {
        throw new Error(error)
    }

})



module.exports = {
    createCategory,
    getAllCategory, getCategory, deleteCategory, updateCategory
};