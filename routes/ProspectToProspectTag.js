const router = require("express").Router();


const ProspectToProspectTagController = require('../controllers/ProspectToProspectTagController');
const AuthController = require( '../controllers/AuthController' );

//add a list of ProspectTag IDs to a list Prospect IDs
//overwrite option?  create option?
router.put(
    '/',
    AuthController.checkLogin,
    ProspectToProspectTagController.addTagListToProspectList
);
  
module.exports = router;