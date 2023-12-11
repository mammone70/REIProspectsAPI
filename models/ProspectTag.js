const mongoose = require("mongoose");

const ProspectTagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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

const ProspectTag = new mongoose.model("ProspectTag", ProspectTagSchema)

module.exports = {
    ProspectTag,
    ProspectTagSchema
};