const { HttpResponse } = require('../system/helpers/HttpResponse');
const { Service } = require( '../system/services' );

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
}

module.exports = { ProspectService };