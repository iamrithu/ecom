const express = require('express');
const router = express.Router();
const {
    createBrand,
    deleteBrand,
    updateBrand,
    getAllBrand,
    getBrand
} = require('../controllers/branController');
const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');
const { uploadPhoto, productImageResizer, blogImageResizer } = require('../middleware/uploadImgMiddleware');


router.route("/brand").post(jwtAuthMiddleWare, isAdmin, uploadPhoto.single("image"), createBrand);
router.route("/brand").get(jwtAuthMiddleWare, getAllBrand);
router.route("/brand/:id").get(jwtAuthMiddleWare, getBrand);
router.route("/brand/update/:id").put(jwtAuthMiddleWare, isAdmin, uploadPhoto.single("image"), updateBrand);
router.route("/brand/delete/:id").delete(jwtAuthMiddleWare, isAdmin, deleteBrand);












module.exports = router




