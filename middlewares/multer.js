const multer = require('multer');
const ErrorHandler = require("../utils/errorHandler");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.includes('image')) {
        return cb(new ErrorHandler('Please upload only images', 400), false);
    }
    cb(null, true);
}

module.exports = multer({ storage, fileFilter });