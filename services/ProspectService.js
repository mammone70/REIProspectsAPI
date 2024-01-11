const { Prospect } = require('../models/Prospect');
const { HttpResponse } = require('../system/helpers/HttpResponse');
const { Service } = require( '../system/services' );

const { ProspectTagService } = require('./ProspectTagService');
const { ProspectTag } = require('../models/ProspectTag');

class ProspectService extends Service {
    constructor( model ) {
        super( model );
    }

    /**
     *
     * @param prospectId: String
     * @param tagId: String
     * @returns {Promise<any>}
     */
    async addTagToProspect( prospectId, tagId ) {
        try {
            const updatedProspect = await this.model.findByIdAndUpdate(
                prospectId,
                { $addToSet: { tags: tagId } },
                { new: true, useFindAndModify: false }
              );
            return new HttpResponse(updatedProspect);
        } catch (e) {
            throw e;
        }
    }

    /**
     *
     * @param prospectId: String
     * @param tagId: String
     * @returns {Promise<any>}
     */
    async deleteTagFromProspect( prospectId, tagId ) {
        try {
            const updatedProspect = await this.model.findByIdAndUpdate(
                prospectId,
                { $pull: { tags: tagId } },
                { new: true, useFindAndModify: false }
              );
            return new HttpResponse(updatedProspect);
        } catch (e) {
            throw e;
        }
    }
    
    /**
     *  Adds an array of ProspectTag IDs to Prospect
     *  @param prospectId: String
     *  @param tagIds: Array
     *  @returns {Promise<any>}
     */
    async addTagListToProspect( prospectId, tagIds ) {
        try {
            const updatedProspect = await this.model.findByIdAndUpdate(
                prospectId,
                { $addToSet: { tags: tagIds } },
                { new: true, useFindAndModify: false }
              );
            return new HttpResponse(updatedProspect);
        } catch (e) {
            throw e;
        }
    }

    /**
     *  Adds a ProspectTag ID to an array of Prospects
     *  @param prospectTagId: String
     *  @param prospectIds: Array
     *  @returns {Promise<any>}
     */
    async addTagToManyProspects(prospectTagId, prospectIds) {
        try {
            const response = await this.model.updateMany(
                {'_id': prospectIds},
                { $addToSet: { tags: prospectTagId } },
                //{ new: true, useFindAndModify: false }
              );
              return new HttpResponse(response);
        } catch (e) {
            throw e;
        }   
    }

    async bulkUpsertProspects(prospects, tagList) {
        try {
            const prospectTagService = new ProspectTagService(ProspectTag);

            //Track Upsert Stats
            let insertCount = 0, updateCount = 0;

            for(let prospect of prospects){
                //if missing any required address info, skip record
                if(
                    !prospect.propertyAddress ||
                    !prospect.propertyCity ||
                    !prospect.propertyState ||
                    !prospect.propertyZipcode
                ) continue; //TODO log invalid record 

                let parsedAddress = Prospect.getParsedAddress(
                                                    prospect.propertyAddress,
                                                    prospect.propertyCity,
                                                    prospect.propertyState,
                                                    prospect.propertyZipcode
                                                );

                let updatedProspect = await this.model.findOneAndUpdate(
                    //filter
                    {
                        'fullPropertyAddressId' : parsedAddress.id,
                    },
                    
                    //update prospect
                    prospect,
                    
                    //options
                    {
                        new: true,
                        upsert:true,
                    },
                );

                if(tagList){
                    const updatedProspectResponse 
                        = await this.addTagListToProspect(updatedProspect.id, tagList);
                    const updatedTagResponse 
                        = await prospectTagService.addProspectToManyTags(updatedProspect.id, tagList);            
                }

                updatedProspect.isNew ? insertCount++ : updateCount++;
            }            
            return {
                insertCount:insertCount, 
                updateCount:updateCount
            };
            //can't invoke middleware on bulkWrite so will do each upsert individually for now
            // for(let prospect of prospects){
            //     prospectUpserts.push({
            //         'updateOne' : {
            //             'filter' : {
            //                 'propertyAddress': prospect.propertyAddress,
            //                 'propertyCity': prospect.propertyCity,
            //                 'propertyState': prospect.propertyState,
            //                 'propertyZipcode': prospect.propertyZipcode,                                
            //             },
            //             'update' : prospect,
            //             'upsert' : true,
            //         }
            //     });
            // }
            // await this.model.bulkWrite(prospectUpserts);
        } catch (e) {
            throw e;
        }
    }
}

module.exports = { ProspectService };