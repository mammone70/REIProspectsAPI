const { ProspectService } = require( '../services/ProspectService' );
const { Prospect } = require('../models/Prospect');

const { ProspectTagService } = require('../services/ProspectTagService');
const { ProspectTag } = require('../models/ProspectTag');

const autoBind = require( 'auto-bind' ),
    prospectService = new ProspectService(
        new Prospect().getInstance()
    ),
    prospectTagService = new ProspectTagService(
        ProspectTag
    );

class CSVUploadController {

    constructor(prospectService,prospectTagService ){
        this.prospectService = prospectService;
        this.prospectTagService = prospectTagService;
        autoBind(this);
    };
}

module.exports = new CSVUploadController9oooooovbgggggg( prospectService, prospectTagService );