const { ProspectService } = require( '../services/ProspectService' );
const { Prospect } = require('../models/Prospect');

const { ProspectTagService } = require('../services/ProspectTagService');
const { ProspectTag } = require('../models/ProspectTag');

const autoBind = require( 'auto-bind' ),
    prospectService = new ProspectService(
        new Prospect().getInstance()
    ),
    prospectTagService = new ProspectTagService(
        ProspectTag
    );

class ProspectToProspectTagController {

    constructor(prospectService,prospectTagService ){
        this.prospectService = prospectService;
        this.prospectTagService = prospectTagService;
        autoBind(this);
    };

    async addTagToProspect( req, res, next ){
        const { prospectId, tagId } = req.params;

        try {
            const updatedProspectResponse = await this.prospectService.addTagToProspect(prospectId, tagId);
            const updatedTagResponse = await this.prospectTagService.addProspectToTag(prospectId, tagId);
            
            return res
                .status(updatedProspectResponse.statusCode)
                //.status(200)
                .json(updatedProspectResponse);
        } catch (e) {
            next(e);
        }
    }

    async deleteTagFromProspect( req, res, next) {

    }

    async addListOfTagsToProspect( req, res, next) {

    }


}

module.exports = new ProspectToProspectTagController( prospectService, prospectTagService );