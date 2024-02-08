const { ProspectService } = require( '../services/ProspectService' );
const { Prospect } = require('../models/Prospect');

const { ProspectListService } = require('../services/ProspectListService');
const { ProspectList } = require('../models/ProspectList');

const autoBind = require( 'auto-bind' ),
    prospectService = new ProspectService(
        new Prospect().getInstance()
    ),
    prospectListService = new ProspectListService(
        ProspectList
    );

class ProspectToProspectListController {

    constructor(prospectService,prospectListService ){
        this.prospectService = prospectService;
        this.prospectListService = prospectListService;
        autoBind(this);
    };

    async addListToProspect( req, res, next ){
        const { prospectId, listId } = req.params;
        try {
            const updatedProspectResponse = await this.prospectService.addListToProspect(prospectId, listId);
            const updatedListResponse = await this.prospectListService.addProspectToList(prospectId, listId);
            
            return res
                .status(updatedProspectResponse.statusCode)
                .json(updatedProspectResponse);
        } catch (e) {
            next(e);
        }
    }

    async deleteListFromProspect( req, res, next) {
        const { prospectId, listId } = req.params;

        try {
            const updatedProspectResponse = await this.prospectService.deleteListFromProspect(prospectId, listId);
            const updatedListResponse = await this.prospectListService.deleteProspectFromList(prospectId, listId);
            
            return res
                .status(updatedProspectResponse.statusCode)
                .json(updatedProspectResponse);
        } catch (e) {
            next(e);
        }
    }

    async addListsToProspect( req, res, next) {
        const { prospectId } = req.params;
        const listIds = req.body.listIds;
        
        try {
            const updatedProspectResponse = await this.prospectService.addListsToProspect(prospectId, listIds);
            const updatedListResponse = await this.prospectListService.addProspectToManylists(prospectId, listIds);
            
            return res
                //.status(200)
                .status(updatedProspectResponse.statusCode)
                .json(updatedProspectResponse);
        } catch (e) {
            next(e);
        }
    }

    async addListOfProspectsToList( req, res, next) {
        const { prospectListId } = req.params;
        const prospectIds = req.body.prospectIds;
        
        try {
            // const updatedProspectResponse = await this.prospectService.addlistListToProspect(prospectId, listIds);
            const updatedProspectResponse = await this.prospectService.addListToManyProspects(prospectListId, prospectIds);
            
            // const updatedlistResponse = await this.ProspectListService.addProspectToManylists(prospectId, listIds);
            const updatedListResponse = await this.prospectListService.addProspectListTolist(prospectListId, prospectIds);
            
            return res
                //.status(200)
                .status(updatedProspectResponse.statusCode)
                .json(updatedProspectResponse);
        } catch (e) {
            next(e);
        }
    }

    async addListsToProspectList( req, res, next) {
        const prospectIds = req.body.prospectIds;
        const listIds = req.body.listIds;
        
        try {
            if(prospectIds?.length > 0 && listIds?.length > 0){
                //TODO Write service function that just does 2 UpdateMany DB calls
                for(let prospectId of prospectIds){
                    const updatedProspectResponse = await this.prospectService.addlistListToProspect(prospectId, listIds);
                    const updatedlistResponse = await this.prospectListService.addProspectToManylists(prospectId, listIds);
                }
                
                return res
                    .status(200)
                    //.status(updatedProspectResponse.statusCode)
                    .json({message:"TODO Create Success Message"});
            }
            else {
                return res
                .status(400)
                .json({message: "Must provide a list of Prospect IDs and ProspectList Ids"});
            }
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ProspectToProspectListController( prospectService, prospectListService );