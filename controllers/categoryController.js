const Category = require('../models/categoryModel');
const asyncHandler = require('express-async-handler');
const validMongooseId = require('../utils/validateMongooseId');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const slugify = require('slugify');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto=require('crypto') 


//create product category

const bucket_name = process.env.AWSS3_NAME;
const bucket_region = process.env.AWSS3_REGION;
const bucket_access_key = process.env.AWSACCESSKEY;
const bucket_secret_access_key = process.env.AWSACCESSECRETSKEY;
const RandomImage = (byte) => crypto.randomUUID(byte).toString('hax');



const s3 = new S3Client({
    credentials: {
        accessKeyId: bucket_access_key,
        secretAccessKey: bucket_secret_access_key

    },
    region: bucket_region
})

const createCategory = asyncHandler(async (req, res) => {
    const code =RandomImage();

    // if (req.file) {
    //     const params = {
    //         Bucket: bucket_name,
    //         Key: code,
    //         Body: req.file.buffer,
    //         ContentType: req.file.mimetype
    //     }
    //     const command = new PutObjectCommand(params);
    //     const data = await s3.send(command);

    // }
        return res.status(201).json({
            success: true,
            // buffer:req.file.buffer,
            // contentType:req.file.mimetype,
            file:req.body.image,
            data: req.body
        })
    // try {
    //     if (req.body.title) {
    //         req.body.slug = slugify(req.body.title);
    //     }
    //     req.body.url = code;
    //     const category = await Category.create(req.body);
    //     return res.status(201).json({
    //         success: true,
    //         data: category
    //     })

    // } catch (error) {
    //     throw new Error(error)
    // }

})
//get all category

const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const getAllcategory = await Category.find();

        for (var category of getAllcategory) {

            console.log(category.url)
            if (category.url && category.url !== "") {
                const getObjectParams = {
                    Bucket: bucket_name,
                    Key: category.url
                }
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, { expiresIn: 360000 });
                category.url = url;
            }

        }
        return res.status(201).json({
            success: true,
            data: getAllcategory
        })
    } catch (error) {
        throw new Error(error)
    }

})
//find one category
const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const category = await Category.findById(id);
        if (!category) throw new Error("Category Not Found")
        const getCategory = await Category.findById(id);
        if (getCategory.url !== "") {
            const getObjectParams = {
                Bucket: bucket_name,
                Key: getCategory.url
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 360000 });
            getCategory.url = url;
        }
        return res.status(201).json({
            success: true,
            data: getCategory
        })
    } catch (error) {
        throw new Error(error)
    }

})
//find one category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const category = await Category.findById(id);
        if (!category) throw new Error("Category Not Found")
        console.log(req.file);
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        if (req.file) {
            if (req.file) {
                code = RandomImage()
                const params = {
                    Bucket: bucket_name,
                    Key: code,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype
                }
                const command = new PutObjectCommand(params);
                const data = await s3.send(command);
                req.body.url = code;
            }
        }

        const updateCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(201).json({
            success: true,
            data: updateCategory
        })
    } catch (error) {
        throw new Error(error)
    }

})
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const category = await Category.findById(id);
        if (!category) throw new Error("Category Not Found")

        console.log(category);
        const deleteCategory = await Category.findByIdAndDelete(id);
        return res.status(201).json({
            success: true,
            data: deleteCategory
        })
    } catch (error) {
        throw new Error(error)
    }

})



module.exports = {
    createCategory,
    getAllCategory, getCategory, deleteCategory, updateCategory
};