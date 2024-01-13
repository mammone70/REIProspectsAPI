const { HttpResponse } = require('../system/helpers/HttpResponse');
const { Service } = require( '../system/services' );

class ProspectListService extends Service {
    constructor( model ) {
        super( model );
    }

    /**
     *
     * @param prospectId: String
     * @param listId: String
     * @returns {Promise<any>}
     */
    async addProspectToList( prospectId, listId ) {
        try {
            const updatedProspectToList = await this.model.findByIdAndUpdate(
                listId,
                { $addToSet: { prospects: prospectId } },
                { new: true, useFindAndModify: false }
              );
              return new HttpResponse(updatedProspectToList);
              //return updatedProspectToList;
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
    async deleteProspectFromList( prospectId, listId ) {
        try {
            const updatedProspectToList = await this.model.findByIdAndUpdate(
                listId,
                { $pull: { prospects: prospectId } },
                { new: true, useFindAndModify: false }
              );
              return new HttpResponse(updatedProspectToList);
        } catch (e) {
            throw e;
        }
    }

    /**
     *  Adds a single Prospect to a List of ProspectLists
     *  @param prospectId: String
     *  @param ListId: String
     *  @returns {Promise<any>}
     */
    async addProspectToManyLists(prospectId, ListIds){
        try {
            const response = await this.model.updateMany(
                {'_id': ListIds},
                { $addToSet: { prospects: prospectId } },
                //{ new: true, useFindAndModify: false }
              );
              return new HttpResponse(response);
        } catch (e) {
            throw e;
        }
    }

    /**
     *  Adds an array of Prospect IDs to Prospect List
     *  @param prospectId: String
     *  @param ListIds: Array
     *  @returns {Promise<any>}
     */
    async addProspectListToList(prospectListId, prospectIds) {
        try {
            const updatedProspectList = await this.model.findByIdAndUpdate(
                prospectListId,
                { $addToSet: { prospects: prospectIds } },
                { new: true, useFindAndModify: false }
              );
            return new HttpResponse(updatedProspectList);
        } catch (e) {
            throw e;
        }
    }
}


module.exports = { ProspectListService };