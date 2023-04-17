const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validMongooseId = require('../utils/validateMongooseId');
const crypto=require('crypto');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


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

//create product brand

const createBrand = asyncHandler(async (req, res) => {
    var code = RandomImage();

    if (req.file) {
        const params = {
            Bucket: bucket_name,
            Key: code,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }
        const command = new PutObjectCommand(params);
        const data = await s3.send(command);

    }

    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        req.body.url = code;
        const brand = await Brand.create(req.body);
        return res.status(201).json({
            success: true,
            data: brand
        })

    } catch (error) {
        throw new Error(error)
    }

})
//get all brand

const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const getAllbrand = await Brand.find();
        for (var brand of getAllbrand) {

            if (brand.url && brand.url !== "") {
                const getObjectParams = {
                    Bucket: bucket_name,
                    Key: brand.url
                }
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, { expiresIn: 360000 });
                brand.url = url;
            }

        }
        return res.status(201).json({
            success: true,
            data: getAllbrand
        })
    } catch (error) {
        throw new Error(error)
    }

})
//find one brand
const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const brand = await Brand.findById(id);
        if (!brand) throw new Error("brand Not Found")
        const getbrand = await Brand.findById(id);

        if (getbrand.url !== "") {
            const getObjectParams = {
                Bucket: bucket_name,
                Key: getbrand.url
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 360000 });
            getbrand.url = url;
        }
        return res.status(201).json({
            success: true,
            data: getbrand
        })
    } catch (error) {
        throw new Error(error)
    }

})
//find one brand
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const brand = await Brand.findById(id);
        if (!brand) throw new Error("brand Not Found")
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
        const updatebrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(201).json({
            success: true,
            data: updatebrand
        })
    } catch (error) {
        throw new Error(error)
    }

})
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(id);
    try {
        const brand = await Brand.findById(id);
        if (!brand) throw new Error("brand Not Found")
        const deletebrand = await Brand.findByIdAndDelete(id);
        return res.status(201).json({
            success: true,
            data: deletebrand
        })
    } catch (error) {
        throw new Error(error)
    }

})



module.exports = {
    createBrand,
    getAllBrand, getBrand, deleteBrand, updateBrand
};