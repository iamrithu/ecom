const express = require('express');
const router = express.Router();
const { createProduct, getProduct, allProduct, updateProduct, deleteProduct, addToWishlist, addRating, uploadImage
} = require('../controllers/productController');
const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');
const { uploadPhoto, productImageResizer, blogImageResizer } = require('../middleware/uploadImgMiddleware');



router.route("/product").post(jwtAuthMiddleWare, createProduct);
router.route("/product/:id").get(jwtAuthMiddleWare, getProduct);
router.route("/products/all").get(allProduct);
router.route("/product/image/upload/:id").put(jwtAuthMiddleWare, isAdmin, uploadPhoto.array("images", 10), productImageResizer, uploadImage);

router.route("/product/update/:id").put(jwtAuthMiddleWare, isAdmin, updateProduct);
router.route("/product/delete/:id").delete(jwtAuthMiddleWare, isAdmin, deleteProduct);
router.route("/product/rating").put(jwtAuthMiddleWare, addRating);



module.exports = router




