const router = require("express").Router();
const csvController = require("../controllers/CSVController");
const upload = require("../middleware/CSVUpload");

router.post("/", upload.single("file"), csvController.upload);

module.exports = router;