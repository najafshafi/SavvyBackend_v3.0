import multer from 'multer';
import crypto from "crypto";
import path from "path"


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images/uploads'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        // cb(null, `ProfileImageUpload-${Date.now()}-${file.originalname}`);
        crypto.randomBytes(12, function (err, name) {
            const fn = `CV - ` + name.toString("hex") + path.extname(file.originalname)
            cb(null, fn)
        })

    }
});

// Initialize upload
const upload = multer({ storage: storage });


export default upload;