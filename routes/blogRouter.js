const express = require('express');
const router = express.Router();
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog
} = require('../controllers/blogController');
const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');

router.route("/blog").post(jwtAuthMiddleWare, createBlog);
router.route("/blog/update/:id").put(jwtAuthMiddleWare, updateBlog);
router.route("/blog/:id").get(jwtAuthMiddleWare, getBlog);
router.route("/blogs/all").get(jwtAuthMiddleWare, getAllBlog);
router.route("/blog/delete/:id").delete(jwtAuthMiddleWare, deleteBlog);








module.exports = router




