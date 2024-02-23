const { Prospect } = require('../models/Prospect');
const { HttpResponse } = require('../system/helpers/HttpResponse');
const { Service } = require( '../system/services' );

const { ProspectTagService } = require('./ProspectTagService');
const { ProspectTag } = require('../models/ProspectTag');
const { ProspectListService } = require('./ProspectListService');
const { ProspectList } = require('../models/ProspectList');

class ProspectService extends Service {
    constructor( model ) {
        super( model );
    }

    //override GET method to populate tags and lists
    async get( id ) {
        try {
            const item = 
                await this.model
                    .findById( id )
                    .populate('tags')
                    .populate('lists');
            if ( !item ) {
                const error = new Error( 'Item not found' );

                error.statusCode = 404;
                throw error;
            }

            return new HttpResponse( item );
        } catch ( errors ) {
            throw errors;
        }
    }

    async filter( query, filterProps ) {
        let { skip, limit, sortBy } = query;

        skip = skip ? Number( skip ) : 0;
        limit = limit ? Number( limit ) : 10000;
        sortBy = sortBy ? sortBy : { 'createdAt': -1 };

        delete query.skip;
        delete query.limit;
        delete query.sortBy;

        if ( query._id ) {
            try {
                query._id = new mongoose.mongo.ObjectId( query._id );
            } catch ( error ) {
                throw new Error( 'Not able to generate mongoose id with content' );
            }
        }

        //build filter
        // const filter = {};
        // if(filterProps.lists.length !== 0) filter["lists"] = { $in: filterProps.lists }; 
        // if(filterProps.tags.length !== 0) filter["tags"] = { $in: filterProps.tags }; 
        
        // filter["$expr"]["$gt"] = [
        //     {$size: "$lists"}, 
        //     filterProps.minListCount ? Number( filterProps.minListCount ) : 0
        // ]
        
        //TODO abstract this filter building functionality into functions/classes
        const filter = {
            $and: [
                {$expr: {$gt: [
                    {$size: "$lists"}, 
                    filterProps.minListCount ? Number( filterProps.minListCount ) : 0
                ]}},
                {$expr: {$lt: [
                    {$size: "$lists"}, 
                    filterProps.maxListCount ? Number( filterProps.maxListCount ) : Number.MAX_SAFE_INTEGER
                ]}},
                {$expr: {$gt: [
                    {$size: "$lists"}, 
                    filterProps.minListCount ? Number( filterProps.minListCount ) : 0
                ]}},
                {$expr: {$lt: [
                    {$size: "$lists"}, 
                    filterProps.maxListCount ? Number( filterProps.maxListCount ) : Number.MAX_SAFE_INTEGER
                ]}},
                {$expr: {$gt: [
                    {$size: "$tags"}, 
                    filterProps.minTagCount ? Number( filterProps.minTagCount ) : 0
                ]}},
                {$expr: {$lt: [
                    {$size: "$tags"}, 
                    filterProps.maxTagCount ? Number( filterProps.maxTagCount ) : Number.MAX_SAFE_INTEGER
                ]}}, 
            ]
        }
        if(filterProps.lists.length !== 0) filter["$and"].push({lists : { $in: filterProps.lists }});
        if(filterProps.tags.length !== 0) filter["$and"].push({tags: { $in: filterProps.tags }}); 

        
        try {
            const items = await this.model
                .find( filter )
                .sort( sortBy )
                .skip( skip )
                .limit( limit );

            const total = await this.model.countDocuments( filter );

            return new HttpResponse( items, { 'totalCount': total } );
        } catch ( errors ) {
            throw errors;
        }
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
     * @param listId: String
     * @returns {Promise<any>}
     */
    async addListToProspect( prospectId, listId ) {
        try {
            const updatedProspect = await this.model.findByIdAndUpdate(
                prospectId,
                { $addToSet: { lists: listId } },
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
     *
     * @param prospectId: String
     * @param listId: String
     * @returns {Promise<any>}
     */
    async deleteListFromProspect( prospectId, listId ) {
        try {
            const updatedProspect = await this.model.findByIdAndUpdate(
                prospectId,
                { $pull: { lists: listId } },
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
     *  Adds an array of ProspectList IDs to Prospect
     *  @param prospectId: String
     *  @param listIds: Array
     *  @returns {Promise<any>}
     */
    async addListListsToProspect( prospectId, listIds ) {
        try {
            const updatedProspect = await this.model.findByIdAndUpdate(
                prospectId,
                { $addToSet: { lists: listIds } },
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

    /**
     *  Adds a ProspectList ID to an array of Prospects
     *  @param prospectListId: String
     *  @param prospectIds: Array
     *  @returns {Promise<any>}
     */
    async addListToManyProspects(prospectListId, prospectIds) {
        try {
            const response = await this.model.updateMany(
                {'_id': prospectIds},
                { $addToSet: { lists: prospectListId } },
                //{ new: true, useFindAndModify: false }
              );
              return new HttpResponse(response);
        } catch (e) {
            throw e;
        }   
    }

    async bulkUpsertProspects(prospects, tagList, listList) {
        try {
            const prospectTagService = new ProspectTagService(ProspectTag);
            const prospectListService = new ProspectListService(ProspectList);

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

                if(listList){
                    const updatedProspectResponse 
                        = await this.addListListsToProspect(updatedProspect.id, listList);
                    const updatedListResponse 
                        = await prospectListService.addProspectToManyLists(updatedProspect.id, listList);            
                }

                updatedProspect.isNew ? insertCount++ : updateCount++;
            }            
            return {
                insertCount:insertCount, 
                updateCount:updateCount
            };
            //^^^^can't invoke middleware on bulkWrite so will do each upsert individually for now
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