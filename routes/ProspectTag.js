const { ProspectTag } = require("../models/ProspectTag");

const mongoose = require("mongoose");
const router = require("express").Router();

const ProspectTagController = require( '../controllers/ProspectTagController' );
const AuthController = require( '../controllers/AuthController' );

router.post( '/', AuthController.checkLogin, ProspectTagController.insert );
router.get( '/', AuthController.checkLogin, ProspectTagController.getAll );
router.get( '/:id', AuthController.checkLogin, ProspectTagController.get );
router.put( '/:id', AuthController.checkLogin, ProspectTagController.update );
router.delete( '/:id', AuthController.checkLogin, ProspectTagController.delete );

module.exports = router;