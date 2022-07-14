const multer = require('multer');
const path = require("path");
const { nanoid } = require("nanoid");
const fs = require('fs');

const fileValdation = {
    image: ['image/jpeg', ' image/png', 'image/gif'],
    pdf: ['apllication/pdf']
}

const HME = (error, req, res, next) => {
    if (error) {
        res.status(400).json({ message: "multer error", error });
    } else {
        next();
    }
}

function myMulter(customPath, customValidation) {
    if (!customPath) {
        customPath = 'general';
    }

    const fullPath = path.join(__dirname, `../uploads/${customPath}`);

    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            req.finalDestination = `uploads/${customPath}`
            cb(null, fullPath)
        },

        filename: function (req, file, cb) {
            // originalname will have the name of the file with its extention
            cb(null, nanoid() + "_" + file.originalname)
        }
    });

    // to check the format of the file
    const fileFilter = function (req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            req.fileErr = true;
            cb(null, false);
        }
    }
    // filesize take value in bytes
    // 6 million bytes = 6MB
    const upload = multer({ dest: fullPath, fileFilter, limits: { fileSize: 6000000 }, storage });

    return upload;
}

module.exports = {
    myMulter,
    fileValdation,
    HME
}