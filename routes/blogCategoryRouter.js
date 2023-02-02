const express = require('express');
const router = express.Router();
const { createBlogCategory, deleteBlogCategory, updateBlogCategory, getAllBlogCategory, getBlogCategory
} = require('../controllers/blogCatController');
const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');

router.route("/blogcategory").post(jwtAuthMiddleWare, isAdmin, createBlogCategory);
router.route("/blogcategory").get(jwtAuthMiddleWare, getAllBlogCategory);
router.route("/blogcategory/:id").get(jwtAuthMiddleWare, getBlogCategory);
router.route("/blogcategory/update/:id").put(jwtAuthMiddleWare, isAdmin, updateBlogCategory);
router.route("/blogcategory/delete/:id").delete(jwtAuthMiddleWare, isAdmin, deleteBlogCategory);












module.exports = router




