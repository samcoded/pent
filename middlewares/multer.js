const multer = require("multer");
const os = require("os");
// File upload folder
const DIR = os.tmpdir();

// Multer settings to limit file size and type of image and video Files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(" ").join("-");
        cb(null, fileName);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50, // 50 MB
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === "image") {
            if (
                file.mimetype == "image/png" ||
                file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg"
            ) {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(
                    new Error(
                        "Only .png, .jpg and .jpeg format allowed for images!"
                    )
                );
            }
        } else if (file.fieldname === "video") {
            if (file.mimetype == "video/mp4") {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error("Only .mp4 format allowed for videos!"));
            }
        }

        cb(null, true);
    },
});

module.exports = upload;
