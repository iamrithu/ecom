const express = require('express');
const router = express.Router();
const { createUser, loginUser, getAllUsers, getIntidualUser, deleteUser, updateUser, userBlock, userUnBlock, handleRefreshToken, logout, updatePassword, getIntidualUserforAdmin, loginAdmin, addToWishlist } = require('../controllers/userController');
const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');


//USER
router.route("/user/register").post(createUser);
router.route("/user/login").post(loginUser);
router.route("/admin/login").post(loginAdmin);

router.route("/user/refresh").get(handleRefreshToken);
router.route("/user/wishlist").put(jwtAuthMiddleWare, addToWishlist);

router.route("/user/logout").get(logout);
router.route("/user/all").get(jwtAuthMiddleWare, isAdmin, getAllUsers);
router.route("/user").get(jwtAuthMiddleWare, getIntidualUser);
router.route("/users/:id").get(jwtAuthMiddleWare, isAdmin, getIntidualUserforAdmin);
router.route("/user/update").put(jwtAuthMiddleWare, updateUser);
router.route("/user/delete").delete(jwtAuthMiddleWare, deleteUser);
router.route("/reset").put(jwtAuthMiddleWare, updatePassword);
router.route("/user/block/:uid").put(jwtAuthMiddleWare, isAdmin, userBlock);
router.route("/user/unblock/:uid").put(jwtAuthMiddleWare, isAdmin, userUnBlock);

module.exports = router;