const { createReadStream } = require('fs');
const { parse } = require('fast-csv');

const { ProspectService } = require( '../services/ProspectService' );
const { Prospect } = require('../models/Prospect');

const fs = require("fs");
const { HttpResponse } = require('../system/helpers/HttpResponse');
const path = require('path');
const { ProspectListService } = require('../services/ProspectListService');
const { ProspectList } = require('../models/ProspectList');
const { ProspectTagService } = require('../services/ProspectTagService');
const { ProspectTag } = require('../models/ProspectTag');
const { default: mongoose } = require('mongoose');

const autoBind = require( 'auto-bind' ),
    prospectService = new ProspectService(
        new Prospect().getInstance()
    ),
    prospectListService = new ProspectListService(
        ProspectList
    ),
    prospectTagService = new ProspectTagService(
        ProspectTag
    );

class CSVUploadController {

    constructor(    prospectService,
                    prospectTagService,
                    prospectListService ){
        this.prospectService = prospectService;
        this.prospectTagService = prospectTagService;
        this.prospectListService = prospectListService;
        autoBind(this);
    };

    static fieldNames = [
        {
            fieldName : "ownerLastName",
            displayName : "Owner Last Name",
            required : false,
        },
        {
            fieldName : "ownerFirstName",
            displayName : "Owner First Name",
            required : false,
        },
        {
            fieldName : "propertyAddress",
            displayName : "Property Address",
            required : true,
        },
        {
            fieldName : "propertyCity",
            displayName : "Property City",
            required : true,
        },
        {
            fieldName : "propertyState",
            displayName : "Property State",
            required : true,
        },
        {
            fieldName : "propertyZipcode",
            displayName : "Property Zip Code",
            required : true,
        },
        {
            fieldName : "propertyCounty",
            displayName : "Property County",
            required : false,
        },
        {
            fieldName : "ownerEntity",
            displayName : "Owner Entity",
            required : false,
        },
        {
            fieldName : "owner2FirstName",
            displayName : "Owner 2 First Name",
            required : false,
        },
        {
            fieldName : "owner2LastName",
            displayName : "Owner 2 Last Name",
            required : false,
        },
        {
            fieldName : "mailingAddress",
            displayName : "Mailing Address",
            required : false,
        },
        {
            fieldName : "mailingCity",
            displayName : "Mailing City",
            required : false,
        },
        {
            fieldName : "mailingState",
            displayName : "Mailing State",
            required : false,
        },
        {
            fieldName : "mailingZipcode",
            displayName : "Mailing Zip Code",
            required : false,
        },
        {
            fieldName : "mailingCounty",
            displayName : "Mailing County",
            required : false,
        },
        {
            fieldName : "phone1",
            displayName : "Phone 1",
            required : false,
        },
        {
            fieldName : "phone2",
            displayName : "Phone 2",
            required : false,
        },
        {
            fieldName : "phone3",
            displayName : "Phone 3",
            required : false,
        },
        {
            fieldName : "phone4",
            displayName : "Phone 4",
            required : false,
        },
        {
            fieldName : "phone5",
            displayName : "Phone 5",
            required : false,
        },
        {
            fieldName : "phone6",
            displayName : "Phone 6",
            required : false,
        },
        {
            fieldName : "phone7",
            displayName : "Phone 7",
            required : false,
        },
        {
            fieldName : "phone8",
            displayName : "Phone 8",
            required : false,
        },
        {
            fieldName : "phone9",
            displayName : "Phone 9",
            required : false,
        },
        {
            fieldName : "phone10",
            displayName : "Phone 10",
            required : false,
        },
        {
            fieldName : "email1",
            displayName : "Email 1",
            required : false,
        },
        {
            fieldName : "email2",
            displayName : "Email 2",
            required : false,
        },
    ];

