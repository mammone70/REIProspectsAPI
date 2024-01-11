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
                .json(updatedProspectResponse);
        } catch (e) {
            next(e);
        }
    }

    async deleteTagFromProspect( req, res, next) {
        const { prospectId, tagId } = req.params;

        try {
            const updatedProspectResponse = await this.prospectService.deleteTagFromProspect(prospectId, tagId);
            const updatedTagResponse = await this.prospectTagService.deleteProspectFromTag(prospectId, tagId);
            
            return res
                .status(updatedProspectResponse.statusCode)
                .json(updatedProspectResponse);
        } catch (e) {
            next(e);
        }
    }

    async addListOfTagsToProspect( req, res, next) {
        const { prospectId } = req.params;
        const tagIds = req.body.tagIds;
        
        try {
            const updatedProspectResponse = await this.prospectService.addTagListToProspect(prospectId, tagIds);
            const updatedTagResponse = await this.prospectTagService.addProspectToManyTags(prospectId, tagIds);
            
            return res
                //.status(200)
                .status(updatedProspectResponse.statusCode)
                .json(updatedProspectResponse);
        } catch (e) {
            next(e);
        }
    }

    async addListOfProspectsToTag( req, res, next) {
        const { prospectTagId } = req.params;
        const prospectIds = req.body.prospectIds;
        
        try {
            // const updatedProspectResponse = await this.prospectService.addTagListToProspect(prospectId, tagIds);
            const updatedProspectResponse = await this.prospectService.addTagToManyProspects(prospectTagId, prospectIds);
            
            // const updatedTagResponse = await this.prospectTagService.addProspectToManyTags(prospectId, tagIds);
            const updatedTagResponse = await this.prospectTagService.addProspectListToTag(prospectTagId, prospectIds);
            
            return res
                //.status(200)
                .status(updatedProspectResponse.statusCode)
                .json(updatedProspectResponse);
        } catch (e) {
            next(e);
        }
    }

    async addTagListToProspectList( req, res, next) {
        const prospectIds = req.body.prospectIds;
        const tagIds = req.body.tagIds;
        
        try {
            if(prospectIds?.length > 0 && tagIds?.length > 0){
                //TODO Write service function that just does 2 UpdateMany DB calls
                for(let prospectId of prospectIds){
                    const updatedProspectResponse = await this.prospectService.addTagListToProspect(prospectId, tagIds);
                    const updatedTagResponse = await this.prospectTagService.addProspectToManyTags(prospectId, tagIds);
                }
                
                return res
                    .status(200)
                    //.status(updatedProspectResponse.statusCode)
                    .json({message:"TODO Create Success Message"});
            }
            else {
                return res
                .status(400)
                .json({message: "Must provide a list of Prospect IDs and ProspectTag Ids"});
            }
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ProspectToProspectTagController( prospectService, prospectTagService );