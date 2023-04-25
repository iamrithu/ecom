const Blog = require("../models/blogModel");
const asyncHandler = require('express-async-handler');
const cloudinaryUploadImage = require('../utils/cloudinary');
const validMongooseId = require("../utils/validateMongooseId");
const fs = require('fs');


//Create blog
const createBlog = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        return res.status(201).json({
            success: true,
            data: blog
        })
    } catch (error) {
        throw new Error(error)
    }
});
//get a blog;

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id)
    try {
        const blog = await Blog.findById(id).populate("likes").populate("dislikes");
        if (!blog) throw new Error("Blog not found");
        const updateBlog = await Blog.findByIdAndUpdate(id, {
            $inc: { numviews: 1 }
        }, { new: true });
        return res.status(201).json({
            success: true,
            data: blog
        })
    } catch (error) {
        throw new Error(error)
    }

});
//get all blogs
const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const allBlog = await Blog.find();
        return res.status(200).json({
            data: allBlog,
            success: true
        });
    } catch (error) {
        return res.status(422).json({
            msg: error.message,
            success: false
        });
    }
});
//Update blog
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id)

    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(201).json({
            success: true,
            data: updateBlog
        })

    } catch (error) {
        throw new Error(error)
    }

});
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id)
    try {
        const blog = await Blog.findById(id);
        if (!blog) throw new Error("Blog not found")
        const delBlog = await Blog.findByIdAndDelete(id);
        return res.status(200).json({
            successL: true,
            data: delBlog
        })

        for(var i=0;i<=2;i++){
            
        }

    } catch (error) {
        throw new Error(error);
    }

});

const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    const userId = req?.user?.id;
    const blog = await Blog.findById(blogId);
    const likes = blog?.likes;
    const dislikes = blog?.dislikes;

    if (likes.length === 0 && dislikes.length === 0) {
        const likeBlog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: userId },
            isliked: true,
            isdisliked: false,

        }, { new: true });
        return res.status(200).json({
            success: true,
            data: likeBlog
        })
    }
    if (dislikes.includes(userId)) {
        const likeBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: userId },
            $push: { likes: userId },
            isliked: true,
            isdisliked: false,
        }, { new: true });
        return res.status(200).json({
            success: true,
            data: likeBlog
        })
    }
    if (likes.includes(userId)) {
        const likeBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: userId },
            isliked: false,

        }, { new: true });
        return res.status(200).json({
            success: true,
            data: likeBlog
        })
    }
    const likeBlog = await Blog.findByIdAndUpdate(blogId, {
        $push: { likes: userId },
        isliked: true,
        isdisliked: false,

    }, { new: true });
    return res.status(200).json({
        success: true,
        data: likeBlog
    })
});
const disLikeBlog = asyncHandler(async (req, res) => {

    const { blogId } = req.body;
    const userId = req?.user?.id;
    const blog = await Blog.findById(blogId);
    const likes = blog?.likes;
    const dislikes = blog?.dislikes;
    if (likes.length === 0 && dislikes.length === 0) {
        const disLikeBlog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: userId },
            isdisliked: true,
            isliked: false
        }, { new: true });

        return res.status(200).json({
            success: true,
            data: disLikeBlog
        })
    }
    if (likes.includes(userId)) {
        console.log("first")
        const disLikeBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: userId },
            $push: { dislikes: userId },
            isdisliked: true,
            isliked: false

        }, { new: true });
        return res.status(200).json({
            success: true,
            data: disLikeBlog
        })
    }
    if (dislikes.includes(userId)) {
        const disLikeBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: userId },
            isdisliked: false,

        }, { new: true });
        return res.status(200).json({
            success: true,
            data: disLikeBlog
        })
    }

    const disLikeBlog = await Blog.findByIdAndUpdate(blogId, {
        $push: { dislikes: userId },
        isliked: false,
        isdisliked: true
    }, { new: true });
    return res.status(200).json({
        success: true,
        data: disLikeBlog
    })
});
const uploadImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const blog = await Blog.findById(id);
        if (!blog) throw new Error("blog not found");
        const uploader = (path) => cloudinaryUploadImage(path, "images");
        const url = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            url.push(newPath);
            fs.unlinkSync(path);


        }
        const blogImage = await Blog.findByIdAndUpdate(id, {
            images: url.map(file => file)
        }, { new: true });

        res.status(200).json({
            success: true,
            data: blogImage
        })
    } catch (error) {
        throw new Error(error);
    }
})




module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlog,
    deleteBlog,
    likeBlog,
    disLikeBlog, uploadImage
};