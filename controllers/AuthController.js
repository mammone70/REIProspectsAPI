const { AuthService } = require( '../services/AuthService' );
const { Auth } = require( '../models/Auth' );
const { User } = require( '../models/User' );
const autoBind = require( 'auto-bind' );
const bcrypt = require( 'bcrypt' ),
    SALT_WORK_FACTOR = 10,
    authService = new AuthService(
        new Auth().getInstance(), new User().getInstance()
    );

class AuthController {

    constructor( service ) {
        this.service = service;
        autoBind( this );
    }

    async login( req, res, next ) {
        const {
            email, 
            password
        } = req.body;

        if(!email || !password) 
            return res
                .status(400)
                .json({error:"Please provide email and password"});

        try {
            const response = await this.service.login( email, password );

            await res.status( response.statusCode ).json( response );
        } catch ( e ) {
            next( e );
        }
    }

    async register( req, res, next ) {
        //get the User attributes in the request body
        const {
            name,
            email,
            password,
        } = req.body;

        console.log(name);
        console.log(email);
        console.log(password);
        
        //validate properties
        if(!name || !email || !password)
            return res.
                status(400)
                .json({error: `Please enter all the required field.`});
        
        //validate email
        const emailReg = 
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/        
        
        if(!emailReg.test(email)) 
            return res
                .status(400)
                .json({error:"Please enter a valid email address."})

        //password validation
        if(password.length < 8) 
            return res
                .status(400)
                .json({error: 'Password must be at least 8 characters'});

        //username validation
        if(name.length > 25) 
            return res
                .status(400)
                .json({error:"Username must be less than 25 characters."})

        try {
            const registeredUserData = await this.service.register( req.body );

            await res.status( 200 ).json( registeredUserData );
        } catch ( e ) {
            next( e );
        }
    }


    async changePassword( req, res, next ) {
        try {
            const id = req.user._id;

            bcrypt.genSalt( SALT_WORK_FACTOR, async( err, salt ) => {
                if ( err ) {
                    return next( err );
                }
                bcrypt.hash( req.body.password, salt, async( hashErr, hash ) => {
                    if ( hashErr ) {
                        return next( hashErr );
                    }
                    const data = { 'password': hash },
                        response = await this.service.changePassword( id, data );

                    await res.status( response.statusCode ).json( response );
                } );
            } );
        } catch ( e ) {
            next( e );
        }
    }

    async logout( req, res, next ) {
        try {
            const response = await this.service.logout( req.token );

            await res.status( response.statusCode ).json( response );
        } catch ( e ) {
            next( e );
        }
    }

    async checkLogin( req, res, next ) {
        try {
            const token = this.extractToken( req );

            req.user = await this.service.checkLogin( token );
            req.authorized = true;
            req.token = token;
            next();
        } catch ( e ) {
            next( e );
        }
    }

    extractToken( req ) {
        if ( req.headers.authorization && req.headers.authorization.split( ' ' )[ 0 ] === 'Bearer' ) {
            return req.headers.authorization.split( ' ' )[ 1 ];
        } else if ( req.query && req.query.token ) {
            return req.query.token;
        }
        return null;
    }


}

module.exports = new AuthController( authService );