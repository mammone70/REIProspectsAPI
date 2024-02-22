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
    };

    async filter( req, res, next ) {
        try {
            const response = await this.service.filter( req.query, req.body );

            return res.status( response.statusCode ).json( response );
        } catch ( e ) {
            next( e );
        }
    }
}

module.exports = new ProspectController( prospectService );