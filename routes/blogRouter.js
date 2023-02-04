const express = require('express');
const router = express.Router();
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, disLikeBlog, uploadImage
} = require('../controllers/blogController');
const { uploadPhoto, productImageResizer, blogImageResizer } = require('../middleware/uploadImgMiddleware');

const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');

router.route("/blog").post(jwtAuthMiddleWare, createBlog);
router.route("/blog/image/upload/:id").put(jwtAuthMiddleWare, isAdmin, uploadPhoto.array("images", 2), blogImageResizer, uploadImage);
router.route("/blog/update/:id").put(jwtAuthMiddleWare, updateBlog);

router.route("/blog/:id").get(jwtAuthMiddleWare, getBlog);
router.route("/blogs/all").get(jwtAuthMiddleWare, getAllBlog);
router.route("/blog/delete/:id").delete(jwtAuthMiddleWare, deleteBlog);
router.route("/blogs/like").post(jwtAuthMiddleWare, likeBlog);
router.route("/blogs/dislike").post(jwtAuthMiddleWare, disLikeBlog);










module.exports = router




