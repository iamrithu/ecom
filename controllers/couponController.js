const Coupon = require("../models/couponModel");
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validMongooseId = require('../utils/validateMongooseId');

//create coupon;

const createCoupon = asyncHandler(async (req, res) => {
    try {

        const coupon = await Coupon.create(req.body);
        return res.status(201).json({
            data: coupon,
            success: true,
            msg: "Coupon created successfully"
        });
    } catch (error) {
        throw new Error(error);
    }
});

//get all coupon

const getAllCoupon = asyncHandler(async (req, res) => {
    try {
        const getAllCoupon = await Coupon.find();
        return res.status(200).json({
            successs: true,
            data: getAllCoupon,

        })
    } catch (error) {
        throw new Error(error);
    }
});
//get coupon by id
const getOneCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const getCoupon = await Coupon.findById(id);
        if (!getCoupon) throw new Error("Coupon not found");
        res.status(200).json({
            succes: true,
            data: getCoupon,

        })
    } catch (error) {
        throw new Error(error)
    }
})
//update coupon
const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const coupon = await Coupon.findById(id);
        if (!coupon) throw new Error("Coupon not found")
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json({
            success: true,
            data: updateCoupon,
            msg: "Coupon updated successfully"

        })
    } catch (error) {
        throw new Error(error);
    }

});
//delete coupon
const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const coupon = await Coupon.findById(id);
        if (!coupon) throw new Error("Coupon not found")
        const deleteCoupon = await Coupon.findOneAndDelete(id);
        res.status(200).json({
            succes: true,
            data: deleteCoupon,
            msg: "Coupon deleted successfully"

        })
    } catch (error) {
        throw new Error(error);
    }

});


module.exports = {
    createCoupon, getAllCoupon, updateCoupon, deleteCoupon, getOneCoupon
};