
const User = require("../models/userModel");
const bcrypt = require('bcrypt')// Erase if already required
const asyncHandler = require("express-async-handler");
const validMongooseId = require("../utils/validateMongooseId");
const { generateToken } = require("../config/jwtToken");
const { refreshJwtToken } = require("../config/refreshToken");
const jwt = require('jsonwebtoken');
const { json } = require("body-parser");



//CREAT USER
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email });
    if (!findUser) {
        try {
            const newUser = await User.create(req.body);
            return res.status(201).json({
                data: newUser,
                success: true,
                msg: "User created successfully"
            });
        } catch (error) {
            return res.status(422).json({
                msg: error.message,
                success: false
            });
        }
    }
    throw new Error("User Already Exist");
});
//LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) throw new Error("Invalid email");
    const decryptPassword = await findUser.isPasswordMatched(password);

    const refreshtoken = refreshJwtToken({ _id: findUser?._id, email: findUser?.email });
    const updateUser = await User.findByIdAndUpdate(findUser._id, {
        refreshToken: refreshtoken,
    }, {
        new: true
    });

    res.cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
    })
    if (findUser && decryptPassword) {
        return res.status(200).json({
            message: "Logged in successfully",
            data: { ...findUser._doc, "token": generateToken({ _id: findUser?._id, email: findUser?.email }) },
            success: true
        });
    }
    throw new Error("Invalid Credencial");
});
//GET ALL USERS
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const allUsers = await User.find();
        return res.status(200).json({
            data: allUsers,
            success: true
        });
    } catch (error) {
        return res.status(422).json({
            msg: error.message,
            success: false
        });
    }
});

//SINGLE USER
const getIntidualUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const findUser = await User.findById(_id);
        if (findUser == null) return res.status(404).json({
            msg: "User Not Found",
            success: false
        });

        res.status(200).json({
            message: "User Available",
            data: findUser,
            success: true
        });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
//UPDATE USER
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validMongooseId(_id);
    const salt = await bcrypt.genSaltSync(10);
    if (req.body["password"] != undefined) {
        req.body["password"] = await bcrypt.hash(req.body["password"], salt);
    }
    const updatedUser = await User.findByIdAndUpdate(_id, { $set: req.body }, { new: true });
    res.status(200).json({
        message: "User Updated Successfully",
        data: updatedUser,
        success: true,
        new: true
    });

});
//DELETE USER
const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validMongooseId(_id);
    try {

        const removeUser = await User.findByIdAndDelete(_id);
        res.status(200).json({
            message: "User Removed Successfully",
            data: removeUser,
            success: true
        });
    } catch (error) {
        throw new Error(error);
    }
});
//Block User  admin only
const userBlock = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    validMongooseId(uid);
    try {
        const block = await User.findByIdAndUpdate(uid, {
            isblocked: true
        }, { new: true })
        res.status(200).json({
            message: "User blocked"
        });
    } catch (error) {
        throw new Error(error);
    }

})
//Unblock User  admin only

const userUnBlock = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    validMongooseId(uid);

    try {
        const block = await User.findByIdAndUpdate(uid, {
            isblocked: false
        }, { new: true })
        res.status(200).json({
            message: "User unblocked"
        });
    } catch (error) {
        throw new Error(error);
    }
});
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validMongooseId(_id);

    console.log(_id, password)
    try {
        const user = await User.findById(_id);
        if (password) {
            user.password = password;
            const updatedPassword = await user.save();
            res.status(200).json(updatedPassword);
        } else {
            res.status(200).json(user);
        }

    } catch (error) {
        throw new Error(error);
    }
})

//Handle refreshtoken

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No refresh token present in db or not match");
    jwt.verify(refreshToken, process.env.JWT, (err, decoded) => {
        if (err || user.email !== decoded.email || user.id !== decoded._id) throw new Error("There is something wrong with refresh token");
        const accessToken = refreshJwtToken({ _id: user?._id, email: user?.email });
        res.json({ accessToken });

    });

});

//Logout

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true

        });
        return res.status(204).json({
            msg: "login  first",

            success: true
        });
    };
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    return res.status(204).json({
        msg: "logged out successfully",
        success: true
    });
})
module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getIntidualUser,
    deleteUser,
    updateUser,
    userBlock,
    userUnBlock,
    handleRefreshToken,
    updatePassword,
    logout
};