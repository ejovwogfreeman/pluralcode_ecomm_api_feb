const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const imageUploadMiddleware = upload.single("image");

module.exports = imageUploadMiddleware;
