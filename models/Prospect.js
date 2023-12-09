const mongoose = require("mongoose")
const Joi = require("joi");

const PropspectSchema = new mongoose.Schema({
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
});

const Prospect = new mongoose.model("Prospect", PropspectSchema)

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