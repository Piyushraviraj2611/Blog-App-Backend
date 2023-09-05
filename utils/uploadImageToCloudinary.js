const { cloudinary } = require("./cloudinary");



const uploadImagetoCloudinary = async (image) => {
    const uploadedResponse = await cloudinary.uploader.upload(
        image,
        {
            width: 800,
            height: 600,
            crop: "fill",
            quality: "auto",
            upload_preset: "blogProjectPreset",
            format: "jpg",
        },
        (err, result) => {
            if (err) {
                return next(new ErrorHandler("Error uploading image", 500));
            }
            return result;
        }
    );

    return uploadedResponse;
}


module.exports = uploadImagetoCloudinary;