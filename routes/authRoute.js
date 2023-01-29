const express = require('express');
const router = express.Router();
const { createUser, loginUser, getAllUsers, getIntidualUser, deleteUser, updateUser, userBlock, userUnBlock, handleRefreshToken, logout, updatePassword } = require('../controllers/userController');
const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');

//USER
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/refresh").get(handleRefreshToken);
router.route("/logout").get(logout);
router.route("/users").get(jwtAuthMiddleWare, isAdmin, getAllUsers);
router.route("/user").get(jwtAuthMiddleWare, getIntidualUser);
router.route("/user/update").put(jwtAuthMiddleWare, updateUser);
router.route("/user/delete").delete(jwtAuthMiddleWare, deleteUser);
router.route("/reset").put(jwtAuthMiddleWare, updatePassword);

router.route("/user/block/:uid").post(jwtAuthMiddleWare, isAdmin, userBlock);
router.route("/user/unblock/:uid").post(jwtAuthMiddleWare, isAdmin, userUnBlock);





module.exports = router;