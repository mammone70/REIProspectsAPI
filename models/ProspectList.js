const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const ProspectListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false,  
    },
    //many to many relationship with Prospects
    prospects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Prospect",
        }
    ]
});

ProspectListSchema.plugin(uniqueValidator);

const ProspectList = new mongoose.model("ProspectList", ProspectListSchema)

module.exports = {
    ProspectList,
    ProspectListSchema
};