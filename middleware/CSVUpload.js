const multer = require("multer");
const fs = require('node:fs');

const csvFilter = (req, file, cb) => {
    if (file.mimetype.includes("csv")) {
        cb(null, true);
    } else {
        cb("Please upload only csv file.", false);
    }
};

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const storageDir = __basedir + "/resources/static/assets/uploads/";
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }
      cb(null, storageDir);
    },
    filename: (req, file, cb) => {
      // console.log(file.originalname);
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

var uploadFile = multer({ storage: storage, fileFilter: csvFilter });
module.exports = uploadFile;
