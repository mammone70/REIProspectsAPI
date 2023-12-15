const { Service } = require( '../system/services/Service' );

class ProspectService extends Service {
    constructor( model ) {
        super( model );
    }

}

module.exports = { ProspectService };