    async getProspectFields (req, res, next) {
        try {
            res
                .status(200)
                .json(new HttpResponse(CSVUploadController.fieldNames));
        } catch (error) {
                console.log(error);
                res.status(500).send({
                    message: "Couldn't retrieve CSV fields.",
            });
        }
    }

    async upload (req, res, next) {
        try {
            if (req.file == undefined) {
              return res.status(400).send("Please upload a CSV file!");
            }

            //Get CSV Header to Prospect Field Map from submitted form
            let csvHeaderToFieldMap = req.body;
            
            let tagIds = csvHeaderToFieldMap.tagIds.split(",");
            let prospects = [];

            //TODO put this in config
            let path = __basedir + "/resources/static/assets/uploads/" + req.file.filename;

            createReadStream(path)
                .pipe(
                    parse({ 
                        headers: headers => headers.map((csvHeaderName) => {
                            return csvHeaderToFieldMap[csvHeaderName];
                        }) 
                    })
                )
                .on("error", (error) => {
                    throw error.message;
                })
                .on("data", (prospectRow) => {
                    prospects.push(prospectRow);
                })
                .on("end", () => {
                    // console.table(prospects);
                    // return res.status(200).send("Upload done.");
                    prospectService.bulkUpsertProspects(prospects, tagIds)
                        .then((bulkUpsertStats) => {
                            
                            res.status(200).json({
                            message:
                                "Uploaded the file successfully: " + req.file.originalname,
                            });
                        })
                        .catch((error) => {
                            res.status(500).json({
                            message: "Fail to import data into database!",
                            error: error.message,
                            });
                        });
                });
        } catch (error) {
                console.log(error);
                res.status(500).send({
                message: "Could not upload the file: " + req.file.originalname,
            });
        }
    };
        // } catch (e) {
        //     throw e;
        // }

