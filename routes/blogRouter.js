const express = require('express');
const router = express.Router();
const { createBlog
} = require('../controllers/blogController');
const { jwtAuthMiddleWare, isAdmin } = require('../middleware/jwtAuthMiddleWare');

router.route("/new").post(jwtAuthMiddleWare, createBlog);




module.exports = router




