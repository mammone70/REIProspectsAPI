const router = require("express").Router();


const ProspectToProspectListController = require('../controllers/ProspectToProspectListController');
const AuthController = require( '../controllers/AuthController' );

//add a list of ProspectList IDs to a list Prospect IDs
//overwrite option?  create option?
router.put(
    '/',
    AuthController.checkLogin,
    ProspectToProspectListController.addListsToProspectList
);
  
module.exports = router;