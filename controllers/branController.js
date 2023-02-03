const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validMongooseId = require('../utils/validateMongooseId');

//create product brand

const createBrand = asyncHandler(async (req, res) => {

    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const brand = await Brand.create(req.body);
        return res.status(201).json({
            success: true,
            data: brand
        })

    } catch (error) {
        throw new Error(error)
    }

})
//get all brand

const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const getAllbrand = await Brand.find();
        return res.status(201).json({
            success: true,
            data: getAllbrand
        })
    } catch (error) {
        throw new Error(error)
    }

})
//find one brand
const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const brand = await Brand.findById(id);
        if (!brand) throw new Error("brand Not Found")
        const getbrand = await Brand.findById(id);
        return res.status(201).json({
            success: true,
            data: getbrand
        })
    } catch (error) {
        throw new Error(error)
    }

})
//find one brand
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const brand = await Brand.findById(id);
        if (!brand) throw new Error("brand Not Found")
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatebrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(201).json({
            success: true,
            data: updatebrand
        })
    } catch (error) {
        throw new Error(error)
    }

})
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const brand = await Brand.findById(id);
        if (!brand) throw new Error("brand Not Found")
        const deletebrand = await Brand.findByIdAndDelete(id);
        return res.status(201).json({
            success: true,
            data: deletebrand
        })
    } catch (error) {
        throw new Error(error)
    }

})



module.exports = {
    createBrand,
    getAllBrand, getBrand, deleteBrand, updateBrand
};