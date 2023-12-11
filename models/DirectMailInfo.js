const mongoose = require("mongoose");

const DirectMailInfoSchema = new mongoose.Schema({
    unableToDeliver: {
        type: Boolean,
        required: true,
        default: false,
    },
    readyToRetry: {
        type: Boolean,
        required: true,
        default: true,
    },
    lastMailSent: {
        type: Date,
        required: false,
    }
});

    const DirectMailInfo = new mongoose.model("DirectMailInfo", DirectMailInfoSchema)

    module.exports = {
        DirectMailInfo,
        DirectMailInfoSchema
    };