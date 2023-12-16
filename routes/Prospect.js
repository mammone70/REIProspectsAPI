const { Prospect } = require("../models/Prospect");
//const auth = require("../../middleware/auth");

const mongoose = require("mongoose");
const { DirectMailInfo } = require("../models/DirectMailInfo");
const router = require("express").Router();

const ProspectController = require( '../controllers/ProspectController' );
const AuthController = require( '../controllers/AuthController' );
const ProspectToProspectTagController = require('../controllers/ProspectToProspectTagController');

router.post( '/', AuthController.checkLogin, ProspectController.insert );
router.get( '/', AuthController.checkLogin, ProspectController.getAll );
router.get( '/:id', AuthController.checkLogin, ProspectController.get );
router.put( '/:id', AuthController.checkLogin, ProspectController.update );
router.delete( '/:id', AuthController.checkLogin, ProspectController.delete );

//Prospect to ProspectTag routes

//add a list of ProspectTag ids to a Prospect
//overwrite option?  create option?
//router.post('/:id/ProspectTags')

//add a single ProspectTag to a Prospect
router.put(
  '/:prospectId/ProspectTags/:tagId', 
  AuthController.checkLogin, 
  ProspectToProspectTagController.addTagToProspect
);
//delete a single ProspectTag from a Prospect
//router.delete('/:prospectId/ProspectTags/:tagId)

//get all ProspectTags for a Prospect
//router.get('/:id/ProspectTags)

//create a prospect
// router.post("/Prospect", auth, async (req, res) => {
//     //const {error} = validateProspect(req.body);

//     // if (error) {
//     //     return res
//     //             .status(400)
//     //             .json({error: error.details[0].message});
//     // }

//     const {
//         propertyAddress,
//         propertyCity,
//         propertyState,
//         propertyZipcode,
//         propertyCounty,
//         ownerFirstName,
//         ownerLastName,
//         ownerEntity,
//         owner2FirstName,
//         owner2LastName,
//         mailingAddress,
//         mailingCity,
//         mailingState,
//         mailingZipcode,
//         mailingCounty,
//         phone1,
//         phone2,
//         phone3,
//         phone4,
//         phone5,
//         phone6,
//         phone7,
//         phone8,
//         phone9,
//         phone10,
//         email1,
//         email2,
//     } = req.body;

//     try{
//         const newProspect = new Prospect({
//             propertyAddress,
//             propertyCity,
//             propertyState,
//             propertyZipcode,
//             propertyCounty,
//             ownerFirstName,
//             ownerLastName,
//             ownerEntity,
//             owner2FirstName,
//             owner2LastName,
//             mailingAddress,
//             mailingCity,
//             mailingState,
//             mailingZipcode,
//             mailingCounty,
//             phone1,
//             phone2,
//             phone3,
//             phone4,
//             phone5,
//             phone6,
//             phone7,
//             phone8,
//             phone9,
//             phone10,
//             email1,
//             email2,
//         });

//         const result = await newProspect.save();

//         return res.status(200).json({...result._doc});
//     }
//     catch (err){
//         console.log(err);
//     }
// });

// fetch prospect.
// router.get("/Prospect", auth, async (req, res) => {
//     try {
        
//         //TODO filter contacts with input query
//         const prospects = await Prospect.find();
  
//         return res.status(200).json({ prospects: prospects.reverse() });
//     } catch (err) {
//       console.log(err);
//     }
//   });

  // to get a single prospect.
// router.get("/prospect/:id", auth, async (req, res) => {
//     const { id } = req.params;
  
//     if (!id) return res.status(400).json({ error: "no id specified." });
  
//     if (!mongoose.isValidObjectId(id))
//       return res.status(400).json({ error: "please enter a valid id" });
  
//     try {
//         const prospect = await Prospect.findOne({ _id: id });

//         return res.status(200).json({ ...prospect._doc });
//     } catch (err) {
//       console.log(err);
//     }
//   });

// update prospect.
// router.put("/Prospect/:id", auth, async (req, res) => {
//     const { id } = req.params;
  
//     if (!id) return res.status(400).json({ error: "no id specified." });
//     if (!mongoose.isValidObjectId(id))
//         return res.status(400).json({ error: "please enter a valid id" });
  
//     try {
//         const prospect = await Prospect.findOne({ _id: id });
  
//     //   if (req.user._id.toString() !== contact.postedBy._id.toString())
//     //     return res
//     //       .status(401)
//     //       .json({ error: "you can't edit other people contacts!" });
        
//         //validate new Prospect data
//         // const {error} = validateProspect(req.body);

//         // if (error) {
//         //     return res
//         //             .status(400)
//         //             .json({error: error.details[0].message});
//         // }
//         const updatedData = { ...req.body, id: undefined };
//         const result = 
//             await Prospect
//             .findByIdAndUpdate(id, updatedData, {
//                 //return the new version of the Prospect
//                 new: true,
//         });
  
//         return res.status(200).json({ ...result._doc });
//     } catch (err) {
//         console.log(err);
//     }
// });
    
// delete a prospect.
// router.delete("/Prospect/:id", auth, async (req, res) => {
//     const { id } = req.params;

//     if (!id) return res.status(400).json({ error: "no id specified." });

//     if (!mongoose.isValidObjectId(id))
//         return res.status(400).json({ error: "please enter a valid id" });
//     try {
//         const prospect = await Prospect.findOne({ _id: id });
//         if (!prospect) return res.status(400).json({ error: "no prospect found" });

//         // if (req.user._id.toString() !== contact.postedBy._id.toString())
//         // return res
//         //     .status(401)
//         //     .json({ error: "you can't delete other people contacts!" });

//         const result = await Prospect.deleteOne({ _id: id });
//         const prospects = await Prospect.find({});

//         return res
//         .status(200)
//         .json({ ...prospect._doc, prospects: prospects.reverse() });
//     } catch (err) {
//         console.log(err);
//     }
// });
  
//add Direct Mail Info to a Prospect.
// router.post("/Prospect/:id/DirectMailInfo", auth, async (req, res) => {
    
//     const { id } = req.params;
    
//     if (!id) return res.status(400).json({ error: "no id specified." });
    
//     if (!mongoose.isValidObjectId(id))
//         return res.status(400).json({ error: "please enter a valid id" });
    
//     try {
//         const prospect = await Prospect.findOne({ _id: id });

//         //check prospect exists
//         if(!prospect)
//             return res.status(404).json({error: "Invalid Prospect ID"});

//         //check for existing DirectMailInfo object on Prospect
//         if(prospect.directMailInfo)
//             return res
//                     .status(409)
//                     .json({
//                         error: "Prospect already has a DirectMailInfo property object."})
        
//         const {
//             unableToDeliver,
//             readyToRetry,
//             lastMailSent,
//         } = req.body;
        
//         const directMailInfo = new DirectMailInfo({
//             unableToDeliver,
//             readyToRetry,
//             lastMailSent,
//         });

//         const updatedData = { 
//             ...prospect._doc, 
//             id: undefined,
//             directMailInfo: directMailInfo,
//         };

//         const result = 
//             await Prospect
//             .findByIdAndUpdate(id, updatedData, {
//                 //return the new version of the Prospect
//                 new: true,
//         });
        
//         return res.status(200).json({ ...result._doc });
//     } catch (err) {
//         return res.status(500).json({error: err});
//     }
// });

module.exports = router;