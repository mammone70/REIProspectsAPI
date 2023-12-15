const { Controller } = require( '../system/controllers/Controller' );
const { ProspectTagService } = require( '../services/ProspectTagService' );
const { ProspectTag } = require( './../models/ProspectTag' );

const autoBind = require( 'auto-bind' ),
    prospectTagService = new ProspectTagService(
        ProspectTag
    );

class ProspectTagController extends Controller {

    constructor( service ) {
        super( service );
        autoBind( this );
    }

}

module.exports = new ProspectTagController( prospectTagService );