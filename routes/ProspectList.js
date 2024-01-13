const { ProspectList } = require("../models/ProspectList");

const mongoose = require("mongoose");
const router = require("express").Router();

const ProspectListController = require( '../controllers/ProspectListController' );
const AuthController = require( '../controllers/AuthController' );
const ProspectToProspectListController = require('../controllers/ProspectToProspectListController');

router.post( '/', AuthController.checkLogin, ProspectListController.insert );
router.get( '/', AuthController.checkLogin, ProspectListController.getAll );
router.get( '/:id', AuthController.checkLogin, ProspectListController.get );
router.put( '/:id', AuthController.checkLogin, ProspectListController.update );
router.delete( '/:id', AuthController.checkLogin, ProspectListController.delete );

//add a list of Prospects ids to a ProspectLists
//overwrite option?  create option?
router.put(
    '/:ProspectListId/Prospects',
    AuthController.checkLogin,
    ProspectToProspectListController.addListOfProspectsTolist
);

module.exports = router;