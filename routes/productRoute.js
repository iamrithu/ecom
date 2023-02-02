const express = require('express');
const router = express.Router();
const { createProduct, getProduct, allProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');



router.route("/product").post(jwtAuthMiddleWare, createProduct);
router.route("/product/:id").get(jwtAuthMiddleWare, getProduct);
router.route("/products/all").get(allProduct);
router.route("/product/update/:id").put(jwtAuthMiddleWare, isAdmin, updateProduct);
router.route("/product/delete/:id").delete(jwtAuthMiddleWare, isAdmin, deleteProduct);

module.exports = router




