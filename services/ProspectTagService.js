const { HttpResponse } = require('../system/helpers/HttpResponse');
const { Service } = require( '../system/services' );

class ProspectTagService extends Service {
    constructor( model ) {
        super( model );
    }

    /**
     *
     * @param prospectId: String
     * @param tagId: String
     * @returns {Promise<any>}
     */
    async addProspectToTag( prospectId, tagId ) {
        try {
            const updatedProspectToTag = await this.model.findByIdAndUpdate(
                tagId,
                { $addToSet: { prospects: prospectId } },
                { new: true, useFindAndModify: false }
              );
              return new HttpResponse(updatedProspectToTag);
              //return updatedProspectToTag;
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
    async deleteProspectFromTag( prospectId, tagId ) {
        try {
            const updatedProspectToTag = await this.model.findByIdAndUpdate(
                tagId,
                { $pull: { prospects: prospectId } },
                { new: true, useFindAndModify: false }
              );
              return new HttpResponse(updatedProspectToTag);
        } catch (e) {
            throw e;
        }
    }

    /**
     *  Adds a single Prospect to a List of ProspectTags
     *  @param prospectId: String
     *  @param tagId: String
     *  @returns {Promise<any>}
     */
    async addProspectToManyTags(prospectId, tagIds){
        try {
            const response = await this.model.updateMany(
                {'_id': tagIds},
                { $addToSet: { prospects: prospectId } },
                //{ new: true, useFindAndModify: false }
              );
              return new HttpResponse(response);
        } catch (e) {
            throw e;
        }
    }

    /**
     *  Adds an array of Prospect IDs to Prospect Tag
     *  @param prospectId: String
     *  @param tagIds: Array
     *  @returns {Promise<any>}
     */
    async addProspectListToTag(prospectTagId, prospectIds) {
        try {
            const updatedProspectTag = await this.model.findByIdAndUpdate(
                prospectTagId,
                { $addToSet: { prospects: prospectIds } },
                { new: true, useFindAndModify: false }
              );
            return new HttpResponse(updatedProspectTag);
        } catch (e) {
            throw e;
        }
    }
}


module.exports = { ProspectTagService };