const express = require('express');
const router = express.Router();
const { createProduct, getProduct, allProduct, updateProduct, deleteProduct, addToWishlist, addRating
} = require('../controllers/productController');
const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');



router.route("/product").post(jwtAuthMiddleWare, createProduct);
router.route("/product/:id").get(jwtAuthMiddleWare, getProduct);
router.route("/products/all").get(allProduct);
router.route("/product/update/:id").put(jwtAuthMiddleWare, isAdmin, updateProduct);
router.route("/product/delete/:id").delete(jwtAuthMiddleWare, isAdmin, deleteProduct);
router.route("/product/wishlist").put(jwtAuthMiddleWare, addToWishlist);
router.route("/product/rating").put(jwtAuthMiddleWare, addRating);



module.exports = router




