const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupon, updateCoupon, deleteCoupon, getOneCoupon } = require("../controllers/couponController")
const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');

router.route("/coupon").post(jwtAuthMiddleWare, isAdmin, createCoupon);
router.route("/coupon").get(jwtAuthMiddleWare, isAdmin, getAllCoupon);
router.route("/coupon/update/:id").put(jwtAuthMiddleWare, isAdmin, updateCoupon);
router.route("/coupon/delete/:id").delete(jwtAuthMiddleWare, isAdmin, deleteCoupon);
router.route("/coupons/:id").get(jwtAuthMiddleWare, isAdmin, getOneCoupon);




module.exports = router




