const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const validMongooseId = require('../utils/validateMongooseId');
const slugify = require('slugify');

//Create a product
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const product = await Product.create(req.body);
        return res.status(201).json({
            data: product,
            success: true,
            msg: "Product created successfully"
        });
    } catch (error) {
        throw new Error(error);
    }
});
//Get a single product
const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const product = await Product.findById(id);
        if (!product) throw new Error("User Not Found")
        const getproduct = await Product.findById(id);
        return res.status(201).json({
            data: getproduct,
            success: true,
        });
    } catch (error) {
        throw new Error(error);
    }

});

//Get all products
const allProduct = asyncHandler(async (req, res) => {

    try {
        //Filter
        const queryObj = { ...req.query };
        const excludedfields = ["page", "sort", "limit", "fields"];
        excludedfields.forEach((e) => delete queryObj[e]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));

        //Sorting
        if (req.query.sort) {
            var querySort = req.query.sort.split(",").join(" ");
            query = query.sort(querySort);
        } else {
            query = query.sort("-createdAt");

        }

        //Fields
        if (req.query.fields) {
            var querySort = req.query.fields.split(",").join(" ");
            query = query.select(querySort);
        } else {
            query = query.select("-__v");

        }
        //Pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This page does not exist")
        }

        const products = await query;
        return res.status(200).json({
            data: products,
            success: true,
        })
    } catch (error) {
        throw new Error(error)
    }
})
//Update product

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const product = await Product.findById(id);
        if (!product) throw new Error("User Not Found")
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json({
            data: updatedProduct,
            success: true,
            msg: "Product updated successfully"

        })
    } catch (error) {
        throw new Error(error);
    }
});
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const product = await Product.findById(id);
        if (!product) throw new Error("User Not Found")
        const deletedProduct = await Product.findByIdAndDelete(id);
        return res.status(200).json({
            data: deletedProduct,
            success: true,
            msg: "Product deleted successfully"

        })
    } catch (error) {
        throw new Error(error);

    }
})

module.exports = {
    createProduct,
    getProduct,
    allProduct,
    updateProduct,
    deleteProduct
}

