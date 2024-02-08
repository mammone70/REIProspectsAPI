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

router.get(
    "/FieldMapping",
    AuthController.checkLogin,
    csvController.getProspectFields
);

router.get(
    "/Import",
    // AuthController.checkLogin,
    csvController.import
);

module.exports = router;