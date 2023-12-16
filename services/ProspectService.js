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
}

module.exports = { ProspectService };