const { createReadStream } = require('fs');
const { parse } = require('fast-csv');

const { ProspectService } = require( '../services/ProspectService' );
const { Prospect } = require('../models/Prospect');

const fs = require("fs");

const autoBind = require( 'auto-bind' ),
    prospectService = new ProspectService(
        new Prospect().getInstance()
    )

class CSVUploadController {

    constructor(prospectService ){
        this.prospectService = prospectService;
        autoBind(this);
    };

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
                        .then(() => {
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