    // };
    async import (req, res, next) {
        const listSet = new Set();
        const tagSet = new Set();

        // createReadStream(path.resolve(__dirname, "RESimpli_FEB-5-2024_REIProspects.csv"))
        const crs = createReadStream("./RESimpli_FEB-5-2024_REIProspects copy.csv")
            .pipe(
                // parse({ 
                //     headers: headers => headers.map((csvHeaderName, index, ar) => {
                //         // console.log(ar);
                //         return csvHeaderToFieldMap[csvHeaderName];
                //     }) 
                // })
                parse({ headers: true}) 
            )
            .on("error", (error) => {
                console.log(error);
            })
            .on("data", async (prospectRow) => {
                try {
                    //check for a prospect with same address
                    const prospectQuery = {
                        propertyAddress: prospectRow.propertyAddress,
                        propertyCity: prospectRow.propertyCity,
                        propertyState: prospectRow.propertyState,
                        propertyZipcode: prospectRow.propertyZipcode,
                    }


                    // var prospectId;
                    // let prospectResult = await this.prospectService.getAll(prospectQuery);
                    // if(!prospectResult.data[0]){
                    //     //create it
                    //     //insert without tags and lists
                    //     console.log("Creating Prospect: " + prospectQuery);
                    //     prospectResult = await this.prospectService.insert(
                    //         {
                    //             ...prospectRow, 
                    //             lists:[], 
                    //             tags:[]
                    //         }
                    //     );
                    //     prospectId = prospectResult.data._id;
                    // }
                    // else {
                    //     prospectId = prospectResult.data[0]._id;
                    // }

                    const { lists, tags, ...prospectNoListsTags } = prospectRow;
                    const prospectResult = await this.prospectService.upsert(
                        prospectQuery,
                        prospectNoListsTags
                    );
                    const prospectId = prospectResult.data._id;
                    
                    //process tags
                    if(prospectRow.tags){
                        const tags = prospectRow.tags.split(",");
                        const tagIds = new Set();
                        for (let tag of tags){
                            const query = {name:tag};
                            let tagDocument = await this.prospectTagService.upsert(query, query);
                            tagIds.add(tagDocument.data._id);

                            // let tagDocument = await this.prospectTagService.getAll(query);
                            // if(!tagDocument.data[0]){
                            //     //create it
                            //     console.log("Creating Tag: " + query);
                            //     tagDocument = await this.prospectTagService.insert(query);
                            //     tagIds.add(tagDocument.data._id);
                            // }
                            // else {
                            //     //running set of unique Tag IDs
                            //     tagIds.add(tagDocument.data[0]._id)
                            // }
                        }

                        //convert string ids to object ids
                        const tagObjectIds = [...tagIds].map(
                            (tagId) => new mongoose.Types.ObjectId(tagId)
                        );
                       
                        //add list of tags to prospect
                        const updatedProspectResponse = await this.prospectService.addTagListToProspect(prospectId, tagObjectIds);
                        const updatedTagResponse = await this.prospectTagService.addProspectToManyTags(prospectId, tagObjectIds);          
                    }

                    //process lists
                    if(prospectRow.lists){
                        const lists = prospectRow.lists.split(",");
                        const listIds = new Set();
                        for (let list of lists){
                            const query = {name:list};
                            let listDocument = await this.prospectListService.upsert(query, query);
                            listIds.add(listDocument.data._id);
                            
                            // let listDocument = await this.prospectListService.getAll(query);
                            // if(!listDocument.data[0]){
                            //     //create it
                            //     console.log("Creating List: " + query);
                            //     listDocument = await this.prospectListService.insert(query);
                            //     listIds.add(listDocument.data._id);
                            // }
                            // else {
                            //     //running set of unique Tag IDs
                            //     listIds.add(listDocument.data[0]._id)
                            // }
                        }

                        //convert string ids to object ids
                        const listObjectIds = [...listIds].map(
                            (listId) => new mongoose.Types.ObjectId(listId)
                        );
                       
                        //add list of lists to prospect
                        const updatedProspectResponse = await this.prospectService.addListListsToProspect(prospectId, listObjectIds);
                        const updatedListResponse = await this.prospectListService.addProspectToManyLists(prospectId, listObjectIds);          
                    }

                } catch ( e ) {
                    next( e );
                }
            })
            // .on("data", (prospectRow) => {
            //     if(prospectRow.tags){
            //         prospectRow.tags.split(",").forEach(element => {
            //             tagSet.add(element);
            //         });
            //     }
            //     if(prospectRow.lists){
            //         prospectRow.lists.split(",").forEach(element => {
            //             listSet.add(element);
            //         });
            //     }
            // })
            .on("end", async () => {
                // const tagResponse = await this.prospectTagService.getAll({limit:300});
                // const tagsNotInDB = new Set();
                // if(tagResponse.data){
                //     tagSet.forEach(tag => {
                //         if(!tagResponse.data.find((dbTag) => {
                //             return dbTag.name === tag;
                //         })) {
                //             tagsNotInDB.add(tag);
                //         }
                //     });
                // }
                // console.log(tagsNotInDB);

                // const listResponse = await this.prospectListService.getAll({limit:300});
                // const listsNotInDB = new Set();
                // if(listResponse.data){
                //     listSet.forEach(list => {
                //         if(!listResponse.data.find((dbList) => {
                //             return dbList.name === list;
                //         })) {
                //             listsNotInDB.add(list);
                //         }
                //     });
                // }
                // console.log(listsNotInDB);

                // console.table(prospects);
                // return res.status(200).send("Upload done.");
                // prospectService.bulkUpsertProspects(prospects, tagIds)
                //     .then((bulkUpsertStats) => {
                        
                //         res.status(200).json({
                //         message:
                //             "Uploaded the file successfully: " + req.file.originalname,
                //         });
                //     })
                //     .catch((error) => {
                //         res.status(500).json({
                //         message: "Fail to import data into database!",
                //         error: error.message,
                //         });
                //     });
            });
        res.status(200).json({message:"Import Route"});    
    };    
};


module.exports = new CSVUploadController( prospectService, prospectTagService, prospectListService );