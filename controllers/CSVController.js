const { createReadStream } = require('fs');
const { parse } = require('fast-csv');

const { ProspectService } = require( '../services/ProspectService' );
const { Prospect } = require('../models/Prospect');

const fs = require("fs");
const { HttpResponse } = require('../system/helpers/HttpResponse');

const autoBind = require( 'auto-bind' ),
    prospectService = new ProspectService(
        new Prospect().getInstance()
    )

class CSVUploadController {

    constructor(prospectService ){
        this.prospectService = prospectService;
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

            createReadStream(path).pipe(
                parse({ 
                    headers: headers => headers.map((csvHeaderName) => {
                        return csvHeaderToFieldMap[csvHeaderName];
                    }) 
                }))
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
};

module.exports = new CSVUploadController( prospectService );