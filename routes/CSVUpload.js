const router = require("express").Router();
const csvController = require("../controllers/CSVController");
const AuthController = require("../controllers/AuthController");
const upload = require("../middleware/CSVUpload");

router.post(
    "/", 
    AuthController.checkLogin,
    upload.single("file"), 
    csvController.upload
);

module.exports = router;