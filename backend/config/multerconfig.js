const multer = require('multer');
const crypto = require("crypto");
const path = require("path")


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images/uploads'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        // cb(null, `ProfileImageUpload-${Date.now()}-${file.originalname}`);
        crypto.randomBytes(12, function (err, name) {
            const fn = `ProfileImage - ` + name.toString("hex") + path.extname(file.originalname)
            cb(null, fn)
        })



    }
});

// Initialize upload
const upload = multer({ storage: storage });


module.exports = upload;