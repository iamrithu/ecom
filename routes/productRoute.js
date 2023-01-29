const express = require('express');
const router = express.Router();
const { createProduct, getProduct, allProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');



router.route("/new").post(jwtAuthMiddleWare, isAdmin, createProduct);
router.route("/:id").get(getProduct);
router.route("/").get(allProduct);
router.route("/update/:id").put(jwtAuthMiddleWare, isAdmin, updateProduct);
router.route("/delete/:id").delete(jwtAuthMiddleWare, isAdmin, deleteProduct);

module.exports = router




