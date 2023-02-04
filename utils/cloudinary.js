const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const cloudinaryUploadImage = (files) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(files, (error, result) => {
            if (error) {
                reject("not working");
            } else {
                resolve({
                    url: result.secure_url,
                }, {
                    resource_type: "auto"
                });
            }
        });
    });
};
module.exports = cloudinaryUploadImage;