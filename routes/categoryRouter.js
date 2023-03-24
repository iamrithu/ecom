const express = require('express');
const router = express.Router();
const multer = require("multer");
const { createCategory, deleteCategory, updateCategory, getAllCategory, getCategory
} = require('../controllers/categoryController');
const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');
const { uploadPhoto, productImageResizer, blogImageResizer } = require('../middleware/uploadImgMiddleware');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/category").post(jwtAuthMiddleWare, isAdmin, uploadPhoto.single("image"), createCategory);
router.route("/category").get(jwtAuthMiddleWare, getAllCategory);
router.route("/category/:id").get(jwtAuthMiddleWare, getCategory);
router.route("/category/update/:id").put(jwtAuthMiddleWare, isAdmin, uploadPhoto.single("image"), updateCategory);
router.route("/category/delete/:id").delete(jwtAuthMiddleWare, isAdmin, deleteCategory);
module.exports = router




