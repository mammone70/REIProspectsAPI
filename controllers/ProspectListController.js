const { Controller } = require( '../system/controllers/Controller' );
const { ProspectListService } = require( '../services/ProspectListService' );
const { ProspectList } = require( '../models/ProspectList' );

const autoBind = require( 'auto-bind' ),
    prospectListService = new ProspectListService(
        ProspectList
    );

class ProspectListController extends Controller {

    constructor( service ) {
        super( service );
        autoBind( this );
    }

}

module.exports = new ProspectListController( ProspectListService );