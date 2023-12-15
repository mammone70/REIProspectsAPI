const { Controller } = require( '../system/controllers/Controller' );
const { ProspectService } = require( '../services/ProspectService' );
const { Prospect } = require( './../models/Prospect' );

const autoBind = require( 'auto-bind' ),
    prospectService = new ProspectService(
        new Prospect().getInstance()
    );

class ProspectController extends Controller {

    constructor( service ) {
        super( service );
        autoBind( this );
    }

}

module.exports = new ProspectController( prospectService );