const express = require('express');
const router = express.Router();
const { createCategory, deleteCategory, updateCategory, getAllCategory, getCategory
} = require('../controllers/categoryController');
const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');

router.route("/category").post(jwtAuthMiddleWare, isAdmin, createCategory);
router.route("/category").get(jwtAuthMiddleWare, getAllCategory);
router.route("/category/:id").get(jwtAuthMiddleWare, getCategory);
router.route("/category/update/:id").put(jwtAuthMiddleWare, isAdmin, updateCategory);
router.route("/category/delete/:id").delete(jwtAuthMiddleWare, isAdmin, deleteCategory);
module.exports = router




