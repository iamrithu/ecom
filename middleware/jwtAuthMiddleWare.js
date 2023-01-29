const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');

const jwtAuthMiddleWare = asyncHandler(async (req, res, next) => {


    if (!req?.headers?.authorization.startsWith("Bearer")) return new Error("There is not token added")
    const token = req?.headers?.authorization.split(" ")[1];

    try {
        if (token) {
            const userDecode = jwt.verify(token, process.env.JWT);
            const user = await User.findById(userDecode?._id);
            if (user == null) return res.status(404).json({
                msg: "User Not Found",
                success: false
            });
            req.user = user;
            next();
        }
    } catch (error) {
        throw new Error("Not authorized, Token expired, Please login again ")
    }


})
const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    try {
        const adminUser = await User.findOne({ email });
        if (adminUser.role == "user") throw new Error("You are not admin");
        next();

    } catch (error) {
        throw new Error(error)

    }
})

module.exports = { jwtAuthMiddleWare, isAdmin };