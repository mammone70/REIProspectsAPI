const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const ProspectTagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false,  
    },
    prospects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Prospect",
        }
    ]
});

ProspectTagSchema.plugin(uniqueValidator);

const ProspectTag = new mongoose.model("ProspectTag", ProspectTagSchema)

module.exports = {
    ProspectTag,
    ProspectTagSchema
};