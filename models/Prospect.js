const mongoose = require("mongoose")
const Joi = require("joi");
const uniqueValidator = require('mongoose-unique-validator');
var addresser = require('addresser');

const { DirectMailInfoSchema } = require("./DirectMailInfo");
const { addUncountableRule } = require("pluralize");

const DirectMailInfo = require("./DirectMailInfo").DirectMailInfo;

class Prospect {
  initSchema(){
    const schema = new mongoose.Schema({
      fullPropertyAddressId: {
        type: String,
        unique: true,
        required:[true, "Full Property Address is required."],
      },
      formattedPropertyAddress: {
        type: String,
        unique: true,
        required:[true, "Formatted Property Address is required."],
      },
      propertyAddress: {
        type: String,
        required: [true, "Property Address is required."],
      },
      propertyCity: {
        type: String,
        required: [true, "Property City is required."],
      },
      propertyState: {
        type: String,
        required: [true, "Property State is required."],
      },
      propertyZipcode: {
        type: String,
        required: [true, "Property Zipcode is required."],
      },
      propertyCounty: {
        type: String,
        required: [true, "Property County is required."],
      },
      ownerFirstName: {
        type: String,
        required: [true, "Owner First Name is required."],
      },
      ownerLastName: {
        type: String,
        required: [true, "Owner Last Name is required."],
      },
      ownerEntity: {
        type: String,
        required: false,
      },
      owner2FirstName: {
        type: String,
        required: false,
      },
      owner2LastName: {
        type: String,
        required: false,
      },
      mailingAddress: {
        type: String,
        required: [true, "Mailing Address is required."],
      },
      mailingCity: {
        type: String,
        required: [true, "Mailing City is required."],
      },
      mailingState: {
        type: String,
        required: [true, "Mailing State is required."],
      },
      mailingZipcode: {
        type: String,
        required: [true, "Mailing Zipcode is required."],
      },
      mailingCounty: {
        type: String,
        required: false,
      },
      phone1: {
          type: Number,
        },
      phone2: {
        type: Number,
      },
      phone3: {
        type: Number,
      },
      phone4: {
        type: Number,
      },
      phone5: {
        type: Number,
      },
      phone6: {
        type: Number,
      },
      phone7: {
        type: Number,
      },
      phone8: {
        type: Number,
      },
      phone9: {
        type: Number,
      },
      phone10: {
        type: Number,
      },
      email1: {
        type: String,
        required: false
      },
      email2: {
        type: String,
        required: false
      },
      //1 to 1 embedded relationship to DirectMailInfo object
      directMailInfo : {
        type: DirectMailInfoSchema,
        required: true,
        default: {}
      },
      //many to many reference relationship to ProspectTag object
      tags: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProspectTag",
        }
      ]
    },  { 'timestamps': true } );

    const generateAddressProps = async function (next, prospect){
      try{
        //generate fullPropertyAddressId even if none of the address
        //components have been changed to insure fullPropertyAddressId
        //isn't manually overwritten
        var parsedAddress =  Prospect.getParsedAddress(
          prospect.propertyAddress,
          prospect.propertyCity,
          prospect.propertyState,
          prospect.propertyZipcode
        );

        prospect.fullPropertyAddressId = parsedAddress.id;
        prospect.formattedPropertyAddress = parsedAddress.formattedAddress;

        // console.log( 'Set fullPropertyAddressId', prospect.fullPropertyAddressId );
        // console.log( 'Set formattedPropertyAddress', prospect.formattedPropertyAddress );
        
      } catch (e) {
        throw e;
      }
      next();
    };

    //generate 'fullPropertyAddressId' and 'formattedPropertyAddress' from address components
    schema.pre( 'validate', async function( next ) {
      try {
        generateAddressProps(next, this);
      } catch (e){
        throw e;
      }
    });

    schema.pre( ['findOneAndUpdate', 'updateOne', 'findByIdAndUpdate'], async function( next ) {
      try {
        const existingProspect = await this.model.findOne(this.getQuery());
        const updatedProspect = this.getUpdate();

        //populate updated Prospect Address info with existing info
        //if it is not being updated so that the Full Address properties
        //can be generated
        if (updatedProspect.propertyAddress == null)
          updatedProspect.propertyAddress = existingProspect.propertyAddress;
        if (updatedProspect.propertyCity == null)
          updatedProspect.propertyCity = existingProspect.propertyCity;
        if (updatedProspect.propertyState == null)
          updatedProspect.propertyState = existingProspect.propertyState;
        if (updatedProspect.propertyZipcode == null)
          updatedProspect.propertyZipcode = existingProspect.propertyZipcode;
        
        generateAddressProps(next, updatedProspect);
      } catch (e){
        throw e;
      }
    });

    schema.plugin( uniqueValidator );
    try {
        mongoose.model( 'Prospect', schema );
    } catch ( e ) {

    }
  };

  getInstance() {
    this.initSchema();
    return mongoose.model( 'Prospect' );
  }

  static getParsedAddress(address, city, state, zipcode) {
    return addresser.parseAddress(address + "," + city + "," + state + " " + zipcode);
  }
};

const validateProspect = data => {
    const schema = Joi.object({
        propertyAddress: Joi.string().min(4).max(100).required(),
        propertyCity: Joi.string().min(2).max(50).required(),
        propertyState: Joi.string().min(2).max(2).required(),
        propertyZipcode: Joi.string().min(5).max(5).required(),
        propertyCounty: Joi.string().min(2).max(50).required(),
        ownerFirstName: Joi.string().min(1).max(50).required(),
        ownerLastName: Joi.string().min(1).max(50).required(),
        ownerEntity: Joi.string().min(4).max(100),
        owner2FirstName: Joi.string().min(1).max(50),
        owner2LastName: Joi.string().min(1).max(50),
        mailingAddress: Joi.string().min(4).max(100).required(),
        mailingCity: Joi.string().min(4).max(50).required(),
        mailingState: Joi.string().min(2).max(2).required(),
        mailingZipcode: Joi.string().min(5).max(5).required(),
        mailingCounty: Joi.string().min(2).max(50),
        
        phone1: Joi.number().min(7).max(10000000000),
        phone2: Joi.number().min(7).max(10000000000),
        phone3: Joi.number().min(7).max(10000000000),
        phone4: Joi.number().min(7).max(10000000000),
        phone5: Joi.number().min(7).max(10000000000),
        phone6: Joi.number().min(7).max(10000000000),
        phone7: Joi.number().min(7).max(10000000000),
        phone8: Joi.number().min(7).max(10000000000),
        phone9: Joi.number().min(7).max(10000000000),
        phone10: Joi.number().min(7).max(10000000000),
        email1: Joi.string().email(),
        email2: Joi.string().email()
    });
    return schema.validate(data);
};

module.exports = {
    Prospect,
    validateProspect,
};