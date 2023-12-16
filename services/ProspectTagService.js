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
}

module.exports = { ProspectTagService };