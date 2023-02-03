const Product = require('../models/productModel');
const User = require('../models/userModel');
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

//Delete Product
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

//Add product to userWishlist
const addToWishlist = asyncHandler(async (req, res) => {
    const { id } = req?.user;
    const { productId } = req.body;
    validMongooseId(id);
    validMongooseId(productId);
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product Not Found")
    try {

        const user = await User.findById(id);
        const wishlist = user?.wishlist;

        if (wishlist.includes(productId)) {
            const updateUser = await User.findByIdAndUpdate(id, {
                $pull: { wishlist: productId }
            }, { new: true });

            return res.status(200).json({
                data: updateUser,
                success: true,
                msg: "Removed  from  wishlist"

            })
        }
        const updateUser = await User.findByIdAndUpdate(id, {
            $push: { wishlist: productId }
        }, { new: true });

        return res.status(200).json({
            data: updateUser,
            success: true,
            msg: "Added to wishlist"

        })
    } catch (error) {
        throw new Error(error);
    }


});

//Rating
const addRating = asyncHandler(async (req, res) => {
    const { _id } = req?.user;
    const { star } = req?.body;
    const { productId } = req?.body;
    validMongooseId(_id);
    validMongooseId(productId);
    try {
        const product = await Product.findById(productId);
        if (!product) throw new Error("Product Not Found");
        let rating = product?.rating;
        let alreadyRated = rating.find(e => e?.postedby.toString() == _id.toString());
        if (rating.length < 1 || !alreadyRated) {
            const rateProduct = await Product.findByIdAndUpdate(productId, {
                $push: {
                    rating: {
                        star: star,
                        postedby: _id
                    }
                }
            }, { new: true });
            const totalRating = await Product.findById(productId);
            let totalStar = totalRating.rating.reduce((preview, current) => preview + current.star, 0);
            const updateTotalRating = await Product.findByIdAndUpdate(productId, {
                totalrating: Math.round(totalStar / totalRating.rating.length).toString(),
            }, { new: true });
            res.status(200).json({
                data: updateTotalRating,
                success: true,
                msg: "Rating added"

            })
        }
        const updateRating = await Product.updateOne(
            {
                rating: {
                    $elemMatch: alreadyRated
                },
            },
            {
                $set: { "rating.$.star": star }
            },
            { new: true });
        const totalRating = await Product.findById(productId);
        let totalStar = totalRating.rating.reduce((preview, current) => preview + current.star, 0);
        const updateTotalRating = await Product.findByIdAndUpdate(productId, {
            totalrating: Math.round(totalStar / totalRating.rating.length).toString(),
        }, { new: true });

        return res.status(200).json({
            data: updateTotalRating,
            success: true,
            msg: "Rating updated"

        });
    } catch (error) {
        throw new Error(error);
    }



});

module.exports = {
    createProduct,
    getProduct,
    allProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    addRating
}

